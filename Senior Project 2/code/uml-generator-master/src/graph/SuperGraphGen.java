package graph;

import client.ConfigSettings;

import java.util.List;
import java.util.Queue;
import java.util.LinkedList;
import java.util.Set;
import java.util.HashSet;
import java.io.IOException;

public class SuperGraphGen extends GraphGenDecorator {
    public SuperGraphGen() {
        super();
    }

    public SuperGraphGen(GraphGenerator graphGen) {
        super(graphGen);
    }

    @Override
    protected boolean genObjects(List<String> classNames, Graph graph) {
        boolean changed = false;

        Queue<ClassCell> classesToSuper = new LinkedList<>();
        classesToSuper.addAll(graph.getCells());
        Set<String> addedClasses = new HashSet<>();
        addedClasses.addAll(graph.getCellNames());

        ClassCell currentClass;
        ClassCell superClass;

        while (!classesToSuper.isEmpty()) {
            currentClass = classesToSuper.remove();
            try {
                if (currentClass.getSuper() != null) {
                    superClass = new ClassCell(currentClass.getSuper().name,
                            this.access);
                    if (recursive && !ConfigSettings.classInBlacklist(superClass.getName())
                            && graph.containsNode(superClass.getClassNode()) == null) {
                        graph.addClass(superClass);
                        classesToSuper.add(superClass);
                        changed = true;
                    }
                    
                    if (graph.containsNode(superClass.getClassNode()) != null) {
                        Edge e = new Edge(currentClass, superClass, Edge.Relation.EXTENDS);
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
