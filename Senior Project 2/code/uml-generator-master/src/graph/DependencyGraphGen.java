package graph;

import java.io.IOException;
import java.util.Collection;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;
import java.util.Set;

import client.ConfigSettings;
import org.objectweb.asm.tree.ClassNode;

/**
 * Created by lewis on 1/11/17.
 */
public class DependencyGraphGen extends GraphGenDecorator {

    public DependencyGraphGen() {
        super();
    }

    public DependencyGraphGen(GraphGenerator graphGen) {
        super(graphGen);
    }

    @Override
    public boolean genObjects(List<String> classNames, Graph graph) {
        boolean changed = false;

        Queue<ClassCell> classesToCheck = new LinkedList<>();
        classesToCheck.addAll(graph.getCells());
        Set<String> addedClasses = new HashSet<>();
        addedClasses.addAll(graph.getCellNames());

        ClassCell currentClass;
        while (!classesToCheck.isEmpty()) {
            currentClass = classesToCheck.remove();

            try {
                Queue<FieldTuple> fieldsToCheck = new LinkedList<>();
                Field field;
                for (Field f : currentClass.getDependencies()) {
                    fieldsToCheck.add(new FieldTuple(f, Edge.Cardinality.ONE));
                }
                while (!fieldsToCheck.isEmpty()) {
                    FieldTuple fieldTuple = fieldsToCheck.remove();
                    field = fieldTuple.field;
                    ClassNode type = field.getType();

                    if (type != null) {
                        ClassCell referencedCell = new ClassCell(type.name, this.access);

                        if (recursive && !ConfigSettings.classInBlacklist(type.name)
                                && graph.containsNode(type) == null) {
                            graph.addClass(referencedCell);
                            classesToCheck.add(referencedCell);
                            changed = true;
                        }

                        if (!type.name.equals(currentClass.getName())) {
                            if (graph.containsNode(type) != null
                                    && !graph.containsEdge(currentClass, referencedCell, Edge.Relation.DEPENDS,
                                    fieldTuple.cardinality)) {
                                Edge e = new Edge(currentClass, referencedCell, Edge.Relation.DEPENDS, fieldTuple
                                        .cardinality);
                                graph.addEdge(e);
                                currentClass.addEdge(e);
                            }
                            try {
                                if (Collection.class.isAssignableFrom(Class.forName(type.name.replace("/", ".")))) {
                                    fieldTuple.cardinality = Edge.Cardinality.MANY;
                                } 
                            } catch (ClassNotFoundException|NoClassDefFoundError e) {
                                // probably not a collection
                            }
                            
                        }
                    }

                    if (field.getTemplate() != null) {
                        for (Field f : field.getTemplate()) {
                            fieldsToCheck.add(new FieldTuple(f, fieldTuple.cardinality));
                        }
                    }
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return changed;
    }
}
