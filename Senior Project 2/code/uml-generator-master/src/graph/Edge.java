package graph;

public class Edge {
    /**
     * Defines the different types of relations a connection between two
     * ClassCells can be.
     */
    public enum Relation {
        IMPLEMENTS,
        EXTENDS,
        ASSOCIATION,
        DEPENDS
    }
    
    public enum Cardinality {
        ONE,
        MANY;
        
        @Override
        public String toString(){
            if (this.equals(ONE)) {
                return "1";
            } else if (this.equals(MANY)) {
                return "*";
            }
            return "";
        }
    }

    private ClassCell originClass;
    private ClassCell destClass;
    private Relation relation;
    private Cardinality cardinality;

    /**
     * Creates a new Edges with the given information.
     *
     * @param origin The class that will start the /tail/ of the arrow. This
     * class is the subject of whatever relation is being made.
     * @param dest The class that will start the /head/ of the arrow. This class
     * is the object of whatever relation is being made.
     * @param relation What the relation is between these two objects that this
     * Edge represents.
     */
    public Edge(ClassCell origin, ClassCell dest, Relation relation) {
        this.originClass = origin;
        this.destClass = dest;
        this.relation = relation;
        this.cardinality = Cardinality.ONE;
    }
    
    public Edge(ClassCell origin, ClassCell dest, Relation relation, Cardinality cardinality) {
        this.originClass = origin;
        this.destClass = dest;
        this.relation = relation;
        this.cardinality = cardinality;
    }

    /**
     * @return The origin ClassCell
     */
    public ClassCell getOrigin() {
        return this.originClass;
    }

    /**
     * @return The destination ClassCell
     */
    public ClassCell getDestination() {
        return this.destClass;
    }

    /**
     * @return The relation type of this Edge
     */
    public Relation getRelation() {
        return this.relation;
    }
    
    public Cardinality getCardinality() {
        return this.cardinality;
    }
}
