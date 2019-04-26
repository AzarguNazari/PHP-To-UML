package patterns;

import java.util.ArrayList;
import java.util.List;

import graph.ClassCell;
import graph.Edge;
import graph.Graph;

import org.objectweb.asm.Opcodes;

/**
 * Created by lewis on 2/3/17.
 */
public class ViolateDepInvPatternDecorator extends PatternDecorator {
    List<String> blackList;
    
    public ViolateDepInvPatternDecorator() {
        super();
        blackList = new ArrayList<>();
    }
    @Override
    public Graph detect(Graph graphToSearch) {
        Graph g = new Graph();
        for (ClassCell cell : graphToSearch.getCells()) {
            
            for (Edge edge : cell.getEdges()) {
                if (edge.getRelation() != Edge.Relation.DEPENDS) {
                    continue;
                }

                if ((edge.getDestination().getAccess() & (Opcodes.ACC_ABSTRACT | Opcodes.ACC_INTERFACE)) == 0
                        && !blackList.contains(edge.getDestination().getName())) {
                    g.addClass(cell);
                    g.addEdge(edge);
                }
            }
        }

        return g;
    }
    
    @Override
    public void setArgs(String[] args) {
        for (String s : args){
            blackList.add(s.replace('.', '/'));
        }
    }
}
