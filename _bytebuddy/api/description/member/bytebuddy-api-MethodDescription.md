---
title: "MethodDescription"
sequence: "103"
---

## 概览

## API 设计

```text
                     ┌─── ForLoadedConstructor ───┼─── ForLoadedConstructor(Constructor<?> constructor)
                     │
MethodDescription ───┼─── ForLoadedMethod ────────┼─── ForLoadedMethod(Method method)
                     │
                     └─── Latent ─────────────────┼─── TypeInitializer ───┼─── TypeInitializer(TypeDescription typeDescription)
```

### 常量

```java
public interface MethodDescription extends TypeVariableSource,
        ModifierReviewable.ForMethodDescription,
        DeclaredByType.WithMandatoryDeclaration,
        ByteCodeElement.Member,
        ByteCodeElement.TypeDependant<MethodDescription.InDefinedShape, MethodDescription.Token> {
    /**
     * The internal name of a Java constructor.
     */
    String CONSTRUCTOR_INTERNAL_NAME = "<init>";

    /**
     * The internal name of a Java static initializer.
     */
    String TYPE_INITIALIZER_INTERNAL_NAME = "<clinit>";

    /**
     * The type initializer of any representation of a type initializer.
     */
    int TYPE_INITIALIZER_MODIFIER = Opcodes.ACC_STATIC;
}
```

### token

#### Token

```java
public interface MethodDescription extends TypeVariableSource,
        ModifierReviewable.ForMethodDescription,
        DeclaredByType.WithMandatoryDeclaration,
        ByteCodeElement.Member,
        ByteCodeElement.TypeDependant<MethodDescription.InDefinedShape, MethodDescription.Token> {
    class Token implements ByteCodeElement.Token<Token> {
        private final String name;
        private final int modifiers;
        private final List<? extends TypeVariableToken> typeVariableTokens;
        private final TypeDescription.Generic returnType;
        private final List<? extends ParameterDescription.Token> parameterTokens;
        private final List<? extends TypeDescription.Generic> exceptionTypes;
        private final List<? extends AnnotationDescription> annotations;
        private final AnnotationValue<?, ?> defaultValue;
        private final TypeDescription.Generic receiverType;
    }
}
```

#### SignatureToken

```java
public interface MethodDescription extends TypeVariableSource,
        ModifierReviewable.ForMethodDescription,
        DeclaredByType.WithMandatoryDeclaration,
        ByteCodeElement.Member,
        ByteCodeElement.TypeDependant<MethodDescription.InDefinedShape, MethodDescription.Token> {
    class SignatureToken {
        private final String name;
        private final TypeDescription returnType;
        private final List<? extends TypeDescription> parameterTypes;
    }
}
```

## 如何使用

### 获取对象

#### 创建

通过构造方法获取：

```text
new MethodDescription.ForLoadedMethod(method);
```

示例：

```java
import net.bytebuddy.description.method.MethodDescription;

import java.lang.reflect.Method;

public class HelloWorldAnalysis {
    public static void main(String[] args) throws NoSuchMethodException {
        Method method = System.class.getDeclaredMethod("exit", int.class);

        MethodDescription.ForLoadedMethod methodDesc = new MethodDescription.ForLoadedMethod(method);
        DescriptionForMethod.print(methodDesc);
    }
}
```

#### 查找

通过 `TypeDescription` 来获取：

```text
TypeDescription.getDeclaredMethods().filter(..).getOnly();
```

示例：

```java
import net.bytebuddy.description.method.MethodDescription;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldAnalysis {
    public static void main(String[] args) throws NoSuchMethodException {
        TypeDescription typeDesc = TypeDescription.ForLoadedType.of(System.class);
        MethodDescription.InDefinedShape methodDesc = typeDesc.getDeclaredMethods()
                .filter(ElementMatchers.named("exit"))
                .getOnly();
        DescriptionForMethod.print(methodDesc);
    }
}
```

### 方法分类

