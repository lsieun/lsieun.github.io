---
title: "Advice Intro"
sequence: "101"
---

我发现 `Advice` 实现了 `Implementation` 接口，是不是也意味着它可以放在 `intercept()` 方法里呢？

```java
public class Advice implements AsmVisitorWrapper.ForDeclaredMethods.MethodVisitorWrapper, Implementation {
}
```

```text
                            ┌─── @OnMethodEnter
          ┌─── method ──────┤
          │                 └─── @OnMethodExit
          │
          │                 ┌─── meta ───────┼─── @Origin
          │                 │
          │                 │                ┌─── @This
          │                 │                │
Advice ───┤                 │                ├─── @Argument
          │                 ├─── argument ───┤
          │                 │                ├─── @AllArguments
          │                 │                │
          │                 │                └─── @Unused
          │                 │
          │                 ├─── local ──────┼─── @Local
          └─── parameter ───┤
                            │                ┌─── @Return
                            │                │
                            ├─── exit ───────┼─── @Thrown
                            │                │
                            │                └─── @StubValue
                            │
                            ├─── field ──────┼─── @FieldValue
                            │
                            │
                            │                ┌─── @Enter
                            └─── advice ─────┤
                                             └─── @Exit
```

```text
                                 ┌─── meta ─────┼─── @Advice.Origin
                                 │
                                 ├─── field ────┼─── @Advice.FieldValue
          ┌─── Both ─────────────┤
          │                      │              ┌─── instance ───┼─── @Advice.This
          │                      │              │
          │                      │              │                ┌─── @Advice.Argument
          │                      └─── method ───┼─── arg ────────┤
          │                                     │                └─── @Advice.AllArguments
Advice ───┤                                     │
          │                                     └─── local ──────┼─── @Advice.Local
          │
          ├─── @OnMethodEnter
          │
          │                      ┌─── local ───┼─── @Advice.Enter
          │                      │
          └─── @OnMethodExit ────┤                               ┌─── @Advice.Return
                                 │             ┌─── return ──────┤
                                 └─── exit ────┤                 └─── @Advice.StubValue
                                               │
                                               └─── exception ───┼─── @Advice.Thrown
```

Advice wrappers copy **the code of blueprint methods** to be executed before and/or after a **matched method**.
To achieve this, **a static method of a class** is annotated by `Advice.OnMethodEnter`
and/or `Advice.OnMethodExit` and provided to **an instance of this class**.

A method that is annotated with `Advice.OnMethodEnter` can annotate its parameters with `Advice.Argument`
where field access to this parameter is substituted with access to the specified argument of the instrumented method.
Alternatively, a parameter can be annotated by Advice.
This where the `this` reference of the instrumented method is read when the parameter is accessed.
This mechanism can also be used to assign a new value to the `this` reference of an instrumented method.
If no annotation is used on a parameter,
it is assigned the n-th parameter of the instrumented method for the n-th parameter of the advice method.
All parameters must declare the exact same type as the parameters of the instrumented type or
the method's declaring type for the Advice.
This reference respectively if they are not marked as read-only.
In the latter case, it suffices that a parameter type is a super type of the corresponding type of the instrumented method.

A method that is annotated with `Advice.OnMethodExit`
can equally annotate its parameters with `Advice.Argument` and `Advice.This`.
Additionally, it can annotate a parameter with `Advice.Return` to receive the original method's return value.
By reassigning the return value, it is possible to replace the returned value.
If an instrumented method does not return a value, this annotation must not be used.
If a method returns exceptionally,
the parameter is set to its default value, i.e. to `0` for primitive types and to `null` for reference types.
The parameter's type must be equal to the instrumented method's return type
if it is not set to read-only where it suffices to declare the parameter type to be of any super type
to the instrumented method's return type.
An exception can be read by annotating a parameter of type Throwable annotated with `Advice.Thrown`
which is assigned the thrown `Throwable` or `null` if a method returns normally.
Doing so, it is possible to exchange a thrown exception with any checked or unchecked exception.
Finally, if a method annotated with `Advice.OnMethodEnter` exists and this method returns a value,
this value can be accessed by a parameter annotated with `Advice.Enter`.
This parameter must declare the same type as type being returned by the method annotated with `Advice.OnMethodEnter`.
If the parameter is marked to be read-only,
it suffices that the annotated parameter is of a super type of the return type of the method annotated by `Advice.OnMethodEnter`.
If no such method exists or this method returns void, no such parameter must be declared.
Any return value of a method that is annotated by `Advice.OnMethodExit` is discarded.

