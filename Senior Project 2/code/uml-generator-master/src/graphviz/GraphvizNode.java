package graphviz;

public class GraphvizNode extends GraphvizElement {
    private String name;

    public GraphvizNode(String name) {
        this.name = name;
    }
    
    @Override
    public String toGraphviz() {
        String code = "";
        code += '\"' + this.name + '\"' + " [\n\t";
        
        Object[] attributeArray = this.attributes.keySet().toArray();
        for(int i = 0; i < attributeArray.length - 1; i++) {
            code += (String) attributeArray[i] + " = " + this.attributes.get((String) attributeArray[i]);
            code += ",\n\t";
        }
        code += attributeArray[attributeArray.length - 1]
                + " = " + this.attributes.get((String) attributeArray[attributeArray.length - 1])
                + "\n];\n";
        
        return sanitizeGraphvizString(code);
    }

    @Override
    public String getIdentifier() {
        return this.name;
    }

}