```text
                             ┌─── type ─────┼─── getDeclaringType()
                             │
                             │                             ┌─── modifier ────┼─── getActualModifiers()
                             │                             │
                             │                             │                 ┌─── initializer ───┼─── isTypeInitializer()
                             │                             │                 │
                             │                             │                 │                   ┌─── isConstructor()
                             │                             ├─── name ────────┼─── constructor ───┤
                             │                             │                 │                   └─── represents(Constructor<?> constructor)
                             │                             │                 │
                             │                             │                 │                   ┌─── isMethod()
                             │                             │                 └─── method ────────┤
MethodDescription::method ───┤              ┌─── head ─────┤                                     └─── represents(Method method)
                             │              │              │
                             │              │              ├─── parameter ───┼─── getParameters()
                             │              │              │
                             │              │              ├─── return ──────┼─── getReturnType()
                             │              │              │
                             │              │              ├─── exception ───┼─── getExceptionTypes()
                             │              │              │
                             │              │              │                 ┌─── asSignatureToken()
                             │              │              │                 │
                             │              │              └─── desc ────────┼─── asTypeToken()
                             │              │                                │
                             │              │                                └─── isBridgeCompatible()
                             └─── method ───┤
                                            ├─── body ─────┼─── localVariable ───┼─── getStackSize()
                                            │
                                            │              ┌─── type ───────┼─── getReceiverType()
                                            │              │
                                            ├─── invoke ───┼─── instance ───┼─── isInvokableOn()
                                            │              │
                                            │              └─── opcode ─────┼─── isSpecializableFor()
                                            │
                                            │              ┌─── super-sub ────┼─── isVirtual()
                                            │              │
                                            │              ├─── interface ────┼─── isDefaultMethod()
                                            │              │
                                            └─── check ────┤                  ┌─── getDefaultValue()
                                                           ├─── annotation ───┤
                                                           │                  └─── isDefaultValue()
                                                           │
                                                           │                  ┌─── isInvokeBootstrap()
                                                           └─── bootstrap ────┤
                                                                              └─── isConstantBootstrap()
```

```java
public class MyInitializer {
    static {
        System.out.println("Hello Class Initialization");
    }

    public MyInitializer() {
        System.out.println("Hello Constructor");
    }
}
```

```java
public class MyStatic {
    public static int staticMethod(int a, int b) {
        return a + b;
    }

    public int nonStaticMethod(int a, int b) {
        return a + b;
    }
}
```

```java
public interface MyInterface {
    void abstractMethod();

    default void defaultMethod() {
    }
}
```

```java
public class MyGeneric {
    public <A, B extends Number> void genericMethod(A a, B b) {
        System.out.println("Hello Generic Method");
    }
}
```

```java
public @interface MyAnnotation {
    int intValue() default 10;

    String strValue();
}
```

```java
import net.bytebuddy.description.method.MethodDescription;
import net.bytebuddy.description.method.MethodList;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldAnalysis {
    public static void main(String[] args) throws ClassNotFoundException {
        // 第 1 步，准备参数
        String[][] methodNameMatrix = {
                {"sample.MyInitializer", "<clinit>", "<init>"},
                {"sample.MyStatic", "staticMethod", "nonStaticMethod"},
                {"sample.MyInterface", "defaultMethod", "abstractMethod"},
                {"sample.MyGeneric", "genericMethod"},
                {"sample.MyAnnotation", "intValue", "strValue"},
                {"java.lang.invoke.LambdaMetafactory", "metafactory"}
        };


        // 第 2 步，计算方法数量
        int size = 0;
        for (String[] methodNameArray : methodNameMatrix) {
            size += methodNameArray.length - 1;
        }


        // 第 3 步，转换成 MethodDescription
        MethodDescription[] methodArray = new MethodDescription[size];

        int index = 0;
        for (String[] methodNameArray : methodNameMatrix) {
            String className = methodNameArray[0];
            Class<?> clazz = ClassUtils.loadClass(className);


            TypeDescription typeDesc = TypeDescription.ForLoadedType.of(clazz);
            MethodList<MethodDescription.InDefinedShape> methodList = typeDesc.getDeclaredMethods();

            int length = methodNameArray.length;
            for (int i = 1; i < length; i++) {
                String methodName = methodNameArray[i];
                if (MethodDescription.TYPE_INITIALIZER_INTERNAL_NAME.equals(methodName)) {
                    methodArray[index] = new MethodDescription.Latent.TypeInitializer(typeDesc);
                }
                else if (MethodDescription.CONSTRUCTOR_INTERNAL_NAME.equals(methodName)) {
                    methodArray[index] = methodList
                            .filter(ElementMatchers.isDefaultConstructor()).getOnly();
                }
                else {
                    methodArray[index] = methodList.filter(ElementMatchers.named(methodName)).getOnly();
                }
                index++;
            }
        }


        // 第 4 步，进行比对
        DescriptionForMethod.compare(methodArray);
    }
}
```

