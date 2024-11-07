---
title: "ModifierReviewable"
sequence: "ModifierReviewable"
---

## ModifierReviewable

```text
                                                                            ┌─── ForTypeDefinition
                                                      ┌─── OfAbstraction ───┤
                                                      │                     └─── ForMethodDescription
                      ┌─── OfByteCodeElement ─────────┤
                      │                               │                     ┌─── ForTypeDefinition
ModifierReviewable ───┤                               └─── OfEnumeration ───┤
                      │                                                     └─── ForFieldDescription
                      │
                      └─── ForParameterDescription
```

![](/assets/images/bytebuddy/description/modifier-reviewable-uml.png)

```text
public interface ModifierReviewable {
    int getModifiers();
    boolean isFinal();
    boolean isSynthetic();
    SyntheticState getSyntheticState();
}
```

```text
                      ┌─── getModifiers()
                      │
                      ├─── isFinal()
                      │
                      ├─── isSynthetic()
                      │
                      │                               ┌─── isPublic()
                      │                               │
                      │                               ├─── isProtected()
                      │                               │
                      │                               ├─── isPackagePrivate()
                      │                               │
                      │                               ├─── isPrivate()
                      │                               │
                      │                               ├─── isStatic()
                      │                               │
                      │                               ├─── isDeprecated()
                      │                               │
                      │                               ├─── getOwnership()
                      │                               │
                      │                               ├─── getVisibility()
                      │                               │
                      │                               │                          ┌─── isAbstract()
                      │                               │                          │
                      │                               │                          │                            ┌─── isInterface()
                      │                               │                          │                            │
                      │                               │                          ├─── ForTypeDefinition ──────┼─── isAnnotation()
                      │                               │                          │                            │
                      ├─── OfByteCodeElement ─────────┤                          │                            └─── getTypeManifestation()
                      │                               ├─── OfAbstraction ────────┤
                      │                               │                          │                            ┌─── isSynchronized()
ModifierReviewable ───┤                               │                          │                            │
                      │                               │                          │                            ├─── isVarArgs()
                      │                               │                          │                            │
                      │                               │                          │                            ├─── isNative()
                      │                               │                          │                            │
                      │                               │                          │                            ├─── isBridge()
                      │                               │                          └─── ForMethodDescription ───┤
                      │                               │                                                       ├─── isStrict()
                      │                               │                                                       │
                      │                               │                                                       ├─── getSynchronizationState()
                      │                               │                                                       │
                      │                               │                                                       ├─── getMethodStrictness()
                      │                               │                                                       │
                      │                               │                                                       └─── getMethodManifestation()
                      │                               │
                      │                               │                          ┌─── isEnum()
                      │                               │                          │
                      │                               │                          ├─── getEnumerationState()
                      │                               │                          │
                      │                               └─── OfEnumeration ────────┼─── ForTypeDefinition
                      │                                                          │
                      │                                                          │                             ┌─── isVolatile()
                      │                                                          │                             │
                      │                                                          │                             ├─── isTransient()
                      │                                                          └─── ForFieldDescription ─────┤
                      │                                                                                        ├─── getFieldManifestation()
                      │                                                                                        │
                      │                                                                                        └─── getFieldPersistence()
                      │
                      │                               ┌─── isMandated()
                      │                               │
                      └─── ForParameterDescription ───┼─── getParameterManifestation()
                                                      │
                                                      └─── getProvisioningState()
```

| Value    | Class            | Field           | Method             | Method Parameter |
|----------|------------------|-----------------|--------------------|------------------|
| `0x0001` | `ACC_PUBLIC`     | `ACC_PUBLIC`    | `ACC_PUBLIC`       |                  |
| `0x0002` |                  | `ACC_PRIVATE`   | `ACC_PRIVATE`      |                  |
| `0x0004` |                  | `ACC_PROTECTED` | `ACC_PROTECTED`    |                  |
| `0x0008` |                  | `ACC_STATIC`    | `ACC_STATIC`       |                  |
| `0x0010` | `ACC_FINAL`      | `ACC_FINAL`     | `ACC_FINAL`        | `ACC_FINAL`      |
| `0x0020` | `ACC_SUPER`      |                 | `ACC_SYNCHRONIZED` |                  |
| `0x0040` |                  | `ACC_VOLATILE`  | `ACC_BRIDGE`       |                  |
| `0x0080` |                  | `ACC_TRANSIENT` | `ACC_VARARGS`      |                  |
| `0x0100` |                  |                 | `ACC_NATIVE`       |                  |
| `0x0200` | `ACC_INTERFACE`  |                 |                    |                  |
| `0x0400` | `ACC_ABSTRACT`   |                 | `ACC_ABSTRACT`     |                  |
| `0x0800` |                  |                 | `ACC_STRICT`       |                  |
| `0x1000` | `ACC_SYNTHETIC`  | `ACC_SYNTHETIC` | `ACC_SYNTHETIC`    | `ACC_SYNTHETIC`  |
| `0x2000` | `ACC_ANNOTATION` |                 |                    |                  |
| `0x4000` | `ACC_ENUM`       | `ACC_ENUM`      |                    |                  |
| `0x8000` | `ACC_MODULE`     |                 |                    | `ACC_MANDATED`   |

## Reference

- [Chapter 4. The class File Format](https://docs.oracle.com/javase/specs/jvms/se17/html/jvms-4.html)
