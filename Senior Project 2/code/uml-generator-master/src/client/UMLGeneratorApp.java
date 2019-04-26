package client;
import exporters.Exporter;
import exporters.FileExporter;
import graph.*;
import graphviz.GraphvizElement;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import patterns.AssociationPattern;
import patterns.DependencyPattern;
import patterns.IdentityPattern;
import patterns.Parser;
import patterns.Pattern;

public class UMLGeneratorApp {
    public static void main(String[] args) {
        try {
            ConfigSettings.setupConfig(args);
        } catch (IOException e) {
            System.err.println("Failed to read settings file.");
        }

        GraphGenerator generator = ConfigSettings.getGenerator();

        Graph g = generator.execute(ConfigSettings.getWhiteList());

        Parser parser = new Parser();
        List<Pattern> patterns = ConfigSettings.getPatterns();
//        parser.addPattern(new IdentityPattern(), 0);
        for (int i = 0; i < patterns.size(); i++) {
            parser.addPattern(patterns.get(i), i);
        }

        List<GraphvizElement> elements = parser.parseGraph(g);
        Exporter exporter = ConfigSettings.getExporter();
        exporter.export(elements);
    }
}