```text
┌──────────────────────┬──────────────────────┬──────────────────────┬───────────────────────────┬──────────────────────────────┬──────────────────────┬───────────────────────┬───────────────────────────────────────────────────────────────────┬─────────────────────┬───────────────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│     Method Info      │       <clinit>       │        <init>        │       staticMethod        │       nonStaticMethod        │    defaultMethod     │    abstractMethod     │                           genericMethod                           │      intValue       │             strValue              │                                                                                                                        metafactory                                                                                                                        │
├──────────────────────┼──────────────────────┼──────────────────────┼───────────────────────────┼──────────────────────────────┼──────────────────────┼───────────────────────┼───────────────────────────────────────────────────────────────────┼─────────────────────┼───────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│  getDeclaringType()  │ sample.MyInitializer │ sample.MyInitializer │      sample.MyStatic      │       sample.MyStatic        │  sample.MyInterface  │  sample.MyInterface   │                         sample.MyGeneric                          │ sample.MyAnnotation │        sample.MyAnnotation        │                                                                                                            java.lang.invoke.LambdaMetafactory                                                                                                             │
├──────────────────────┼──────────────────────┼──────────────────────┼───────────────────────────┼──────────────────────────────┼──────────────────────┼───────────────────────┼───────────────────────────────────────────────────────────────────┼─────────────────────┼───────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ getActualModifiers() │        static        │        public        │       public static       │            public            │        public        │    public abstract    │                              public                               │   public abstract   │          public abstract          │                                                                                                                       public static                                                                                                                       │
├──────────────────────┼──────────────────────┼──────────────────────┼───────────────────────────┼──────────────────────────────┼──────────────────────┼───────────────────────┼───────────────────────────────────────────────────────────────────┼─────────────────────┼───────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ isTypeInitializer()  │         true         │        false         │           false           │            false             │        false         │         false         │                               false                               │        false        │               false               │                                                                                                                           false                                                                                                                           │
├──────────────────────┼──────────────────────┼──────────────────────┼───────────────────────────┼──────────────────────────────┼──────────────────────┼───────────────────────┼───────────────────────────────────────────────────────────────────┼─────────────────────┼───────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│   isConstructor()    │        false         │         true         │           false           │            false             │        false         │         false         │                               false                               │        false        │               false               │                                                                                                                           false                                                                                                                           │
├──────────────────────┼──────────────────────┼──────────────────────┼───────────────────────────┼──────────────────────────────┼──────────────────────┼───────────────────────┼───────────────────────────────────────────────────────────────────┼─────────────────────┼───────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│      isMethod()      │        false         │        false         │           true            │             true             │         true         │         true          │                               true                                │        true         │               true                │                                                                                                                           true                                                                                                                            │
├──────────────────────┼──────────────────────┼──────────────────────┼───────────────────────────┼──────────────────────────────┼──────────────────────┼───────────────────────┼───────────────────────────────────────────────────────────────────┼─────────────────────┼───────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│   getParameters()    │          []          │          []          │        [int, int]         │          [int, int]          │          []          │          []           │                              [A, B]                               │         []          │                []                 │                                                                                     [MethodHandles$Lookup, String, MethodType, MethodType, MethodHandle, MethodType]                                                                                      │
├──────────────────────┼──────────────────────┼──────────────────────┼───────────────────────────┼──────────────────────────────┼──────────────────────┼───────────────────────┼───────────────────────────────────────────────────────────────────┼─────────────────────┼───────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│   getReturnType()    │         void         │         void         │            int            │             int              │         void         │         void          │                               void                                │         int         │      class java.lang.String       │                                                                                                              class java.lang.invoke.CallSite                                                                                                              │
├──────────────────────┼──────────────────────┼──────────────────────┼───────────────────────────┼──────────────────────────────┼──────────────────────┼───────────────────────┼───────────────────────────────────────────────────────────────────┼─────────────────────┼───────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ getExceptionTypes()  │          []          │          []          │            []             │              []              │          []          │          []           │                                []                                 │         []          │                []                 │                                                                                                                [LambdaConversionException]                                                                                                                │
├──────────────────────┼──────────────────────┼──────────────────────┼───────────────────────────┼──────────────────────────────┼──────────────────────┼───────────────────────┼───────────────────────────────────────────────────────────────────┼─────────────────────┼───────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│  asSignatureToken()  │   void <clinit>()    │    void <init>()     │ int staticMethod(int,int) │ int nonStaticMethod(int,int) │ void defaultMethod() │ void abstractMethod() │ void genericMethod(class java.lang.Object,class java.lang.Number) │   int intValue()    │ class java.lang.String strValue() │ class java.lang.invoke.CallSite metafactory(class java.lang.invoke.MethodHandles$Lookup,class java.lang.String,class java.lang.invoke.MethodType,class java.lang.invoke.MethodType,class java.lang.invoke.MethodHandle,class java.lang.invoke.MethodType) │
├──────────────────────┼──────────────────────┼──────────────────────┼───────────────────────────┼──────────────────────────────┼──────────────────────┼───────────────────────┼───────────────────────────────────────────────────────────────────┼─────────────────────┼───────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│    asTypeToken()     │         ()V          │         ()V          │           (II)I           │            (II)I             │         ()V          │          ()V          │              (Ljava/lang/Object;Ljava/lang/Number;)V              │         ()I         │       ()Ljava/lang/String;        │                       (Ljava/lang/invoke/MethodHandles$Lookup;Ljava/lang/String;Ljava/lang/invoke/MethodType;Ljava/lang/invoke/MethodType;Ljava/lang/invoke/MethodHandle;Ljava/lang/invoke/MethodType;)Ljava/lang/invoke/CallSite;                        │
├──────────────────────┼──────────────────────┼──────────────────────┼───────────────────────────┼──────────────────────────────┼──────────────────────┼───────────────────────┼───────────────────────────────────────────────────────────────────┼─────────────────────┼───────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ isBridgeCompatible() │         true         │         true         │           false           │            false             │         true         │         true          │                               false                               │        false        │               false               │                                                                                                                           false                                                                                                                           │
├──────────────────────┼──────────────────────┼──────────────────────┼───────────────────────────┼──────────────────────────────┼──────────────────────┼───────────────────────┼───────────────────────────────────────────────────────────────────┼─────────────────────┼───────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│    getStackSize()    │          0           │          1           │             2             │              3               │          1           │           1           │                                 3                                 │          1          │                 1                 │                                                                                                                             6                                                                                                                             │
└──────────────────────┴──────────────────────┴──────────────────────┴───────────────────────────┴──────────────────────────────┴──────────────────────┴───────────────────────┴───────────────────────────────────────────────────────────────────┴─────────────────────┴───────────────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

```text
┌──────────────────────┬──────────┬────────────────────────────┬──────────────┬───────────────────────┬──────────────────────────────┬──────────────────────────────┬────────────────────────┬───────────────────────────────┬───────────────────────────────┬─────────────┐
│    Method Invoke     │ <clinit> │           <init>           │ staticMethod │    nonStaticMethod    │        defaultMethod         │        abstractMethod        │     genericMethod      │           intValue            │           strValue            │ metafactory │
├──────────────────────┼──────────┼────────────────────────────┼──────────────┼───────────────────────┼──────────────────────────────┼──────────────────────────────┼────────────────────────┼───────────────────────────────┼───────────────────────────────┼─────────────┤
│  getReceiverType()   │   null   │ class sample.MyInitializer │     null     │ class sample.MyStatic │ interface sample.MyInterface │ interface sample.MyInterface │ class sample.MyGeneric │ interface sample.MyAnnotation │ interface sample.MyAnnotation │    null     │
├──────────────────────┼──────────┼────────────────────────────┼──────────────┼───────────────────────┼──────────────────────────────┼──────────────────────────────┼────────────────────────┼───────────────────────────────┼───────────────────────────────┼─────────────┤
│   isInvokableOn()    │  false   │            true            │    false     │         true          │             true             │             true             │          true          │             true              │             true              │    false    │
├──────────────────────┼──────────┼────────────────────────────┼──────────────┼───────────────────────┼──────────────────────────────┼──────────────────────────────┼────────────────────────┼───────────────────────────────┼───────────────────────────────┼─────────────┤
│ isSpecializableFor() │  false   │            true            │    false     │         true          │             true             │            false             │          true          │             false             │             false             │    false    │
└──────────────────────┴──────────┴────────────────────────────┴──────────────┴───────────────────────┴──────────────────────────────┴──────────────────────────────┴────────────────────────┴───────────────────────────────┴───────────────────────────────┴─────────────┘
```

```text
┌───────────────────────┬──────────┬────────┬──────────────┬─────────────────┬───────────────┬────────────────┬───────────────┬──────────┬──────────┬─────────────┐
│                       │ <clinit> │ <init> │ staticMethod │ nonStaticMethod │ defaultMethod │ abstractMethod │ genericMethod │ intValue │ strValue │ metafactory │
├───────────────────────┼──────────┼────────┼──────────────┼─────────────────┼───────────────┼────────────────┼───────────────┼──────────┼──────────┼─────────────┤
│      isVirtual()      │  false   │ false  │    false     │      true       │     true      │      true      │     true      │   true   │   true   │    false    │
├───────────────────────┼──────────┼────────┼──────────────┼─────────────────┼───────────────┼────────────────┼───────────────┼──────────┼──────────┼─────────────┤
│   isDefaultMethod()   │  false   │ false  │    false     │      false      │     true      │     false      │     false     │  false   │  false   │    false    │
├───────────────────────┼──────────┼────────┼──────────────┼─────────────────┼───────────────┼────────────────┼───────────────┼──────────┼──────────┼─────────────┤
│   isDefaultValue()    │  false   │ false  │    false     │      false      │     true      │      true      │     false     │   true   │   true   │    false    │
├───────────────────────┼──────────┼────────┼──────────────┼─────────────────┼───────────────┼────────────────┼───────────────┼──────────┼──────────┼─────────────┤
│   getDefaultValue()   │   null   │  null  │     null     │      null       │     null      │      null      │     null      │    10    │   null   │    null     │
├───────────────────────┼──────────┼────────┼──────────────┼─────────────────┼───────────────┼────────────────┼───────────────┼──────────┼──────────┼─────────────┤
│  isInvokeBootstrap()  │  false   │ false  │    false     │      false      │     false     │     false      │     false     │  false   │  false   │    true     │
├───────────────────────┼──────────┼────────┼──────────────┼─────────────────┼───────────────┼────────────────┼───────────────┼──────────┼──────────┼─────────────┤
│ isConstantBootstrap() │  false   │ false  │    false     │      false      │     false     │     false      │     false     │  false   │  false   │    false    │
└───────────────────────┴──────────┴────────┴──────────────┴─────────────────┴───────────────┴────────────────┴───────────────┴──────────┴──────────┴─────────────┘
```

## 示例

### Latent.TypeInitializer

```java
public class HelloWorld {
    static {
        System.out.println("Hello Type Initializer");
    }
}
```

```java
import net.bytebuddy.description.method.MethodDescription;
import net.bytebuddy.description.type.TypeDescription;

