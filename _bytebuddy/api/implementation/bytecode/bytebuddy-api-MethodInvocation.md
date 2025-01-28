---
title: "MethodInvocation"
sequence: "MethodInvocation"
---

## API 设计

### 两个组成部分

#### MethodInvocation

```java
public enum MethodInvocation {
    VIRTUAL(Opcodes.INVOKEVIRTUAL, Opcodes.H_INVOKEVIRTUAL, Opcodes.INVOKEVIRTUAL, Opcodes.H_INVOKEVIRTUAL),
    INTERFACE(Opcodes.INVOKEINTERFACE, Opcodes.H_INVOKEINTERFACE, Opcodes.INVOKEINTERFACE, Opcodes.H_INVOKEINTERFACE),
    STATIC(Opcodes.INVOKESTATIC, Opcodes.H_INVOKESTATIC, Opcodes.INVOKESTATIC, Opcodes.H_INVOKESTATIC),
    SPECIAL(Opcodes.INVOKESPECIAL, Opcodes.H_INVOKESPECIAL, Opcodes.INVOKESPECIAL, Opcodes.H_INVOKESPECIAL),
    SPECIAL_CONSTRUCTOR(Opcodes.INVOKESPECIAL, Opcodes.H_NEWINVOKESPECIAL, Opcodes.INVOKESPECIAL, Opcodes.H_NEWINVOKESPECIAL),
    VIRTUAL_PRIVATE(Opcodes.INVOKEVIRTUAL, Opcodes.H_INVOKEVIRTUAL, Opcodes.INVOKESPECIAL, Opcodes.H_INVOKESPECIAL),
    INTERFACE_PRIVATE(Opcodes.INVOKEINTERFACE, Opcodes.H_INVOKEINTERFACE, Opcodes.INVOKESPECIAL, Opcodes.H_INVOKESPECIAL);
    
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

#### WithImplicitInvocationTargetType

```java
public enum MethodInvocation {
    public interface WithImplicitInvocationTargetType extends StackManipulation {
        StackManipulation virtual(TypeDescription invocationTarget);
        StackManipulation special(TypeDescription invocationTarget);
        StackManipulation dynamic(String methodName,
                                  TypeDescription returnType,
                                  List<? extends TypeDescription> methodType,
                                  List<? extends JavaConstant> arguments);
        StackManipulation onHandle(HandleType type);
    }
}
```

### OPCODE

```text
                                                                    ┌─── MethodInvocation.VIRTUAL
                                            ┌─── INVOKEVIRTUAL ─────┤
                                            │                       └─── MethodInvocation.VIRTUAL_PRIVATE
                                            │
                                            │                       ┌─── MethodInvocation.INTERFACE
                                            ├─── INVOKEINTERFACE ───┤
MethodInvocation::opcode ───┼─── Opcodes ───┤                       └─── MethodInvocation.INTERFACE_PRIVATE
                                            │
                                            ├─── INVOKESTATIC ──────┼─── MethodInvocation.STATIC
                                            │
                                            │                       ┌─── MethodInvocation.SPECIAL
                                            └─── INVOKESPECIAL ─────┤
                                                                    └─── MethodInvocation.SPECIAL_CONSTRUCTOR
```

## 示例

### VIRTUAL_PRIVATE

预期目标：

```java
public class HelloWorld {
    public void test() {
        // Java 08: invokespecial
        // Java 11: invokevirtual
        this.targetMethod();
    }

    private void targetMethod() {
    }
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.ClassFileVersion;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodCall;
import net.bytebuddy.implementation.StubMethod;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy().with(ClassFileVersion.JAVA_V17);
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineMethod("targetMethod", void.class, Visibility.PRIVATE)
                .intercept(StubMethod.INSTANCE);

        builder = builder.defineMethod("test", void.class, Visibility.PUBLIC)
                .intercept(MethodCall.invoke(ElementMatchers.named("targetMethod")));

        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### INTERFACE_PRIVATE

预期目标：

```java
public interface HelloWorld {
    default void test() {
        // Java 08: invokespecial
        // Java 11: invokeinterface
        this.targetMethod();
    }

    private void targetMethod() {
    }
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.ClassFileVersion;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodCall;
import net.bytebuddy.implementation.StubMethod;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy().with(ClassFileVersion.JAVA_V17);
        DynamicType.Builder<?> builder = byteBuddy.makeInterface()
                .name(className);

        builder = builder.defineMethod("targetMethod", void.class, Visibility.PRIVATE)
                .intercept(StubMethod.INSTANCE);

        builder = builder.defineMethod("test", void.class, Visibility.PUBLIC)
                .intercept(MethodCall.invoke(ElementMatchers.named("targetMethod")));

        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```
