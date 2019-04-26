package graph;
import org.objectweb.asm.Opcodes;

import client.ConfigSettings;

/**
 * Created by lewis on 12/14/16.
 */
public enum AccessLevel {
    PUBLIC, PROTECTED, PRIVATE;

    public static boolean hasAccess(int accessBitfield, AccessLevel renderAccess) {
        if ((accessBitfield & Opcodes.ACC_SYNTHETIC) != 0
                && !ConfigSettings.getShowSynthetic()) {
            return false;
        }
        if ((accessBitfield & Opcodes.ACC_PRIVATE) != 0) {
            return renderAccess == AccessLevel.PRIVATE;
        }

        if ((accessBitfield & Opcodes.ACC_PROTECTED) != 0) {
            return renderAccess != AccessLevel.PUBLIC;
        }

        return true;
    }
}
