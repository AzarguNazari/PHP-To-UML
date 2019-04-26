package graph;

import java.io.IOException;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;
import java.util.Set;

import client.ConfigSettings;
import org.objectweb.asm.tree.ClassNode;

public class ImplementsGraphGen extends GraphGenDecorator {
    public ImplementsGraphGen() {
        super();
    }

    public ImplementsGraphGen(GraphGenerator graphGen) {
        super(graphGen);
    }

    @Override
    protected boolean genObjects(List<String> classNames, Graph graph) {
        boolean changed = false;

        Queue<ClassCell> classesToImplement = new LinkedList<>();
        classesToImplement.addAll(graph.getCells());
        Set<String> addedClasses = new HashSet<>();
        addedClasses.addAll(graph.getCellNames());

        ClassCell currentClass;

        while (!classesToImplement.isEmpty()) {
            currentClass = classesToImplement.remove();
            try {
                for (ClassNode implementedNode : currentClass.getImplements()) {
                    ClassCell implementedCell = new ClassCell(implementedNode.name, this.access);
                    if  (recursive && !ConfigSettings.classInBlacklist(implementedNode.name)
                            && graph.containsNode(implementedNode) == null) {
                        graph.addClass(implementedCell);
                        classesToImplement.add(implementedCell);
                        changed = true;
                    }

                    if  (graph.containsNode(implementedNode) != null) {
                        Edge e = new Edge(currentClass, implementedCell, Edge.Relation.IMPLEMENTS);
                        graph.addEdge(e);
                        currentClass.addEdge(e);
                    }
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return changed;
    }
}
