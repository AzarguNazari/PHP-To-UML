package patterns;

import java.util.List;

import graph.Graph;
import graphviz.GraphvizElement;
import graphviz.GraphvizNode;

public class SingletonPatternDecorator extends PatternDecorator {
    public SingletonPatternDecorator() {
        super();
    }
    
    public SingletonPatternDecorator (Pattern pattern){
        super(pattern);
    }
    
    @Override
    public List<GraphvizElement> toGraphviz(Graph detected) {
        List<GraphvizElement> elements = super.toGraphviz(detected);
        for (GraphvizElement element : elements) {
            if (element instanceof GraphvizNode) {
                String label = element.getAttribute("label");
                label = "<{" + "&lt;&lt;Singleton&gt;&gt;<br align=\"center\"/>" + label.substring(2);
                element.addAttribute("label", label);
                element.addAttribute("color", "\"blue\"");
            }
        }

        return elements;
    }
}
