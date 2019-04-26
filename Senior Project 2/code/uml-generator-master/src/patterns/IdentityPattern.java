package patterns;
import graph.Graph;

/**
 * Created by lewis on 12/10/16.
 */
public class IdentityPattern extends Pattern {

    @Override
    public Graph detect(Graph graphToSearch) {
        return graphToSearch.copy();
    }
}
