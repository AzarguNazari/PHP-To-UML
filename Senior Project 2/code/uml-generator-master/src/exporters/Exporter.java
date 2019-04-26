package exporters;
import graphviz.GraphvizElement;

import java.util.List;

public abstract class Exporter {

    public Exporter() {}

    public abstract void setArgs(String[] args);

    /**
     * Exports the given GraphviElements into some final presentable format for
     * the end user.
     *
     * @param elements A list of all the GraphvizElements to export.
     */
    public abstract void export(List<GraphvizElement> elements);
}
