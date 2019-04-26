package patterns;
import graph.Graph;
import graphviz.GraphvizElement;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Parser {
    private Map<Integer, Pattern> patterns;

    public Parser() {
        this.patterns = new HashMap<>();
    }

    /**
     * Parses the passed Graph into a list of GraphvizElements.
     *
     * @param graph The graph to parse
     * @return A list of GraphvizElement's representing graph
     */
    public List<GraphvizElement> parseGraph(Graph graph) {
        List<GraphvizElement> parsedElements = new ArrayList<GraphvizElement>();
        List<Integer> priorities = new ArrayList<>(this.patterns.keySet());
        Collections.sort(priorities);
        for(int i = 0; i < priorities.size(); i++) {
            Pattern pattern = this.patterns.get(priorities.get(i));
            Graph detectedPattern = pattern.detect(graph);
            for(GraphvizElement element : pattern.toGraphviz(detectedPattern)) {
                GraphvizElement.addOrReplaceElement(parsedElements, element);
            }
        }
        return parsedElements;
    }

    /**
     * Adds the passed pattern to the list of patterns to check and give it the
     * assigned priority value. The lesser the integer, the more patterns this
     * one will override.
     *
     * @param pattern The Pattern object to check.
     * @param priority The priority value to assign pattern.
     * @return False if either this pattern or this key has already been added
     * to the list, false otherwise.
     */
    public boolean addPattern(Pattern pattern, Integer priority) {
        if (this.patterns.containsKey(priority) || this.patterns.containsValue(pattern)) {
            return false;
        }

        patterns.put(priority, pattern);
        return true;
    }

    /**
     * Removes the passed pattern from the list if it's present.
     *
     * @return True of the element was successfully removed, false otherwise
     */
    public boolean removePattern(Pattern pattern) {
        for(Integer priority : this.patterns.keySet()) {
            if (this.patterns.get(priority).equals(pattern)) {
                return this.patterns.remove(priority, pattern);
            }
        }

        return false;
    }
}
