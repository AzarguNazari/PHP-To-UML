package patterns;
import graph.AssociationGraphGen;
import graph.Edge;
import graph.Graph;
import graphviz.GraphvizEdge;
import graphviz.GraphvizElement;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class AssociationPattern extends Pattern {

    /**
     * This is used to detect ONLY Edge.Relation.CONTAINS relationships.
     * As such, the toGraphviz() method only handles these.
     */
    @Override
    public Graph detect(Graph graphToSearch) {
        Graph result = new Graph();
        
        for(Edge edge : graphToSearch.getEdges()){
            if(edge.getRelation() == Edge.Relation.ASSOCIATION){
                result.addEdge(edge);
            }
        }
        
        return result;
    }

    /*@Override
    public List<GraphvizElement> toGraphviz(Graph detected){
        List<GraphvizElement> elements = super.toGraphviz(detected);
        Map<Edge, GraphvizEdge> edgeToGVEdge = new HashMap<>();
        
        for(Edge edge : detected.getEdges()) {
            String from = edge.getOrigin().getPrettyName();
            String to = edge.getDestination().getPrettyName();
            boolean wasDuplicate = false;
            
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
                        && edge.getRelation() == Edge.Relation.ASSOCIATION
                        && otherEdge.getRelation() == Edge.Relation.ASSOCIATION){
                    edgeToGVEdge.get(otherEdge).addAttribute("dir", "\"both\"");
                    edgeToGVEdge.get(otherEdge).addAttribute("taillabel", "\"" + edge.getCardinality().toString() + "\"");
                    wasDuplicate = true;
                    break;
                }
            }

            if(!wasDuplicate){
                GraphvizEdge gvEdge = new GraphvizEdge(from, to, edge.getRelation().toString());
                gvEdge.addAttribute("headlabel", "\"" + edge.getCardinality().toString() + "\"");
                gvEdge.addAttribute("labeldistance", "1.7");
                elements.add(gvEdge);
                edgeToGVEdge.put(edge, gvEdge); 
            }
            
        }

        return elements;
    }*/

}
