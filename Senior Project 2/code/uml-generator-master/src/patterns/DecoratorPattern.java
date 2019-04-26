package patterns;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.objectweb.asm.Opcodes;
import org.objectweb.asm.tree.MethodNode;

import graph.AccessLevel;
import graph.ClassCell;
import graph.Edge;
import graph.Field;
import graph.Graph;
import graphviz.GraphvizEdge;
import graphviz.GraphvizElement;
import graphviz.GraphvizNode;

public class DecoratorPattern extends Pattern {
    
    @Override
    public List<GraphvizElement> toGraphviz(Graph detected) {
        List<String> componentNames, decoratorNames;
        componentNames = new ArrayList<>();
        decoratorNames = new ArrayList<>();
        for (ClassCell c : detected.getCells()) {
            if (c instanceof ComponentCell) {
                componentNames.add(c.getPrettyName());
            } else if (c instanceof DecoratorCell) {
                decoratorNames.add(c.getPrettyName());
            }
        }
        
        List<String> decoratesNames = new ArrayList<>();
        String edgeName;
        for (String decoratorName: decoratorNames) {
            for (String componentName :componentNames) {
                edgeName = decoratorName.compareTo(componentName) < 0 ? decoratorName + "-" + componentName : componentName + "-" + decoratorName;
                decoratesNames.add(edgeName + "<" + Edge.Relation.ASSOCIATION + ">true");
                decoratesNames.add(edgeName + "<" + Edge.Relation.ASSOCIATION + ">false");
            }
        }
                
        List<GraphvizElement> gvElements = super.toGraphviz(detected);
        for (GraphvizElement gvE : gvElements) {
            if (gvE instanceof GraphvizNode) {
                gvE.addAttribute("style", "\"filled\"");
                gvE.addAttribute("fillcolor", "\"green\"");
                if (decoratorNames.contains(gvE.getIdentifier())) {
                    String label = gvE.getAttribute("label");
                    label = "<{" + "&lt;&lt;Decorator&gt;&gt;<br align=\"center\"/>" + label.substring(2);
                    gvE.addAttribute("label", label);
                } else if (componentNames.contains(gvE.getIdentifier())) {
                    String label = gvE.getAttribute("label");
                    label = "<{" + "&lt;&lt;Component&gt;&gt;<br align=\"center\"/>" + label.substring(2);
                    gvE.addAttribute("label", label);
                }
            } else if (gvE instanceof GraphvizEdge
                        && decoratesNames.contains(gvE.getIdentifier())) {
                gvE.addAttribute("label", "\"&lt;&lt;decorates&gt;&gt;\"");
            }
        }
        return gvElements;
    }
    
    @Override
    public Graph detect(Graph graphToSearch) {
        Graph detected = new Graph();
        List<DecoratorCell> decorators = new ArrayList<>();
        boolean newInstances;
        do {
           newInstances = false;
           for (ClassCell potentialDecorator : graphToSearch.getCells()) {
               boolean alreadyFound = decorators.contains(potentialDecorator);
               if (alreadyFound) {
                   continue;
               }
               for (Edge e : potentialDecorator.getEdges()) {
                   ClassCell component;
                   if (e.getRelation() == Edge.Relation.EXTENDS
                           || e.getRelation() == Edge.Relation.IMPLEMENTS) {
                       Edge componentEdge = e;
                       component = e.getDestination();
                       boolean extendsDecorator = false;
                       for (DecoratorCell c : decorators) {
                           if (c.equals(component)) {
                               try {
                                   DecoratorCell decoratorCell = new DecoratorCell(potentialDecorator.getName(), potentialDecorator.getRenderAccess());
                                   detected.addClass(decoratorCell);
                                   decorators.add(decoratorCell); 
                               } catch (IOException e1) {
                                   e1.printStackTrace();
                               }
                               extendsDecorator = true;
                               break;
                           }
                       }
                       if (extendsDecorator) {
                           continue;
                       }
                       boolean overrides = true;
                       for (MethodNode n : component.getMethods(AccessLevel.PUBLIC)) {
                           if (n.name.equals("<init>")
                                   || (n.access & Opcodes.ACC_FINAL) != 0) {
                               continue;
                           }
                           boolean found = false;
                           for (MethodNode n2 : potentialDecorator.getMethods(AccessLevel.PUBLIC)) {
                               if (n2.name.equals(n.name)) {
                                   found = true;
                                   break;
                               }
                           }
                           if (!found) {
                               overrides = false;
                               break;
                           }
                       }
                       
                       if (!overrides) {
                           continue;
                       }

                       for (Edge e2: potentialDecorator.getEdges()) {
                           if (e2.getRelation() == Edge.Relation.ASSOCIATION) {
                               Edge decoratesEdge = e2;
                               if (!e2.getDestination().equals(component)) {
                                   continue;
                               }
                               boolean constructorFound = false;
                               for (MethodNode n : potentialDecorator.getMethods(AccessLevel.PRIVATE)) {
                                   if (n.name.equals("<init>")) {
                                       String sig = n.desc;
                                       int startArgs = sig.indexOf('(');
                                       int endArgs = sig.indexOf(')');
                                       
                                       if (endArgs - startArgs > 1) {
                                           String args = sig.substring(startArgs + 1, endArgs);
                                           Field field = new Field(args);
                                           if (field.getType() != null && field.getType().name.equals(component.getName())) {
                                               constructorFound = true;
                                               break;
                                           }
                                       }
                                   }
                               }
                               if (constructorFound) {
                                   try {
                                       ComponentCell componentCell = new ComponentCell(component.getName(), component.getRenderAccess());
                                       DecoratorCell decoratorCell = new DecoratorCell(potentialDecorator.getName(), potentialDecorator.getRenderAccess());
                                       detected.addClass(componentCell);
                                       detected.addClass(decoratorCell);
                                       decorators.add(decoratorCell);
                                       detected.addEdge(decoratesEdge);
                                       detected.addEdge(componentEdge);
                                   } catch (IOException e1) {
                                       e1.printStackTrace();
                                   }
                                   newInstances = true;
                               }
                           }
                       }
                   }
               }
           }
        } while (newInstances);
        
        
        return detected;
    }

    
    private class ComponentCell extends ClassCell {
        public ComponentCell(String name, AccessLevel renderAccess) throws IOException {
            super(name, renderAccess);
        }}
    
    private class DecoratorCell extends ClassCell {
        public DecoratorCell(String name, AccessLevel renderAccess) throws IOException {
            super(name, renderAccess);
        }}

}
