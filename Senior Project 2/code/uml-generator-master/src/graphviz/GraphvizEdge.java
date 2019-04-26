package graphviz;

public class GraphvizEdge extends GraphvizElement {
    private String fromNode;
    private String toNode;
    private String type;

    public GraphvizEdge(String from, String to, String type) {
        this.fromNode = from;
        this.toNode = to;
        this.type = type;
    }
    
    @Override
    public String toGraphviz() {
        String code = "";
        code += '\"' + this.fromNode + "\" -> \"" + this.toNode + "\"[\n\t";
        String[] attributeArray = this.attributes.keySet().toArray(new String[0]);
        for(int i = 0; i < attributeArray.length - 1; i++) {
            code += attributeArray[i] + " = " + this.attributes.get(attributeArray[i]);
            code += ",\n\t";
        }
        if (attributeArray.length > 0) {
            code += attributeArray[attributeArray.length - 1]
                    + " = " + this.attributes.get(attributeArray[attributeArray.length - 1])
                    + "\n];\n";
        } else {
            code += "\n]\n";
        }
        
        return sanitizeGraphvizString(code);
    }

    @Override
    public String getIdentifier() {
        String names = fromNode.compareTo(toNode) < 0 ? fromNode + "-" + toNode : toNode + "-" + fromNode;
        return names + "<" + type + ">" + this.attributes.keySet().contains("dir");
    }

}
