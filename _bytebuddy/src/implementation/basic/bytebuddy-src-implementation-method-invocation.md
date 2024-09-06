---
title: "MethodInvocation"
sequence: "103"
---

## MethodInvocation

```java
public enum MethodInvocation {
}
```

```java
public enum MethodInvocation {
    ;
    private final int opcode;
    private final int handle;
    private final int legacyOpcode;
    private final int legacyHandle;

    MethodInvocation(int opcode, int handle, int legacyOpcode, int legacyHandle) {
        this.opcode = opcode;
        this.handle = handle;
        this.legacyOpcode = legacyOpcode;
        this.legacyHandle = legacyHandle;
    }
}
```

```java
public enum MethodInvocation {
    VIRTUAL(Opcodes.INVOKEVIRTUAL, Opcodes.H_INVOKEVIRTUAL, Opcodes.INVOKEVIRTUAL, Opcodes.H_INVOKEVIRTUAL),
    INTERFACE(Opcodes.INVOKEINTERFACE, Opcodes.H_INVOKEINTERFACE, Opcodes.INVOKEINTERFACE, Opcodes.H_INVOKEINTERFACE),
    STATIC(Opcodes.INVOKESTATIC, Opcodes.H_INVOKESTATIC, Opcodes.INVOKESTATIC, Opcodes.H_INVOKESTATIC),
    SPECIAL(Opcodes.INVOKESPECIAL, Opcodes.H_INVOKESPECIAL, Opcodes.INVOKESPECIAL, Opcodes.H_INVOKESPECIAL),
    SPECIAL_CONSTRUCTOR(Opcodes.INVOKESPECIAL, Opcodes.H_NEWINVOKESPECIAL, Opcodes.INVOKESPECIAL, Opcodes.H_NEWINVOKESPECIAL),
    VIRTUAL_PRIVATE(Opcodes.INVOKEVIRTUAL, Opcodes.H_INVOKEVIRTUAL, Opcodes.INVOKESPECIAL, Opcodes.H_INVOKESPECIAL),
    INTERFACE_PRIVATE(Opcodes.INVOKEINTERFACE, Opcodes.H_INVOKEINTERFACE, Opcodes.INVOKESPECIAL, Opcodes.H_INVOKESPECIAL);
}
```

