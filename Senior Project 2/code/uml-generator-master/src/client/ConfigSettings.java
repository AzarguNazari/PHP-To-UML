package client;

import exporters.Exporter;
import exporters.FileExporter;
import graph.AccessLevel;
import graph.GraphGenDecorator;
import graph.GraphGenerator;
import patterns.Pattern;
import patterns.PatternDecorator;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

/**
 * Created by lewis on 1/20/17.
 */
public class ConfigSettings {
    private static final String SETTINGS_FLAG = "--settings=";
    private static final String DEFAULT_SETTINGS_FILE = new File("config/settings.txt").getAbsolutePath();
    private static final String RECURSIVE_TAG = "recursive";
    private static final String SYNTHETIC_TAG = "synthetic";
    private static final String WHITELIST_TAG = "include";
    private static final String BLACKLIST_TAG = "exclude";
    private static final String PATTERNS_TAG = "patterns";
    private static final String ACCESS_TAG = "access";
    private static final String GENERATOR_TAG = "generate";
    private static final String EXPORTER_TAG = "exporter";

    private static boolean isRecursive = false;
    private static boolean showSynthetic = false;
    private static List<String> whiteList = new ArrayList<>();
    private static List<String> blackList = new ArrayList<>();
    private static List<Pattern> patterns = new ArrayList<>();
    private static GraphGenerator generator;
    private static AccessLevel accessLevel = AccessLevel.PRIVATE;
    private static Properties properties;
    private static Exporter exporter;

    private ConfigSettings() {}

    public static void setIsRecursive(boolean recurse) {
        isRecursive = recurse;
    }

    public static void setShowSynthetic(boolean synth) {
        showSynthetic = synth;
    }

    public static void addToWhiteList(String name) {
        whiteList.add(name);
    }

    public static void addToWhiteList(List<String> names) {
        whiteList.addAll(names);
    }

    public static void removeFromWhiteList(String name) {
        whiteList.remove(name);
    }

    public static void removeFromWhiteList(List<String> names) {
        whiteList.removeAll(names);
    }

    public static void addToBlackList(String name) {
        blackList.add(name);
    }

    public static void addToBlackList(List<String> names) {
        blackList.addAll(names);
    }

    public static void removeFromBlackList(String name) {
        blackList.remove(name);
    }

    public static void removeFromBlackList(List<String> names) {
        blackList.removeAll(names);
    }

    public static void addToPatterns(Pattern patt) {
        patterns.add(patt);
    }

    public static void addToPatterns(List<Pattern> patts) {
        patterns.addAll(patts);
    }

    public static void removeFromPatterns(Pattern patt) {
        patterns.remove(patt);
    }

    public static void removeFromPatterns(List<Pattern> patts) {
        patterns.removeAll(patts);
    }

    public static void setGenerator(GraphGenerator gen) {
        generator = gen;
    }

    public static void setAccessLevel(AccessLevel access) {
        accessLevel = access;
    }

    public static void setExporter(Exporter exp) {
        exporter = exp;
    }

    public static boolean getRecursive() {
        return isRecursive;
    }

    public static boolean getShowSynthetic() {
        return showSynthetic;
    }

    public static List<String> getWhiteList() {
        return whiteList;
    }

    public static List<String> getBlackList() {
        return blackList;
    }

    public static List<Pattern> getPatterns() {
        return patterns;
    }

    public static GraphGenerator getGenerator() {
        return generator;
    }

    public static AccessLevel getAccessLevel() {
        return accessLevel;
    }

    public static Exporter getExporter() {
        return exporter;
    }

    public static String getAssociatedVal(String key) {
        return properties.getProperty(key);
    }

    public static boolean classInBlacklist(String className) {
        for (String listedItem : blackList) {
            if (className.startsWith(listedItem)) {
                return true;
            }
        }

        return false;
    }

