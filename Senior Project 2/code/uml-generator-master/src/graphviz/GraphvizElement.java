package graphviz;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public abstract class GraphvizElement {
    private static final Map<String, String> BANNED_STRINGS = initBannedStrings();
    protected Map<String, String> attributes;

    public GraphvizElement() {
        this.attributes = new HashMap<>();
    }

    private static Map<String, String> initBannedStrings() {
        Map<String, String> map = new HashMap<>();
        map.put("<init>", "&lt;init&gt;");
        map.put("<clinit>", "&lt;clinit&gt;");

        return map;
    }

    /**
     * Add the given variable-value pair to this element.
     *
     * @param var The string representing a variable to set to the passed value.
     * @param val The string representing the value to set the passed variable
     * to.
     */
    public void addAttribute(String var, String val) {
        this.attributes.put(var, val);
    }

    /**
     * Removes the attribute associated with the given variable.
     *
     * @param var The string representing the variable to remove.
     */
    public void removeAttribute(String var) {
        this.attributes.remove(var);
    }

    /**
     * Retrieve the value currently associated with the passed variable.
     *
     * @param var The string representing the variable to check the value of.
     * @return The string representing the currently stored value of the
     * variable.
     */
    public String getAttribute(String var) {
        return this.attributes.get(var);
    }

    /**
     * Creates a string representation of the GraphvizElement that is Graphviz
     * code. This string /may not/ be sanitized, and as such it may need to be
     * passed through sanitizeGraphvizString to become legal code.
     *
     * @return A string of Graphviz code representing all the data stored in
     * this element.
     */
    public abstract String toGraphviz();

    /**
     * Returns an identifier that will be unique from all other GraphvizElements
     * but shared with all GraphvizElements that should override this one.
     *
     * @return A string identifier for this element.
     */
    public abstract String getIdentifier();

    /**
     * Adds the given element to the passed list, and if there's already an
     * element with a matching identifier that element will be replaced with
     * the passed element.
     *
     * @param list The list of elements to modify.
     * @param element The element to add to the list.
     */
    public static void addOrReplaceElement(List<GraphvizElement> list, GraphvizElement element) {
        for(GraphvizElement existingElement : list) {
            if (existingElement.getIdentifier().equals(element.getIdentifier())) {
                list.remove(existingElement);
                break;
            }
        }
        list.add(element);
    }

    /**
     * Sanitizes the passed Graphviz code to remove any special characters that
     * make the code illegal.
     *
     * @param unsanitized The Graphviz code to sanitize.
     * @return The sanitized and therefore legal Graphviz code.
     */
    protected static String sanitizeGraphvizString(String unsanitized) {
        // String sanitized = unsanitized.replaceAll("<(\\w*)>", "\\\\<$1\\\\>");
        // sanitized = sanitized.replaceAll("<@<@([\\w]*)@>([\\w]*)<@/([\\w]*)@>@>",
        //         "<<$1>$2</$3>>");
        String sanitized = unsanitized;

        for (String banned : BANNED_STRINGS.keySet()) {
            sanitized = sanitized.replace(banned, BANNED_STRINGS.get(banned));
        }

        return sanitized;
    }
}
