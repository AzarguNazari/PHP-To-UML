package patterns;

import graph.Graph;
import graphviz.GraphvizElement;

import java.util.List;

/**
 * Created by lewis on 1/22/17.
 */
public class ColorPatternDecorator extends PatternDecorator {
    String color;

    public ColorPatternDecorator() {
        super();
        color = "black";
    }

    public ColorPatternDecorator(Pattern pattern) {
        super(pattern);
    }

    @Override
    public List<GraphvizElement> toGraphviz(Graph detected) {
        List<GraphvizElement> elements = super.toGraphviz(detected);
        for (GraphvizElement element : elements) {
            element.addAttribute("color", "\""+color+"\"");
        }

        return elements;
    }
    
    @Override
    public void setArgs(String[] args){
        if (args.length > 0){
            color = args[0];            
        }
    }
}
