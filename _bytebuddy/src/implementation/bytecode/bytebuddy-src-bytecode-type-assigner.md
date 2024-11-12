---
title: "Assigner"
sequence: "103"
---

Byte Buddy's built in `Implementation`s rely on an `Assigner` in order to assign values to variables.
In this process, an `Assigner` is able to apply a transformation of one value to another
by emitting an appropriate `StackManipulation`.

Doing so, Byte Buddy's built-in assigners provide for example auto-boxing of primitive values and their wrapper types.

In the most trivial case, a value is assignable to a variable as is.

In some cases, an assignment may however not be possible at all
which can be expressed by returning an invalid `StackManipulation` from an assigner.
A canonical implementation of an invalid assignment is provided by Byte Buddy's `StackManipulation.Illegal.INSTANCE`.

```java
public interface Assigner {
    StackManipulation assign(TypeDescription.Generic source, TypeDescription.Generic target, Typing typing);
}
```

## 示例

```java
import net.bytebuddy.description.method.MethodDescription;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.implementation.bytecode.StackManipulation;
import net.bytebuddy.implementation.bytecode.assign.Assigner;
import net.bytebuddy.implementation.bytecode.member.MethodInvocation;
import net.bytebuddy.matcher.ElementMatchers;

public enum ToStringAssigner implements Assigner {
    INSTANCE; // singleton

    @Override
    public StackManipulation assign(TypeDescription.Generic source, TypeDescription.Generic target, Typing typing) {
        if (!source.isPrimitive() && target.represents(String.class)) {
            MethodDescription toStringMethod = new TypeDescription.ForLoadedType(Object.class)
                    .getDeclaredMethods()
                    .filter(ElementMatchers.named("toString"))
                    .getOnly();
            TypeDescription sourceType = source.asErasure();
            return MethodInvocation.invoke(toStringMethod).virtual(sourceType);
        }
        else {
            return StackManipulation.Illegal.INSTANCE;
        }
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.FixedValue;
import net.bytebuddy.implementation.bytecode.assign.Assigner;
import net.bytebuddy.implementation.bytecode.assign.primitive.PrimitiveTypeAwareAssigner;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.method(ElementMatchers.named("toString"))
                .intercept(
                        FixedValue.value(42)
                                .withAssigner(
                                        new PrimitiveTypeAwareAssigner(ToStringAssigner.INSTANCE),
                                        Assigner.Typing.STATIC
                                )
                );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```





