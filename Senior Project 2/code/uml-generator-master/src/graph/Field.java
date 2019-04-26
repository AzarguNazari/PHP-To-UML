package graph;
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.tree.ClassNode;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by lewis on 1/11/17.
 */
public class Field {
    private ClassNode type;
    private List<Field> template;

    public Field(String sig) {
        this(new SignatureParser(sig));
    }

    public Field(SignatureParser sig) {
        if (!sig.getIsPrimitive()) {
            try {
                ClassReader reader = new ClassReader(sig.getTypeName());
                type = new ClassNode();
                reader.accept(type, ClassReader.EXPAND_FRAMES);

                List<SignatureParser> parsedTemplate = sig.getTemplate();
                if (parsedTemplate != null) {
                    template = new ArrayList<>();
                    for (SignatureParser tempSig : parsedTemplate) {
                        template.add(new Field(tempSig));
                    }
                }
            } catch (IOException e) {
                // This exception should be swallowed. The default behavior is correct.
                //e.printStackTrace();
            }
        }
    }

    public ClassNode getType() {
        return type;
    }

    public List<Field> getTemplate() {
        return template;
    }
}