public class HelloWorldAnalysis {
    public static void main(String[] args) {
        TypeDescription typeDesc = TypeDescription.ForLoadedType.of(HelloWorld.class);
        MethodDescription.Latent.TypeInitializer typeInitializer = new MethodDescription.Latent.TypeInitializer(typeDesc);
        DescriptionForMethod.print(typeInitializer);
    }
}
```

### Constructor

```java
public class HelloWorld {
}
```

```java
import net.bytebuddy.description.method.MethodDescription;

import java.lang.reflect.Constructor;

public class HelloWorldAnalysis {
    public static void main(String[] args) throws NoSuchMethodException {
        Constructor<?> constructor = HelloWorld.class.getDeclaredConstructor();

        MethodDescription methodDesc = new MethodDescription.ForLoadedConstructor(constructor);
        DescriptionForMethod.print(methodDesc);
    }
}
```

### Default Method

```java
public interface HelloWorld {
    default void test(String name, int age) throws Exception {
        String message = String.format("Default Method: %s %d", name, age);
        System.out.println(message);
    }
}
```

```java
import net.bytebuddy.description.method.MethodDescription;

import java.lang.reflect.Method;

public class HelloWorldAnalysis {
    public static void main(String[] args) throws NoSuchMethodException {
        Method method = HelloWorld.class.getDeclaredMethod("test", String.class, int.class);
        MethodDescription.ForLoadedMethod methodDesc = new MethodDescription.ForLoadedMethod(method);
        DescriptionForMethod.print(methodDesc);
    }
}
```

### Generic Method

```java
public class HelloWorld {
    public <A, B> void test(A a, B b) {
        System.out.println("Hello Generic Method");
    }
}
```

```java
public class HelloWorld<A, B> {
    public void test(A a, B b) {
        System.out.println("Hello Plain Method in Generic Class");
    }
}
```

```java
import net.bytebuddy.description.method.MethodDescription;

