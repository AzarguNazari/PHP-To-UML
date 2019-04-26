package patterns;

import graph.ClassCell;
import graph.Edge;
import graph.Graph;
import org.objectweb.asm.Opcodes;

/**
 * Created by lewis on 1/22/17.
 */
public class InheritancePattern extends Pattern {
    @Override
    public Graph detect(Graph graphToSearch) {
        Graph g = new Graph();
        ClassCell superCell;
        for (ClassCell cell : graphToSearch.getCells()) {
            if (cell.getSuper() != null && (cell.getSuper().access & Opcodes.ACC_ABSTRACT) == 0
                    && (cell.getSuper().access & Opcodes.ACC_INTERFACE) == 0
                    && (superCell = graphToSearch.containsNode(cell.getSuper())) != null
                    && !superCell.getName().equals("java/lang/Object")) {
                g.addClass(cell);
                for (Edge edge : cell.getEdges()) {
                    if (edge.getDestination().equals(superCell)
                            && edge.getRelation() == Edge.Relation.EXTENDS) {
                        g.addEdge(edge);
                        break;
                    }
                }
            }
        }
        return g;
    }
}
