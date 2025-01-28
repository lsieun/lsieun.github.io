---
title: "Class 不同的名字"
sequence: "104"
---

```text
                                   ┌─── getName()
               ┌─── array ─────────┤
               │                   └─── getTypeName()
Class::name ───┤
               │                   ┌─── getTypeName()
               └─── inner.class ───┤
                                   └─── getCanonicalName()
```

```java
import java.util.List;

public class ClassFile_02_Name {
    public static void main(String[] args) throws Throwable {
        // method parameters
        Class<?> clazz = Class.class;
        List<String> methodNameList = List.of(
                "getName",
                "getTypeName",
                "getCanonicalName",
                "getSimpleName"
        );
        Class<?>[] objArray = {
                void.class,
                int.class,
                int[].class,
                MyOuterClass.InnerClass.class,
                MyOuterClass.InnerClass[].class,
                // MyAnonymousContainer.INSTANCE.getClazzFromField(),
                // MyLambda.getLambdaClass(),
        };

        // method invoke
        MethodInvokeUtils.compare(clazz, methodNameList, objArray);
    }
}
```

```text
┌────────────────────┬──────┬─────┬───────┬───────────────────────────────────┬──────────────────────────────────────┐
│                    │ void │ int │ int[] │      MyOuterClass.InnerClass      │      MyOuterClass.InnerClass[]       │
├────────────────────┼──────┼─────┼───────┼───────────────────────────────────┼──────────────────────────────────────┤
│     getName()      │ void │ int │  [I   │ sample.my.MyOuterClass$InnerClass │ [Lsample.my.MyOuterClass$InnerClass; │
├────────────────────┼──────┼─────┼───────┼───────────────────────────────────┼──────────────────────────────────────┤
│   getTypeName()    │ void │ int │ int[] │ sample.my.MyOuterClass$InnerClass │ sample.my.MyOuterClass$InnerClass[]  │
├────────────────────┼──────┼─────┼───────┼───────────────────────────────────┼──────────────────────────────────────┤
│ getCanonicalName() │ void │ int │ int[] │ sample.my.MyOuterClass.InnerClass │ sample.my.MyOuterClass.InnerClass[]  │
├────────────────────┼──────┼─────┼───────┼───────────────────────────────────┼──────────────────────────────────────┤
│  getSimpleName()   │ void │ int │ int[] │            InnerClass             │             InnerClass[]             │
└────────────────────┴──────┴─────┴───────┴───────────────────────────────────┴──────────────────────────────────────┘
```

```java
import java.util.List;

public class ClassFile_02_ThisClass {
    public static void main(String[] args) throws Exception {
        // method parameters
        Class<?> clazz = Class.class;
        List<String> methodNameList = List.of(
                "getName",
                "getTypeName",
                "getSimpleName",
                "getCanonicalName",
                "descriptorString",
                "describeConstable"
        );
        Class<?>[] objArray = {
                void.class,
                int.class,
                int[].class,
                HelloWorld.class,
                HelloWorld[].class,
                MyOuterClass.InnerClass.class,
                MyOuterClass.InnerClass[].class,
                MyAnonymousContainer.INSTANCE.getClazzFromField(),
                MyLambda.getLambdaClass(),
        };

        // method invoke
        MethodInvokeUtils.invoke(clazz, methodNameList, objArray);
    }
}
```

