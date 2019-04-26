package client;
import java.io.IOException;
import java.util.List;

import org.objectweb.asm.ClassReader;
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.Type;
import org.objectweb.asm.tree.AbstractInsnNode;
import org.objectweb.asm.tree.ClassNode;
import org.objectweb.asm.tree.FieldNode;
import org.objectweb.asm.tree.InsnList;
import org.objectweb.asm.tree.MethodInsnNode;
import org.objectweb.asm.tree.MethodNode;
import org.objectweb.asm.tree.VarInsnNode;

// FIXME: everything about this class is completely terribly designed.
// If your code even remotely resembles this class, you will be sad.
public class DesignParser {
    /**
     * Reads in a list of Java Classes and reverse engineers their design.
     *
     * @param args
     *            : the names of the classes, separated by spaces. For example:
     *            java example.DesignParser java.lang.String
     * @throws IOException
     * @throws ClassNotFoundException
     */
    public static void main(String[] args) throws IOException, ClassNotFoundException {

        // TODO: Learn how to create separate Run Configurations so you can run
        // this code without changing the arguments each time.

        // FIXME: this code has POOR DESIGN. If you keep this code as-is for
        // your main method, you will be sad about your grade.

        for (String className : args) {
            // ASM's ClassReader does the heavy lifting of parsing the compiled
            // Java class.
            // TODO: verify you have your JavaDocs set up so Eclipse can load
            // ASM's JavaDocs and tell you what this is.
            ClassReader reader = new ClassReader(className);

            // There are NO ASM ClassVisitors, MethodVisitors, or FieldVisitors
            // here.
            // These ASM classes are dead to you. Do NOT use them at any point
            // during the term.

            // ClassNode contains all of the data about a parsed class
            // Do NOT subclass ClassNode.
            // Do NOT override any methods starting with the word "visit";
            // these methods are dead to you.
            ClassNode classNode = new ClassNode();

            // Tell the Reader to parse the specified class and store its data
            // in our ClassNode.
            // EXPAND_FRAMES means: I want my code to work. Always pass this.
            reader.accept(classNode, ClassReader.EXPAND_FRAMES);

            // Now we can navigate the classNode and look for things we are
            // interested in.
            printClass(classNode);

            printFields(classNode);

            printMethods(classNode);

            // TODO: Use GOOD DESIGN to parse the classes of interest and store
            // them.
        }
    }

    // FIXME: is it GOOD DESIGN to have a class where everything is static?
    private static void printClass(ClassNode classNode) {
        System.out.println("Class's JVM internal name: " + classNode.name);
        System.out.println("User-friendly name: " + Type.getObjectType(classNode.name).getClassName());
        System.out.println("public? " + ((classNode.access & Opcodes.ACC_PUBLIC) > 0));
        System.out.println("Extends: " + classNode.superName);
        System.out.println("Implements: " + classNode.interfaces);

    }

    private static void printFields(ClassNode classNode) {
        // Print all fields (note the cast; ASM doesn't store generic
        // data with its Lists)
        List<FieldNode> fields = (List<FieldNode>) classNode.fields;
        for (FieldNode field : fields) {
            System.out.println("	Field: " + field.name);
            System.out.println("	Internal JVM type: " + field.desc);
            System.out.println("	User-friendly type: " + Type.getType(field.desc));
            // Query the access modifiers with the ACC_* constants.

            System.out.println("	public? " + ((field.access & Opcodes.ACC_PUBLIC) > 0));
            // How do you tell if something has default access? (ie no
            // access modifiers?)

            System.out.println();
        }
    }

    private static void printMethods(ClassNode classNode) {
        List<MethodNode> methods = (List<MethodNode>) classNode.methods;
        for (MethodNode method : methods) {
            System.out.println("	Method: " + method.name);
            System.out.println("	Internal JVM method signature: " + method.desc);

            System.out.println("	Return type: " + Type.getReturnType(method.desc).getClassName());

            System.out.println("	Args: ");
            for (Type argType : Type.getArgumentTypes(method.desc)) {
                System.out.println("		" + argType.getClassName());
                // FIXME: what is the argument's VARIABLE NAME?
            }

            // Query the access modifiers with the ACC_* constants.
            System.out.println("	public? " + ((method.access & Opcodes.ACC_PUBLIC) > 0));
            System.out.println("	static? " + ((method.access & Opcodes.ACC_STATIC) > 0));
            // How do you tell if something has default access? (ie no
            // access modifiers?)

            System.out.println();

            // Print the method's instructions
            printInstructions(method);
        }
    }

    private static void printInstructions(MethodNode methodNode) {
        InsnList instructions = methodNode.instructions;
        for (int i = 0; i < instructions.size(); i++) {

            // We don't know immediately what kind of instruction we have.
            AbstractInsnNode insn = instructions.get(i);

            // Now we have to cast the instruction to its correct type based on
            // the opCode.
            // FIXME: this code has POOR DESIGN.
            if (insn instanceof MethodInsnNode) {
                // A method call of some sort; what other useful fields does
                // this object have?
                MethodInsnNode methodCall = (MethodInsnNode) insn;
                System.out.println("		Call method: " + methodCall.owner + " " + methodCall.name);
            } else if (insn instanceof VarInsnNode) {
                // Some some kind of variable *LOAD or *STORE operation.
                VarInsnNode varInsn = (VarInsnNode) insn;
                int opCode = varInsn.getOpcode();
                // See VarInsnNode.setOpcode for the list of possible values of
                // opCode. These are from a variable-related subset of Java
                // opcodes.
            }
            // There are others...
            // This list of direct known subclasses may be useful:
            // http://asm.ow2.org/asm50/javadoc/user/org/objectweb/asm/tree/AbstractInsnNode.html
        }
    }
}
