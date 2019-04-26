package graph;

public class FieldTuple {
    public Field field;
    public Edge.Cardinality cardinality;
    
    public FieldTuple(Field field, Edge.Cardinality cardinality) {
        this.field = field;
        this.cardinality = cardinality;
    }
}