import java.lang.reflect.Method;

public class HelloWorldAnalysis {
    public static void main(String[] args) throws NoSuchMethodException {
        Method method = HelloWorld.class.getDeclaredMethod("test", Object.class, Object.class);
        MethodDescription.ForLoadedMethod methodDesc = new MethodDescription.ForLoadedMethod(method);
        DescriptionForMethod.print(methodDesc);
    }
}
```

### LambdaMetafactory

```java
import net.bytebuddy.description.method.MethodDescription;

import java.lang.invoke.LambdaMetafactory;
import java.lang.reflect.Method;

public class HelloWorldAnalysis {
    public static void main(String[] args) {
        Method method = MethodUtils.findMethod(LambdaMetafactory.class, "metafactory");
        if (method == null) return;

        MethodDescription.ForLoadedMethod methodDesc = new MethodDescription.ForLoadedMethod(method);
        DescriptionForMethod.print(methodDesc);
    }
}
```

```text
Method Bootstrap
    isInvokeBootstrap()      : true
    isConstantBootstrap()    : false
```

## 示例

```java
public class OuterClass {
    static {
        System.out.println("OuterClass");
    }

    public OuterClass() {
    }

    public void nonStaticMethodOuter() {
    }

    public static void staticMethodOuter() {
    }

    public class InnerClass {
        static {
            System.out.println("InnerClass");
        }

