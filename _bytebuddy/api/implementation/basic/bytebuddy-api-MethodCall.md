---
title: "MethodCall"
sequence: "MethodCall"
---

## MethodCall 的定位

`MethodCall` is the ByteBuddy component that can produce the bytecode
to invoke either Java constructor or method.

```text
                             ┌─── FixedValue
                             │
                             ├─── FieldAccessor
                             │
                             │
Implementation: hierarchy ───┤                     ┌─── StubMethod
                             │                     │
                             │                     ├─── MethodCall
                             │                     │
                             │                     ├─── SuperMethodCall
                             └─── Composable ──────┤
                                                   ├─── MethodDelegation
                                                   │
                                                   ├─── InvokeDynamic
                                                   │
                                                   └─── FieldSetting
```

```java
public class MethodCall implements Implementation.Composable {
}
```

## MethodCall 类的方法

```text
                                        ┌─── invoke(Constructor<?> constructor)
                                        │
                                        ├─── invoke(Method method)
                                        │
                      ┌─── method ──────┼─── invoke(MethodDescription methodDescription)
                      │                 │
                      │                 ├─── invokeSelf()
                      │                 │
                      │                 └─── invokeSuper()
                      │
                      │                 ┌─── construct(Constructor<?> constructor)
                      ├─── instance ────┤
                      │                 └─── construct(MethodDescription methodDescription)
                      │
                      │                                  ┌─── with(Object... argument)
                      │                                  │
                      │                                  ├─── with(TypeDescription... typeDescription)
                      │                 ┌─── basic ──────┤
                      │                 │                ├─── with(JavaConstant... javaConstant)
                      │                 │                │
                      │                 │                └─── withReference(Object... argument)
                      │                 │
                      │                 │                ┌─── withArgument(int... index)
                      │                 │                │
MethodCall: method ───┤                 │                ├─── withAllArguments()
                      │                 │                │
                      │                 │                ├─── withArgumentArray()
                      │                 ├─── argument ───┤
                      │                 │                ├─── withArgumentArrayElements(int index)
                      ├─── parameter ───┤                │
                      │                 │                ├─── withArgumentArrayElements(int index, int size)
                      │                 │                │
                      │                 │                └─── withArgumentArrayElements(int index, int start, int size)
                      │                 │
                      │                 ├─── this ───────┼─── withThis()
                      │                 │
                      │                 ├─── class ──────┼─── withOwnType()
                      │                 │
                      │                 ├─── field ──────┼─── withField(String... name)
                      │                 │
                      │                 │
                      │                 └─── method ─────┼─── withMethodCall(MethodCall methodCall)
                      │                 ┌─── setsField(Field field)
                      │                 │
                      └─── return ──────┼─── setsField(FieldDescription fieldDescription)
                                        │
                                        └─── setsField(ElementMatcher<? super FieldDescription> matcher)
```

## MethodCall 的组成部分

```java
public class GoodChild {
    public String study(String subject, int minutes) {
        return String.format("I'm studying %s for %d minutes.", subject, minutes);
    }
}
```

```java
public class GoodChildRun {
    public static void main(String[] args) {
        GoodChild child = new GoodChild();
        String result = child.study("Math", 30);
        System.out.println(result);
    }
}
```

![](/assets/images/bytebuddy/method-call-components.png)

```java
public class MethodCall implements Implementation.Composable {
    protected final MethodLocator.Factory methodLocator;
    protected final TargetHandler.Factory targetHandler;
    protected final List<ArgumentLoader.Factory> argumentLoaders;
    protected final MethodInvoker.Factory methodInvoker;
    protected final TerminationHandler.Factory terminationHandler;
    protected final Assigner assigner;
    protected final Assigner.Typing typing;

    protected MethodCall(MethodLocator.Factory methodLocator,
                         TargetHandler.Factory targetHandler,
                         List<ArgumentLoader.Factory> argumentLoaders,
                         MethodInvoker.Factory methodInvoker,
                         TerminationHandler.Factory terminationHandler,
                         Assigner assigner,
                         Assigner.Typing typing) {
        this.methodLocator = methodLocator;
        this.targetHandler = targetHandler;
        this.argumentLoaders = argumentLoaders;
        this.methodInvoker = methodInvoker;
        this.terminationHandler = terminationHandler;
        this.assigner = assigner;
        this.typing = typing;
    }
}
```

## WithoutSpecifiedTarget

```java
public static class WithoutSpecifiedTarget extends MethodCall {
}
```

![](/assets/images/bytebuddy/method-call-without-specified-target.png)

```text
                                           ┌─── on(Object target)
                          ┌─── object ─────┤
                          │                └─── on(T target, Class<? super T> type)
                          │
                          ├─── argument ───┼─── onArgument(int index)
                          │
                          │                ┌─── onField(String name)
                          │                │
                          │                ├─── onField(String name, FieldLocator.Factory fieldLocatorFactory)
                          ├─── field ──────┤
                          │                ├─── onField(Field field)
WithoutSpecifiedTarget ───┤                │
                          │                └─── onField(FieldDescription fieldDescription)
                          │
                          ├─── method ─────┼─── onMethodCall(MethodCall methodCall)
                          │
                          ├─── super ──────┼─── onSuper()
                          │
                          ├─── default ────┼─── onDefault()
                          │
                          │                ┌─── on(StackManipulation stackManipulation, Class<?> type)
                          └─── stack ──────┤
                                           └─── on(StackManipulation stackManipulation, TypeDescription typeDescription)
```