If any advice method throws an exception, the method is terminated prematurely.
If the method annotated by `Advice.OnMethodEnter` throws an exception,
the method annotated by `Advice.OnMethodExit` method is not invoked.
If the instrumented method throws an exception,
the method that is annotated by `Advice.OnMethodExit` is only invoked
if the `Advice.OnMethodExit.onThrowable()` property is set to `true` what is the default.
If this property is set to `false`, the `Advice.Thrown` annotation must not be used on any parameter.

Byte Buddy does not assert the visibility of any types that are referenced within an inlined advice method.
It is the responsibility of the user of this class to assure
that all types referenced within the advice methods are visible to the instrumented class.
Failing to do so results in a IllegalAccessError at the instrumented class's runtime.

Advice can be used either as a `AsmVisitorWrapper`
where any declared methods of the currently instrumented type are enhanced without replacing an existing implementation.
Alternatively, advice can function as an `Implementation`
where, by default, the original super or default method of the instrumented method is invoked.
If this is not possible or undesired, the delegate implementation can be changed
by specifying a wrapped implementation explicitly by wrap(Implementation).

When using an advice class as a visitor wrapper,
native or abstract methods which are silently skipped when advice matches such a method.

## Important

Important: Since Java 6, class files contain stack map frames embedded into a method's byte code.
When advice methods are compiled with a class file version less than Java 6
but are used for a class file that was compiled to Java 6 or newer,
these stack map frames must be computed by ASM by using the `ClassWriter.COMPUTE_FRAMES` option.
If the advice methods do not contain any branching instructions, this is not required.
No action is required if the advice methods are at least compiled with Java 6 but are used on classes older than Java 6.
This limitation only applies to advice methods that are inlined.
Also, it is the responsibility of this class's user to assure that
the advice method does not contain byte code constructs that are not supported
by the class containing the instrumented method.
In particular, pre Java-5 try-finally blocks cannot be inlined into classes with newer byte code levels
as the `jsr` instruction was deprecated.
Also, classes prior to Java 7 do not support the `invokedynamic` command
which must not be contained by an advice method if the instrumented method targets an older class file format version.

## Note

Note: For the purpose of inlining, Java 5 and Java 6 byte code can be seen as the best candidate for advice methods.
These versions do no longer allow subroutines, neither do they already allow invokedynamic instructions or method handles.
This way, Java 5 and Java 6 byte code is compatible to both older and newer versions.
One exception for backwards-incompatible byte code is the possibility
to load type references from the constant pool onto the operand stack.
These instructions can however easily be transformed for classes compiled to Java 4 and older
by registering a TypeConstantAdjustment before the advice visitor.

Note: It is not possible to trigger break points in inlined advice methods
as the debugging information of the inlined advice is not preserved.
It is not possible in Java to reference more than one source file per class
what makes translating such debugging information impossible.
It is however possible to set break points in advice methods when invoking the original advice target.
This allows debugging of advice code within unit tests that invoke the advice method without instrumentation.
As a consequence of not transferring debugging information,
the names of the parameters of an advice method do not matter when inlining,
neither does any meta information on the advice method's body such as annotations or parameter modifiers.

Note: The behavior of this component is undefined if it is supplied with invalid byte code what might result in runtime exceptions.

Note: When using advice from a Java agent with an `net.bytebuddy.agent.builder.AgentBuilder`,
it often makes sense to not include any library-specific code in the agent's jar file.
For being able to locate the advice code in the context of the library dependencies,
Byte Buddy offers an `net.bytebuddy.agent.builder.AgentBuilder.Transformer.ForAdvice` implementation
that allows registering the agent's class file locators for assembly of the advice class's description
at runtime and with respect to the specific user dependencies.
