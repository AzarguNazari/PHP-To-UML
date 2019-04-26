package patterns;
import graph.ClassCell;
import graph.Edge;
import graph.Graph;
import graph.SignatureParser;
import graphviz.GraphvizEdge;
import graphviz.GraphvizElement;
import graphviz.GraphvizGlobalParams;
import graphviz.GraphvizNode;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.HashMap;

import org.objectweb.asm.Opcodes;
import org.objectweb.asm.Type;
import org.objectweb.asm.tree.FieldNode;
import org.objectweb.asm.tree.MethodNode;

public abstract class Pattern {
    /**
     * Creates a new GraphvizElement list that holds all the abstract
     * information necessary to draw the passed graph.
     *
     * @param detected The graph to generate GraphvizElement's for.
     * @return A new GraphvizElement list for detected.
     */
    public List<GraphvizElement> toGraphviz(Graph detected) {
        List<GraphvizElement> elements = new ArrayList<>();
        String cellName;

        //global params
        GraphvizGlobalParams params = new GraphvizGlobalParams();
        params.addAttribute("rankdir", "BT");
        elements.add(params);
        SignatureParser parsed;

        // nodes
        for (ClassCell cell : detected.getCells()) {
            cellName = cell.getPrettyName();
            GraphvizNode node = new GraphvizNode(cellName);
            node.addAttribute("shape", "\"record\"");

            String fields = "";
            List<FieldNode> fieldList = cell.getFieldNodes();

            for(FieldNode fieldNode : fieldList) {
                parsed = new SignatureParser(fieldNode.signature == null ? fieldNode.desc : fieldNode.signature);
                fields += getAccessChar(fieldNode.access) + " " + fieldNode.name + ": " + parsed.toGraphviz() +
                        "<br align=\"left\"/>";
            }

            String methods = "";
            List<MethodNode> methodList = cell.getMethods();

            for(MethodNode methodNode : methodList){
                methods += translateMethodNode(methodNode);
            }

            if ((cell.getAccess() & Opcodes.ACC_ABSTRACT) != 0 || (cell.getAccess() & Opcodes.ACC_INTERFACE) != 0) {
                cellName = "<I>" + cellName + "</I>";
            }

            node.addAttribute("label", "<{" + cellName + "|" + fields + "|" + methods + "}>");
            elements.add(node);
        }

        //edges
        Map<Edge, GraphvizEdge> edgeToGVEdge = new HashMap<>();
        for(Edge edge : detected.getEdges()) {
            String from = edge.getOrigin().getPrettyName();
            String to = edge.getDestination().getPrettyName();

            GraphvizEdge gvEdge = new GraphvizEdge(from, to, edge.getRelation().toString());
            boolean wasDuplicate = false;
            switch (edge.getRelation()) {
            case IMPLEMENTS:
                gvEdge.addAttribute("arrowhead", "\"onormal\"");
                gvEdge.addAttribute("style", "\"dashed\"");
                elements.add(gvEdge);
                break;
            case EXTENDS:
                gvEdge.addAttribute("arrowhead", "\"onormal\"");
                elements.add(gvEdge);
                break;
            case ASSOCIATION:
                wasDuplicate = false;
                
                for (Edge otherEdge : edgeToGVEdge.keySet()) {
                    if (from.equals(otherEdge.getOrigin().getPrettyName())
                            && to.equals(otherEdge.getDestination().getPrettyName())) {
                        if (otherEdge.getCardinality() == Edge.Cardinality.ONE
                                && edge.getCardinality() == Edge.Cardinality.MANY) {
                            edgeToGVEdge.remove(otherEdge);
                            break;
                        } else {
                            wasDuplicate = true;
                            break;
                        }
                    } else if (from.equals(otherEdge.getDestination().getPrettyName())
                            && to.equals(otherEdge.getOrigin().getPrettyName())
                            && edge.getRelation() == Edge.Relation.ASSOCIATION
                            && otherEdge.getRelation() == Edge.Relation.ASSOCIATION){
                        edgeToGVEdge.get(otherEdge).addAttribute("dir", "\"both\"");
                        edgeToGVEdge.get(otherEdge).addAttribute("taillabel", "\"" + edge.getCardinality().toString() + "\"");
                        wasDuplicate = true;
                        break;
                    }
                }

                if(!wasDuplicate){
                    gvEdge.addAttribute("headlabel", "\"" + edge.getCardinality().toString() + "\"");
                    gvEdge.addAttribute("labeldistance", "1.7");
                    elements.add(gvEdge);
                    edgeToGVEdge.put(edge, gvEdge); 
                }
                
                break;
            case DEPENDS:
                wasDuplicate = false;
                /*if (detected.containsEdge(edge.getOrigin(), edge.getDestination(), Edge.Relation.ASSOCIATION)) {
                    break;
                }*/
                
                for(Edge otherEdge : edgeToGVEdge.keySet()){
                    if (from.equals(otherEdge.getOrigin().getPrettyName())
                            && to.equals(otherEdge.getDestination().getPrettyName())) {
                        if (otherEdge.getCardinality() == Edge.Cardinality.ONE
                                && edge.getCardinality() == Edge.Cardinality.MANY) {
                            edgeToGVEdge.remove(otherEdge);
                            break;
                        } else {
                            wasDuplicate = true;
                            break;
                        }
                    } else if (from.equals(otherEdge.getDestination().getPrettyName())
                            && to.equals(otherEdge.getOrigin().getPrettyName())
                            && edge.getRelation() == Edge.Relation.DEPENDS
                            && otherEdge.getRelation() == Edge.Relation.DEPENDS){
                        edgeToGVEdge.get(otherEdge).addAttribute("dir", "\"both\"");
                        edgeToGVEdge.get(otherEdge).addAttribute("taillabel", "\"" + edge.getCardinality().toString() + "\"");
                        wasDuplicate = true;
                        break;
                    }
                }

                if(!wasDuplicate){
                    gvEdge.addAttribute("headlabel", "\"" + edge.getCardinality().toString() + "\"");
                    gvEdge.addAttribute("labeldistance", "1.7");
                    gvEdge.addAttribute("style", "\"dashed\"");
                    elements.add(gvEdge);
                    edgeToGVEdge.put(edge, gvEdge); 
                }
                
                break;
            default:
                System.err.println("Pattern::Unrecognized relation: " + edge.getRelation());
                break;
            }
        }

        return elements;
    }

