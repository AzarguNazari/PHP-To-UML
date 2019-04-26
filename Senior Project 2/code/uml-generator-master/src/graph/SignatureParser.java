package graph;
import org.objectweb.asm.Type;

import java.util.List;
import java.util.ArrayList;

public class SignatureParser {
    private static final char[] PREFIXES = {'T', '*', '+', '-', '['};
    private String typeName;
    private List<SignatureParser> template;
    private int parsedChars;
    private boolean isArray;
    private boolean isPrimitive;
    private boolean doesExtend;
    private boolean doesSuper;

    public static List<SignatureParser> parseFullSignature(String fullSignature) {
        List<SignatureParser> signatures = new ArrayList<>();
        SignatureParser toAdd;
        if (fullSignature == null || fullSignature.length() == 0) {
            return signatures;
        }

        int leadIndex = 0;

        while (leadIndex < fullSignature.length()
               && fullSignature.charAt(leadIndex) != ';') {
//            if (isPrefix(fullSignature.charAt(leadIndex))) {
//                prefix += fullSignature.charAt(leadIndex);
//            } else {
//                signatures.add(new SignatureParser(prefix + fullSignature.substring(leadIndex)));
//                leadIndex += signatures.get(signatures.size() - 1).getNumParsedChars()
//                    - prefix.length();
//                prefix = "";
//                continue;
//            }

            toAdd = new SignatureParser(fullSignature.substring(leadIndex));
            signatures.add(toAdd);
            leadIndex += toAdd.getNumParsedChars() + 1;
        }


        return signatures;
    }

    public static boolean isPrefix(char character) {
        for (char prefix : PREFIXES) {
            if (character == prefix) {
                return true;
            }
        }

        return false;
    }

    public SignatureParser(String signature) {
        boolean isTemplate = false;
        isArray = false;
        isPrimitive = false;

        if (signature == null || signature.length() == 0) {
            typeName = "";
            isPrimitive = true;
            return;
        }

        parsedChars = 0;
        
        while (!isTemplate
               && parsedChars < signature.length()
               && isPrefix(signature.charAt(parsedChars))) {
            switch (signature.charAt(parsedChars)) {
            case 'T':
                isTemplate = true;
                break;
            case '*':
                typeName = "?";
                return;
            case '+':
                doesExtend = true;
                break;
            case '-':
                doesSuper = true;
                break;
            case '[':
                isArray = true;
                break;
            }

            parsedChars++;
        }

        if (isTemplate) {
            typeName = signature.substring(parsedChars, parsedChars + 1);
            parsedChars++;
            return;
        } else if (signature.charAt(parsedChars) != 'L') {
            typeName = Type.getType(signature.substring(parsedChars, parsedChars + 1)).getClassName();
            if (typeName == null) {
                typeName = signature.substring(parsedChars, parsedChars + 1);
            }
            isPrimitive = true;
            return;
        }

        parsedChars++;
        typeName = "";

        while (parsedChars < signature.length()
               && signature.charAt(parsedChars) != ';') {
            if (signature.charAt(parsedChars) == '<') {
                int angleBracketsCt = 1;

                parsedChars++;
                int startIndex = parsedChars;

                while (angleBracketsCt != 0) {
                    switch (signature.charAt(parsedChars)) {
                    case '>':
                        angleBracketsCt--;
                        break;
                    case '<':
                        angleBracketsCt++;
                        break;
                    default:
                        break;
                    }
                    parsedChars++;
                }

                template = SignatureParser.parseFullSignature(signature.substring(startIndex, parsedChars - 1));
            } else {
                typeName += signature.charAt(parsedChars++);
            }
        }
    }

    public String getTypeName() {
        return typeName;
    }

    public boolean getIsPrimitive() {
        return isPrimitive;
    }

    public List<SignatureParser> getTemplate() {
        return template;
    }

    public int getNumParsedChars() {
        return parsedChars;
    }

    public String toGraphviz() {
        String retVal = typeName.replace("/", ".");

        if (doesExtend) {
            retVal = "? extends " + retVal;
        } else if (doesSuper) {
            retVal = "? super " + retVal;
        }

        if (template != null) {
            retVal += "&lt;";
            int i;
            for (i = 0; i < template.size() - 1; i++) {
                retVal += template.get(i).toGraphviz() + ", ";
            }
            retVal += template.get(i).toGraphviz();
            retVal += "&gt;";
        }

        return retVal + (isArray ? "[]" : "");
    }
}
