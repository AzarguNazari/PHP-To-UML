package exporters;
import graphviz.GraphvizElement;

import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.util.List;

public class FileExporter extends Exporter {
    private String outFile;

    @Override
    public void setArgs(String[] args) {
        if (args.length < 1) {
            outFile = "./output/out.dot";
        } else {
            outFile = args[0];
        }
    }

    @Override
    public void export(List<GraphvizElement> elements) {
        try {
            PrintWriter writer = new PrintWriter(this.outFile);

            writer.println("digraph uml {");
            for(GraphvizElement element : elements) {
                writer.print(element.toGraphviz());
            }
            writer.println("}");

            writer.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }

    }

}
