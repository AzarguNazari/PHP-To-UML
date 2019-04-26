package graph;

import java.util.List;

public abstract class GraphGenDecorator extends GraphGenerator {
    private GraphGenerator graphGen;

    public GraphGenDecorator() {
        super(false, AccessLevel.PRIVATE);
        graphGen = null;
    }

    public GraphGenDecorator(GraphGenerator graphGen) {
        super(graphGen.recursive, graphGen.access);
        this.graphGen = graphGen;
    }

    public void setInner(GraphGenerator inner) {
        recursive = inner.recursive;
        access = inner.access;
        graphGen = inner;
    }

    @Override
    protected boolean execute(List<String> classNames, Graph graph) {
        boolean changed = graphGen.execute(classNames, graph);
        boolean retBool = changed;

        do {
            changed = genObjects(classNames, graph);
            retBool = changed || retBool;
        } while (recursive && (changed || graphGen.execute(classNames, graph)));

        return retBool;
    }

    protected abstract boolean genObjects(List<String> classNames, Graph graph);
}