```text
┌─────────────────────┬──────────────────────────┐
│        clazz        │           void           │
├─────────────────────┼──────────────────────────┤
│      getName()      │           void           │
├─────────────────────┼──────────────────────────┤
│    getTypeName()    │           void           │
├─────────────────────┼──────────────────────────┤
│   getSimpleName()   │           void           │
├─────────────────────┼──────────────────────────┤
│ getCanonicalName()  │           void           │
├─────────────────────┼──────────────────────────┤
│ descriptorString()  │            V             │
├─────────────────────┼──────────────────────────┤
│ describeConstable() │ PrimitiveClassDesc[void] │
└─────────────────────┴──────────────────────────┘

┌─────────────────────┬─────────────────────────┐
│        clazz        │           int           │
├─────────────────────┼─────────────────────────┤
│      getName()      │           int           │
├─────────────────────┼─────────────────────────┤
│    getTypeName()    │           int           │
├─────────────────────┼─────────────────────────┤
│   getSimpleName()   │           int           │
├─────────────────────┼─────────────────────────┤
│ getCanonicalName()  │           int           │
├─────────────────────┼─────────────────────────┤
│ descriptorString()  │            I            │
├─────────────────────┼─────────────────────────┤
│ describeConstable() │ PrimitiveClassDesc[int] │
└─────────────────────┴─────────────────────────┘

┌─────────────────────┬──────────────────┐
│        clazz        │      int[]       │
├─────────────────────┼──────────────────┤
│      getName()      │        [I        │    <--- Notice
├─────────────────────┼──────────────────┤
│    getTypeName()    │      int[]       │    <--- Notice
├─────────────────────┼──────────────────┤
│   getSimpleName()   │      int[]       │
├─────────────────────┼──────────────────┤
│ getCanonicalName()  │      int[]       │
├─────────────────────┼──────────────────┤
│ descriptorString()  │        [I        │
├─────────────────────┼──────────────────┤
│ describeConstable() │ ClassDesc[int[]] │
└─────────────────────┴──────────────────┘

┌─────────────────────┬───────────────────────┐
│        clazz        │      HelloWorld       │
├─────────────────────┼───────────────────────┤
│      getName()      │   sample.HelloWorld   │
├─────────────────────┼───────────────────────┤
│    getTypeName()    │   sample.HelloWorld   │
├─────────────────────┼───────────────────────┤
│   getSimpleName()   │      HelloWorld       │
├─────────────────────┼───────────────────────┤
│ getCanonicalName()  │   sample.HelloWorld   │
├─────────────────────┼───────────────────────┤
│ descriptorString()  │  Lsample/HelloWorld;  │
├─────────────────────┼───────────────────────┤
│ describeConstable() │ ClassDesc[HelloWorld] │
└─────────────────────┴───────────────────────┘

┌─────────────────────┬─────────────────────────┐
│        clazz        │      HelloWorld[]       │
├─────────────────────┼─────────────────────────┤
│      getName()      │  [Lsample.HelloWorld;   │    <--- Notice
├─────────────────────┼─────────────────────────┤
│    getTypeName()    │   sample.HelloWorld[]   │    <--- Notice
├─────────────────────┼─────────────────────────┤
│   getSimpleName()   │      HelloWorld[]       │
├─────────────────────┼─────────────────────────┤
│ getCanonicalName()  │   sample.HelloWorld[]   │
├─────────────────────┼─────────────────────────┤
│ descriptorString()  │  [Lsample/HelloWorld;   │
├─────────────────────┼─────────────────────────┤
│ describeConstable() │ ClassDesc[HelloWorld[]] │
└─────────────────────┴─────────────────────────┘

┌─────────────────────┬─────────────────────────────────────┐
│        clazz        │       MyOuterClass.InnerClass       │
├─────────────────────┼─────────────────────────────────────┤
│      getName()      │  sample.my.MyOuterClass$InnerClass  │
├─────────────────────┼─────────────────────────────────────┤
│    getTypeName()    │  sample.my.MyOuterClass$InnerClass  │    <--- Notice
├─────────────────────┼─────────────────────────────────────┤
│   getSimpleName()   │             InnerClass              │
├─────────────────────┼─────────────────────────────────────┤
│ getCanonicalName()  │  sample.my.MyOuterClass.InnerClass  │    <--- Notice
├─────────────────────┼─────────────────────────────────────┤
│ descriptorString()  │ Lsample/my/MyOuterClass$InnerClass; │
├─────────────────────┼─────────────────────────────────────┤
│ describeConstable() │ ClassDesc[MyOuterClass$InnerClass]  │
└─────────────────────┴─────────────────────────────────────┘

┌─────────────────────┬──────────────────────────────────────┐
│        clazz        │      MyOuterClass.InnerClass[]       │
├─────────────────────┼──────────────────────────────────────┤
│      getName()      │ [Lsample.my.MyOuterClass$InnerClass; │    <--- Notice
├─────────────────────┼──────────────────────────────────────┤
│    getTypeName()    │ sample.my.MyOuterClass$InnerClass[]  │    <--- Notice
├─────────────────────┼──────────────────────────────────────┤
│   getSimpleName()   │             InnerClass[]             │
├─────────────────────┼──────────────────────────────────────┤
│ getCanonicalName()  │ sample.my.MyOuterClass.InnerClass[]  │    <--- Notice
├─────────────────────┼──────────────────────────────────────┤
│ descriptorString()  │ [Lsample/my/MyOuterClass$InnerClass; │
├─────────────────────┼──────────────────────────────────────┤
│ describeConstable() │ ClassDesc[MyOuterClass$InnerClass[]] │
└─────────────────────┴──────────────────────────────────────┘

┌─────────────────────┬────────────────────────────────────┐
│        clazz        │       MyAnonymousContainer$1       │
├─────────────────────┼────────────────────────────────────┤
│      getName()      │  sample.my.MyAnonymousContainer$1  │
├─────────────────────┼────────────────────────────────────┤
│    getTypeName()    │  sample.my.MyAnonymousContainer$1  │
├─────────────────────┼────────────────────────────────────┤
│   getSimpleName()   │                                    │    <--- Notice
├─────────────────────┼────────────────────────────────────┤
│ getCanonicalName()  │                null                │    <--- Notice
├─────────────────────┼────────────────────────────────────┤
│ descriptorString()  │ Lsample/my/MyAnonymousContainer$1; │
├─────────────────────┼────────────────────────────────────┤
│ describeConstable() │ ClassDesc[MyAnonymousContainer$1]  │
└─────────────────────┴────────────────────────────────────┘

┌─────────────────────┬────────────────────────────────────────────────────┐
│        clazz        │       MyLambda$$Lambda$15/0x0000024a22002ca8       │
├─────────────────────┼────────────────────────────────────────────────────┤
│      getName()      │  sample.my.MyLambda$$Lambda$15/0x0000024a22002ca8  │
├─────────────────────┼────────────────────────────────────────────────────┤
│    getTypeName()    │  sample.my.MyLambda$$Lambda$15/0x0000024a22002ca8  │
├─────────────────────┼────────────────────────────────────────────────────┤
│   getSimpleName()   │       MyLambda$$Lambda$15/0x0000024a22002ca8       │    <--- Notice
├─────────────────────┼────────────────────────────────────────────────────┤
│ getCanonicalName()  │                        null                        │    <--- Notice
├─────────────────────┼────────────────────────────────────────────────────┤
│ descriptorString()  │ Lsample/my/MyLambda$$Lambda$15.0x0000024a22002ca8; │
├─────────────────────┼────────────────────────────────────────────────────┤
│ describeConstable() │                                                    │
└─────────────────────┴────────────────────────────────────────────────────┘
```