        public InnerClass() {
        }

        public void nonStaticMethodInner() {
        }

        public static void staticMethodInner() {
        }
    }

    public static class StaticNestedClass {
        static {
            System.out.println("Nested");
        }

        public StaticNestedClass() {
        }

        public void nonStaticMethodNested() {
        }

        public static void staticMethodNested() {
        }
    }
}
```

```java
import net.bytebuddy.description.method.MethodDescription;
import net.bytebuddy.description.method.MethodList;
import net.bytebuddy.description.type.TypeDescription;

public class HelloWorldAnalysis {
    public static void main(String[] args) {
        Class<?>[] array = {
                OuterClass.class,
                OuterClass.InnerClass.class,
                OuterClass.StaticNestedClass.class
        };

        for (Class<?> clazz : array) {
            TypeDescription typeDesc = TypeDescription.ForLoadedType.of(clazz);
            printReceiverType(typeDesc);
        }
    }

    public static void printReceiverType(TypeDescription typeDesc) {
        MethodDescription.Latent.TypeInitializer typeInitializer = new MethodDescription.Latent.TypeInitializer(typeDesc);
        MethodList<? extends MethodDescription> methods = typeDesc.getDeclaredMethods();
        int rows = methods.size() + 2;
        int cols = 3;

        String[][] matrix = new String[rows][cols];
        matrix[0][0] = "getDeclaringType()";
        matrix[0][1] = "getInternalName()";
        matrix[0][2] = "getReceiverType()";

        matrix[1][0] = typeInitializer.getDeclaringType().toString();
        matrix[1][1] = typeInitializer.getInternalName();
        matrix[1][2] = String.valueOf(typeInitializer.getReceiverType());

        for (int i = 0; i < methods.size(); i++) {
            MethodDescription md = methods.get(i);
            matrix[i + 2][0] = md.getDeclaringType().toString();
            matrix[i + 2][1] = md.getInternalName();
            matrix[i + 2][2] = String.valueOf(md.getReceiverType());
        }

        TableUtils.printTable(matrix, TableType.ONE_LINE);
    }
}
```

```text
┌─────────────────────────┬──────────────────────┬─────────────────────────┐
│   getDeclaringType()    │  getInternalName()   │    getReceiverType()    │
├─────────────────────────┼──────────────────────┼─────────────────────────┤
│ class sample.OuterClass │       <clinit>       │          null           │
├─────────────────────────┼──────────────────────┼─────────────────────────┤
│ class sample.OuterClass │        <init>        │ class sample.OuterClass │
├─────────────────────────┼──────────────────────┼─────────────────────────┤
│ class sample.OuterClass │ nonStaticMethodOuter │ class sample.OuterClass │
├─────────────────────────┼──────────────────────┼─────────────────────────┤
│ class sample.OuterClass │  staticMethodOuter   │          null           │
└─────────────────────────┴──────────────────────┴─────────────────────────┘