    public static void setupConfig(String[] args) throws IOException {
        String[] localArgs = new String[0];
        for (String arg : args) {
            if (arg.startsWith(SETTINGS_FLAG)) {
                properties = new Properties();
                properties.load(new FileInputStream(arg.substring(SETTINGS_FLAG.length())));
                break;
            }
        }

        if (properties == null) {
            properties = new Properties();
            properties.load(new FileInputStream(DEFAULT_SETTINGS_FILE));
        }

        String buff;
        buff = properties.getProperty(RECURSIVE_TAG, "");
        if (buff.equals("true")) {
            isRecursive = true;
        } else if (buff.equals("false")) {
            isRecursive = false;
        }

        buff = properties.getProperty(SYNTHETIC_TAG, "");
        if (buff.equals("true")) {
            showSynthetic = true;
        } else if (buff.equals("false")) {
            showSynthetic = false;
        }

        buff = properties.getProperty(WHITELIST_TAG, "");
        if (!buff.equals("")) {
            for (String className : buff.split(" ")) {
                whiteList.add(className);
            }
        }

        buff = properties.getProperty(BLACKLIST_TAG, "");
        if (!buff.equals("")) {
            for (String packPref : buff.split(" ")) {
                blackList.add(packPref.replace('.', '/'));
            }
        }

        buff = properties.getProperty(EXPORTER_TAG, "exporters.FileExporter");
        if (buff.contains("(")) {
            localArgs = buff.substring(buff.indexOf('(') + 1, buff.indexOf(')')).split(",");
            for (int i = 0; i < localArgs.length; i++) {
                localArgs[i] = localArgs[i].trim();
            }
        }

        try {
            try {
                exporter = (Exporter)Class.forName(buff.substring(0, buff.indexOf('('))).newInstance();
                exporter.setArgs(localArgs);
            } catch (StringIndexOutOfBoundsException e) {
                exporter = (Exporter)Class.forName(buff).newInstance();
                exporter.setArgs(localArgs);
            }
        } catch (ClassNotFoundException | IllegalAccessException | InstantiationException e) {
            e.printStackTrace();
            exporter = new FileExporter();
            exporter.setArgs(localArgs);

            localArgs = new String[0];
        }

        buff = properties.getProperty(PATTERNS_TAG, "patterns.IdentityPattern");
        if (!buff.equals("")) {
            String[] patChains = buff.split(";");
            for (int j = 0; j < patChains.length; j++) {
                String[] classNames = patChains[j].trim().split(" ");
                Pattern patt;
                PatternDecorator dec;
                if (classNames.length == 0) {
                    continue;
                }

                try {
                    
//                    patt = (Pattern) Class.forName(classNames[0]).newInstance();
                    patt = makePatternFromString(classNames[0]);


                    for (int i = 1; i < classNames.length; i++) {
//                        dec = (PatternDecorator) Class.forName(classNames[i]).newInstance();
                        dec = (PatternDecorator) makePatternFromString(classNames[i]);
                        dec.setInner(patt);

                        patt = dec;
                    }

                    patterns.add(patt);
                } catch (InstantiationException | IllegalAccessException | ClassNotFoundException e) {
                    e.printStackTrace();
                }
            }
        }

        buff = properties.getProperty(ACCESS_TAG, "");

        if (buff.equals("public")) {
            accessLevel = AccessLevel.PUBLIC;
        } else if (buff.equals("private")) {
            accessLevel = AccessLevel.PRIVATE;
        } else if (buff.equals("protected")) {
            accessLevel = AccessLevel.PROTECTED;
        }

        for (String arg : args) {
            switch(arg) {
            case "-r":
            case "--recursive":
                isRecursive = true;
                break;
            case "--public":
                accessLevel = AccessLevel.PUBLIC;
                break;
            case "--private":
                accessLevel = AccessLevel.PRIVATE;
                break;
            case "--protected":
                accessLevel = AccessLevel.PROTECTED;
            default:
                if (!arg.startsWith(SETTINGS_FLAG)) {
                    whiteList.add(arg);
                }
                break;
            }
        }

        GraphGenDecorator genDecorator;
        generator = new GraphGenerator(isRecursive, accessLevel);
        buff = properties.getProperty(GENERATOR_TAG, "graph.SuperGraphGen graph.ImplementsGraphGen "
                + "graph.AssociationGraphGen graph.DependencyGraphGen");
        if (!buff.equals("")) {
            String[] gens = buff.split(" ");
            for (int j = 0; j < gens.length; j++) {
                try {
                    genDecorator = (GraphGenDecorator) Class.forName(gens[j]).newInstance();
                    genDecorator.setInner(generator);
                    generator = genDecorator;
                } catch (InstantiationException | IllegalAccessException | ClassNotFoundException e) {
                    e.printStackTrace();
                }
            }
        }
    }
    
    public static Pattern makePatternFromString(String full) throws InstantiationException, IllegalAccessException, ClassNotFoundException{
        String[] localArgs = new String[0];
        String name = "";
        name = full;
        if (full.contains("(")) {
            name = full.substring(0, full.indexOf("("));
            localArgs = full.substring(full.indexOf('(') + 1, full.indexOf(')')).split(",");
            for (int i = 0; i < localArgs.length; i++) {
                localArgs[i] = localArgs[i].trim();
            }
        }
        Pattern result = (Pattern) Class.forName(name).newInstance();
        
        result.setArgs(localArgs);
        return result;
    }
}
