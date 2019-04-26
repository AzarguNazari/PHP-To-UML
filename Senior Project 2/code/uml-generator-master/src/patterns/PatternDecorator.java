package patterns;
import java.util.List;

import graph.Graph;
import graphviz.GraphvizElement;

public abstract class PatternDecorator extends Pattern {
    private Pattern innerPattern;

    public PatternDecorator(Pattern pattern) {
        this.innerPattern = pattern;
    }

    public PatternDecorator() {
        innerPattern = null;
    }

    @Override
    public Graph detect(Graph graphToSearch) {
        return this.innerPattern.detect(graphToSearch);
    }
    
    @Override
    public List<GraphvizElement> toGraphviz(Graph detected){
        return this.innerPattern.toGraphviz(detected);
    }

    public void setInner(Pattern inner) {
        this.innerPattern = inner;
    }

    @Override
    public void setArgs(String[] args) {
        innerPattern.setArgs(args);
    }
}