    /**
     * Creates a new Graph with all the nodes from graphToSearch that fit this
     * pattern. If there are multiple occurences of the pattern, it will return
     * all of them in one disconnected Graph.
     *
     * @param graphToSearch The Graph to search through for the pattern.
     * @return A new Graph containing all the detected nodes and edges.
     */
    public abstract Graph detect(Graph graphToSearch);

    /**
     * Translates a MethodNode into a Graphviz string.
     *
     * @param node The MethodNode to convert
     * @return A Graphviz String representing the passed MethodNode
     */
    private String translateMethodNode(MethodNode node){
        String result = "";

        // Modifiers such as static are currently ignored.

        result += getAccessChar(node.access) + " ";

        String arguments = "(";
        String returnType;
        String signature = node.signature;
        if (signature == null) {
            returnType = Type.getReturnType(node.desc).getClassName();
            List<String> argTypes = new ArrayList<>();
            for (Type argType : Type.getArgumentTypes(node.desc)){
                argTypes.add(argType.getClassName());
            }
            arguments += String.join(", ", argTypes) + ")";
        } else {
            List<SignatureParser> parsedArguments;
            int startArgs = signature.indexOf('(');
            int endArgs = signature.indexOf(')');
            if (endArgs - startArgs > 1) {
                int i;
                parsedArguments = SignatureParser.parseFullSignature(signature.substring(startArgs + 1, endArgs));
                for (i = 0; i < parsedArguments.size() - 1; i++) {
                    arguments += parsedArguments.get(i).toGraphviz() + ", ";
                }
                arguments += parsedArguments.get(i).toGraphviz();
            }
            arguments += ")";

            returnType = signature.substring(endArgs + 1);
            returnType = new SignatureParser(returnType).toGraphviz();
        }

        result += node.name
            + arguments
            + ": "
            + returnType
            + "<br align=\"left\"/>";

        return result;
    }

    /**
     * Looks up which access character should be used for a given access level.
     *
     * @param access The access bitfield to be masked with Opcodes.
     * @return A char correlating to that level of access.
     */
    private char getAccessChar(int access){
        if((access & Opcodes.ACC_PUBLIC) > 0){
            return '+';
        }else if((access & Opcodes.ACC_PRIVATE) > 0){
            return '-';
        }else if((access & Opcodes.ACC_PROTECTED) > 0){
            return '#';
        }
        return ' ';

    }

    public void setArgs(String[] args) {
        // Do nothing
    }
}