┌────────────────────────────────────┬──────────────────────┬────────────────────────────────────┐
│         getDeclaringType()         │  getInternalName()   │         getReceiverType()          │
├────────────────────────────────────┼──────────────────────┼────────────────────────────────────┤
│ class sample.OuterClass$InnerClass │       <clinit>       │                null                │
├────────────────────────────────────┼──────────────────────┼────────────────────────────────────┤
│ class sample.OuterClass$InnerClass │        <init>        │      class sample.OuterClass       │
├────────────────────────────────────┼──────────────────────┼────────────────────────────────────┤
│ class sample.OuterClass$InnerClass │ nonStaticMethodInner │ class sample.OuterClass$InnerClass │
├────────────────────────────────────┼──────────────────────┼────────────────────────────────────┤
│ class sample.OuterClass$InnerClass │  staticMethodInner   │                null                │
└────────────────────────────────────┴──────────────────────┴────────────────────────────────────┘

┌───────────────────────────────────────────┬───────────────────────┬───────────────────────────────────────────┐
│            getDeclaringType()             │   getInternalName()   │             getReceiverType()             │
├───────────────────────────────────────────┼───────────────────────┼───────────────────────────────────────────┤
│ class sample.OuterClass$StaticNestedClass │       <clinit>        │                   null                    │
├───────────────────────────────────────────┼───────────────────────┼───────────────────────────────────────────┤
│ class sample.OuterClass$StaticNestedClass │        <init>         │          class sample.OuterClass          │
├───────────────────────────────────────────┼───────────────────────┼───────────────────────────────────────────┤
│ class sample.OuterClass$StaticNestedClass │ nonStaticMethodNested │ class sample.OuterClass$StaticNestedClass │
├───────────────────────────────────────────┼───────────────────────┼───────────────────────────────────────────┤
│ class sample.OuterClass$StaticNestedClass │  staticMethodNested   │                   null                    │
└───────────────────────────────────────────┴───────────────────────┴───────────────────────────────────────────┘
```
