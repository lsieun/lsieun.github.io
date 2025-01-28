---
title: "SimpleVerifier"
sequence: "407"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

在本章内容当中，最核心的内容就是下面两行代码。这两行代码包含了`asm-analysis.jar`当中`Analyzer`、`Frame`、`Interpreter`和`Value`最重要的四个类：

```text
   ┌── Analyzer
   │        ┌── Value                                   ┌── Interpreter
   │        │                                           │
Analyzer<BasicValue> analyzer = new Analyzer<>(new SimpleVerifier());
Frame<BasicValue>[] frames = analyzer.analyze(owner, mn);
   │        │
   │        └── Value
   └── Frame
```

在本文当中，我们将介绍`SimpleVerifier`类：

```text
┌───┬───────────────────┬─────────────┬───────┐
│ 0 │    Interpreter    │    Value    │ Range │
├───┼───────────────────┼─────────────┼───────┤
│ 1 │ BasicInterpreter  │ BasicValue  │   7   │
├───┼───────────────────┼─────────────┼───────┤
│ 2 │   BasicVerifier   │ BasicValue  │   7   │
├───┼───────────────────┼─────────────┼───────┤
│ 3 │  SimpleVerifier   │ BasicValue  │   N   │
├───┼───────────────────┼─────────────┼───────┤
│ 4 │ SourceInterpreter │ SourceValue │   N   │
└───┴───────────────────┴─────────────┴───────┘
```

在上面这个表当中，我们关注以下三点：

- 第一点，类的继承关系。`SimpleVerifier`类继承自`BasicVerifier`类，`BasicVerifier`类继承自`BasicInterpreter`类，而`BasicInterpreter`类继承自`Interpreter`抽象类。
- 第二点，类的合作关系。`SimpleVerifier`与`BasicValue`类是一起使用的。
- 第三点，类的表达能力。`SimpleVerifier`类能够使用的`BasicValue`对象有很多个。因为`SimpleVerifier`类重新实现了`newValue()`方法。每个类都有自己的表示形式。

The `SimpleVerifier` class extends the `BasicVerifier` class.
It uses **more sets** to simulate the execution of bytecode instructions:
indeed **each class is represented by its own set, representing all possible objects of this class**.

This class uses the **Java reflection API**
in order to perform verifications and computations related to the class hierarchy.
It therefore loads the classes referenced by a method into the JVM.
This default behavior can be changed by overriding the protected methods of this class.

## SimpleVerifier

理解`SimpleVerifier`类，从两个方面来把握：

- 第一点，`SimpleVerifier`类可以模拟的`Value`值有多少个？为什么关注这个问题呢？因为这些`Value`值会存储在`Frame`内，它体现了`Frame`的表达能力。
- 第二点，`SimpleVerifier`类如何实现验证（Verify）的功能？


### class info

第一个部分，`SimpleVerifier`类继承自`BasicVerifier`类。

```java
public class SimpleVerifier extends BasicVerifier {
}
```

### fields

第二个部分，`SimpleVerifier`类定义的字段有哪些。

```java
public class SimpleVerifier extends BasicVerifier {
    // 第一组字段，当前类、父类、接口
    private Type currentClass;
    private Type currentSuperClass;
    private List<Type> currentClassInterfaces;
    private boolean isInterface;

    // 第二组字段，ClassLoader
    private ClassLoader loader = getClass().getClassLoader();
}
```

第一组字段，是记录当前类的相关信息。同时，我们也要注意到`Analyzer.analyze(owner, mn)`方法只提供了当前类的名字（`owner`），提供的类相关信息太少；而`SimpleVerifier`这个类记录了当前类、父类、接口和当前类是不是接口的信息。

```text
   ┌── Analyzer
   │        ┌── Value                                   ┌── Interpreter
   │        │                                           │
Analyzer<BasicValue> analyzer = new Analyzer<>(new BasicInterpreter());
Frame<BasicValue>[] frames = analyzer.analyze(owner, mn);
   │        │                                   │
   │        └── Value                           └── 只提供了当前类的名字信息
   └── Frame
```

第二组字段，`loader`字段通过反射的方式将某个类加载进来，从而进一步判断类的继承关系。另外，`SimpleVerifier`也提供了一个`setter`方法来设置`loader`字段的值。

```java
public class SimpleVerifier extends BasicVerifier {
    public void setClassLoader(ClassLoader loader) {
        this.loader = loader;
    }    
}
```

### constructors

第三个部分，`SimpleVerifier`类定义的构造方法有哪些。

注意，前三个构造方法都不适合由子类继承，因为它会判断`getClass() != SimpleVerifier.class`是否成立；如果是子类实现，就会抛出`IllegalStateException`类型的异常。

```java
public class SimpleVerifier extends BasicVerifier {
    public SimpleVerifier() {
        this(null, null, false);
    }

    public SimpleVerifier(Type currentClass, Type currentSuperClass, boolean isInterface) {
        this(currentClass, currentSuperClass, null, isInterface);
    }

    public SimpleVerifier(Type currentClass, Type currentSuperClass, List<Type> currentClassInterfaces, boolean isInterface) {
        this(ASM9, currentClass, currentSuperClass, currentClassInterfaces, isInterface);
        if (getClass() != SimpleVerifier.class) {
            throw new IllegalStateException();
        }
    }

    protected SimpleVerifier(int api, Type currentClass, Type currentSuperClass, List<Type> currentClassInterfaces, boolean isInterface) {
        super(api);
        this.currentClass = currentClass;
        this.currentSuperClass = currentSuperClass;
        this.currentClassInterfaces = currentClassInterfaces;
        this.isInterface = isInterface;
    }
}
```

### methods

第四个部分，`SimpleVerifier`类定义的方法有哪些。

#### Interpreter.newValue方法

这个`newValue`方法原本是在`Interpreter`类里定义的。

在下面的表当中，我们可以看到：

- 在`BasicInterpreter`和`BasicVerifier`类当中，可以使用的`BasicValue`值有`7`个。
- 在`SimpleVerifier`类当中，可以使用的`BasicValue`值有`N`个。

```text
┌───┬───────────────────┬─────────────┬───────┐
│ 0 │    Interpreter    │    Value    │ Range │
├───┼───────────────────┼─────────────┼───────┤
│ 1 │ BasicInterpreter  │ BasicValue  │   7   │
├───┼───────────────────┼─────────────┼───────┤
│ 2 │   BasicVerifier   │ BasicValue  │   7   │
├───┼───────────────────┼─────────────┼───────┤
│ 3 │  SimpleVerifier   │ BasicValue  │   N   │
├───┼───────────────────┼─────────────┼───────┤
│ 4 │ SourceInterpreter │ SourceValue │   N   │
└───┴───────────────────┴─────────────┴───────┘
```

那么，为什么`SimpleVerifier`类可以使用更多的`BasicValue`值呢？原因就在于`newValue`方法。我们从两点来把握：

- 第一点，在`SimpleVerifier`类当中，`newValue`方法使用`new BasicValue(Type)`创建新的对象，因此使得`BasicValue`值多样化，每个不同的类都有一个对应的`BasicValue`值。
- 第二点，在`SimpleVerifier`类当中，`new BasicValue(Type)`的调用只在`newValue`方法中发生，不会在其它方法中调用。也就是说，创建新的`BasicValue`值，只会在`newValue`方法发生。

```java
public class SimpleVerifier extends BasicVerifier {
    @Override
    public BasicValue newValue(Type type) {
        if (type == null) {
            return BasicValue.UNINITIALIZED_VALUE;
        }

        boolean isArray = type.getSort() == Type.ARRAY;
        if (isArray) {
            switch (type.getElementType().getSort()) {
                case Type.BOOLEAN:
                case Type.CHAR:
                case Type.BYTE:
                case Type.SHORT:
                    return new BasicValue(type);
                default:
                    break;
            }
        }

        BasicValue value = super.newValue(type);
        if (BasicValue.REFERENCE_VALUE.equals(value)) {
            if (isArray) {
                value = newValue(type.getElementType());
                StringBuilder descriptor = new StringBuilder();
                for (int i = 0; i < type.getDimensions(); ++i) {
                    descriptor.append('[');
                }
                descriptor.append(value.getType().getDescriptor());
                value = new BasicValue(Type.getType(descriptor.toString()));
            } else {
                value = new BasicValue(type);
            }
        }
        return value;
    }
}
```

#### Interpreter.merge方法

其实，`newValue`和`merge`方法都是`Interpreter`类所定义的方法。

- 在`Interpreter`类当中，`merge`方法是一个抽象方法。
- 在`BasicInterpreter`类当中，为`merge`方法提供了一个简单实现。
- 在`BasicVerifier`类当中，继承了`BasicInterpreter`类的`merge`方法没有做任何改变。
- 在`SimpleVerifier`类当中，对`merge`方法的代码逻辑进行了重新编写。

在`BasicInterpreter`和`BasicVerifier`类当中，只使用7个`BasicValue`值，因此`merge`方法实现起来很简单。然而，在`SimpleVerifier`类当中，可以使用N个`BasicValue`值；也就是说，每个类型都有一个对应的`BasicValue`值，那么相应的merge操作就变得复杂起来了。

```java
public class SimpleVerifier extends BasicVerifier {
    @Override
    public BasicValue merge(BasicValue value1, BasicValue value2) {
        if (!value1.equals(value2)) {
            Type type1 = value1.getType();
            Type type2 = value2.getType();
            if (type1 != null
                    && (type1.getSort() == Type.OBJECT || type1.getSort() == Type.ARRAY)
                    && type2 != null
                    && (type2.getSort() == Type.OBJECT || type2.getSort() == Type.ARRAY)) {
                if (type1.equals(NULL_TYPE)) {
                    return value2;
                }
                if (type2.equals(NULL_TYPE)) {
                    return value1;
                }
                if (isAssignableFrom(type1, type2)) {
                    return value1;
                }
                if (isAssignableFrom(type2, type1)) {
                    return value2;
                }
                int numDimensions = 0;
                if (type1.getSort() == Type.ARRAY
                        && type2.getSort() == Type.ARRAY
                        && type1.getDimensions() == type2.getDimensions()
                        && type1.getElementType().getSort() == Type.OBJECT
                        && type2.getElementType().getSort() == Type.OBJECT) {
                    numDimensions = type1.getDimensions();
                    type1 = type1.getElementType();
                    type2 = type2.getElementType();
                }
                while (true) {
                    if (type1 == null || isInterface(type1)) {
                        return newArrayValue(Type.getObjectType("java/lang/Object"), numDimensions);
                    }
                    type1 = getSuperClass(type1);
                    if (isAssignableFrom(type1, type2)) {
                        return newArrayValue(type1, numDimensions);
                    }
                }
            }
            return BasicValue.UNINITIALIZED_VALUE;
        }
        return value1;
    }    
}
```

#### BasicVerifier方法

下面几个方法是从`BasicVerifier`继承来的方法

```java
public class SimpleVerifier extends BasicVerifier {
    @Override
    protected boolean isArrayValue(BasicValue value) {
        Type type = value.getType();
        return type != null && (type.getSort() == Type.ARRAY || type.equals(NULL_TYPE));
    }

    @Override
    protected BasicValue getElementValue(BasicValue objectArrayValue) throws AnalyzerException {
        Type arrayType = objectArrayValue.getType();
        if (arrayType != null) {
            if (arrayType.getSort() == Type.ARRAY) {
                return newValue(Type.getType(arrayType.getDescriptor().substring(1)));
            } else if (arrayType.equals(NULL_TYPE)) {
                return objectArrayValue;
            }
        }
        throw new AssertionError();
    }

    @Override
    protected boolean isSubTypeOf(BasicValue value, BasicValue expected) {
        Type expectedType = expected.getType();
        Type type = value.getType();
        switch (expectedType.getSort()) {
            case Type.INT:
            case Type.FLOAT:
            case Type.LONG:
            case Type.DOUBLE:
                return type.equals(expectedType);
            case Type.ARRAY:
            case Type.OBJECT:
                if (type.equals(NULL_TYPE)) {
                    return true;
                } else if (type.getSort() == Type.OBJECT || type.getSort() == Type.ARRAY) {
                    if (isAssignableFrom(expectedType, type)) {
                        return true;
                    } else if (getClass(expectedType).isInterface()) {
                        // The merge of class or interface types can only yield class types (because it is not
                        // possible in general to find an unambiguous common super interface, due to multiple
                        // inheritance). Because of this limitation, we need to relax the subtyping check here
                        // if 'value' is an interface.
                        return Object.class.isAssignableFrom(getClass(type));
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            default:
                throw new AssertionError();
        }
    }
}
```

#### protected方法

下面几个方法是`SimpleVerifier`自定义的`protected`方法：

- `isAssignableFrom`方法：判断两个`Type`之间是否兼容。
- `isInterface`方法：判断某个`Type`是否为接口。
- `getSuperClass`方法：获取某个`Type`的父类型。
- `getClass`方法：通过反射的方式加载某个`Type`类型，是`loader`字段发挥作用的地方。另外，`isAssignableFrom`、`isInterface`和`getSuperClass`方法都会调用`getClass`方法。

```java
public class SimpleVerifier extends BasicVerifier {
    protected boolean isAssignableFrom(Type type1, Type type2) {
        if (type1.equals(type2)) {
            return true;
        }
        if (currentClass != null && currentClass.equals(type1)) {
            if (getSuperClass(type2) == null) {
                return false;
            } else {
                if (isInterface) {
                    return type2.getSort() == Type.OBJECT || type2.getSort() == Type.ARRAY;
                }
                return isAssignableFrom(type1, getSuperClass(type2));
            }
        }
        if (currentClass != null && currentClass.equals(type2)) {
            if (isAssignableFrom(type1, currentSuperClass)) {
                return true;
            }
            if (currentClassInterfaces != null) {
                for (Type currentClassInterface : currentClassInterfaces) {
                    if (isAssignableFrom(type1, currentClassInterface)) {
                        return true;
                    }
                }
            }
            return false;
        }
        return getClass(type1).isAssignableFrom(getClass(type2));
    }

    protected boolean isInterface(Type type) {
        if (currentClass != null && currentClass.equals(type)) {
            return isInterface;
        }
        return getClass(type).isInterface();
    }

    protected Type getSuperClass(Type type) {
        if (currentClass != null && currentClass.equals(type)) {
            return currentSuperClass;
        }
        Class<?> superClass = getClass(type).getSuperclass();
        return superClass == null ? null : Type.getType(superClass);
    }

    protected Class<?> getClass(Type type) {
        try {
            if (type.getSort() == Type.ARRAY) {
                return Class.forName(type.getDescriptor().replace('/', '.'), false, loader);
            }
            return Class.forName(type.getClassName(), false, loader);
        } catch (ClassNotFoundException e) {
            throw new TypeNotPresentException(e.toString(), e);
        }
    }    
}
```

## SimpleVerifier的表达能力

### primitive type无法区分

SimpleVerifier的表达能力可以描述成这样：

- 可以区分不同的引用类型（Reference Type），例如`String`、`Object`类型
- 可以区分同一个引用类型的不同对象实例，例如"AAA"和"BBB"是`String`类型的不同对象实例
- 但是，不能够区分同一种primitive type的不同值

例如，下面的`HelloWorld`类当中，`str1`和`str2`这两个变量是`String`类型，它们分别使用不同的`BasicValue`对象来表示；相应的，`a`和`b`都是`int`类型（primitive type），它们分别是`1`和`2`两个值，但是它们都是用`BasicValue.INT_VALUE`来表示，没有办法进行区分。

```java
public class HelloWorld {
    public void test() {
        int a = 1;
        int b = 2;
        String str1 = "AAA";
        String str2 = "BBB";
    }
}
```

### 如何验证

为了验证上面的内容是否正确，我们可以使用`HelloWorldFrameTree`类查看frame当中存储的数据：看一看`int`类型的`a`和`b`能不能区分，看一个`String`类型的`str1`和`str2`能不能区分开？

第一次尝试（错误示例，不能区分）：

```text
print(owner, mn, new SimpleVerifier(), null);
```

输出结果：`a`和`b`都用`I`表示，`str1`和`str2`都用`Ljava/lang/String;`，看不出`str1`和`str2`有什么区别

```text
test:()V
000:    iconst_1                                {Lsample/HelloWorld;, ., ., ., .} | {}
001:    istore_1                                {Lsample/HelloWorld;, ., ., ., .} | {I}
002:    iconst_2                                {Lsample/HelloWorld;, I, ., ., .} | {}
003:    istore_2                                {Lsample/HelloWorld;, I, ., ., .} | {I}
004:    ldc "AAA"                               {Lsample/HelloWorld;, I, I, ., .} | {}
005:    astore_3                                {Lsample/HelloWorld;, I, I, ., .} | {Ljava/lang/String;}
006:    ldc "BBB"                               {Lsample/HelloWorld;, I, I, Ljava/lang/String;, .} | {}
007:    astore 4                                {Lsample/HelloWorld;, I, I, Ljava/lang/String;, .} | {Ljava/lang/String;}
008:    return                                  {Lsample/HelloWorld;, I, I, Ljava/lang/String;, Ljava/lang/String;} | {}
================================================================
```

第二次尝试（错误示例，不能区分）：

```text
print(owner, mn, new SimpleVerifier(), item -> item.toString() + "@" + item.hashCode());
```

输出结果：`a`和`b`都用`I@65`表示，`str1`和`str2`都用`Ljava/lang/String;@-689322901`，看不出`str1`和`str2`有什么区别

```text
test:()V
000:    iconst_1                                {Lsample/HelloWorld;@1649535039, .@0, .@0, .@0, .@0} | {}
001:    istore_1                                {Lsample/HelloWorld;@1649535039, .@0, .@0, .@0, .@0} | {I@65}
002:    iconst_2                                {Lsample/HelloWorld;@1649535039, I@65, .@0, .@0, .@0} | {}
003:    istore_2                                {Lsample/HelloWorld;@1649535039, I@65, .@0, .@0, .@0} | {I@65}
004:    ldc "AAA"                               {Lsample/HelloWorld;@1649535039, I@65, I@65, .@0, .@0} | {}
005:    astore_3                                {Lsample/HelloWorld;@1649535039, I@65, I@65, .@0, .@0} | {Ljava/lang/String;@-689322901}
006:    ldc "BBB"                               {Lsample/HelloWorld;@1649535039, I@65, I@65, Ljava/lang/String;@-689322901, .@0} | {}
007:    astore 4                                {Lsample/HelloWorld;@1649535039, I@65, I@65, Ljava/lang/String;@-689322901, .@0} | {Ljava/lang/String;@-689322901}
008:    return                                  {Lsample/HelloWorld;@1649535039, I@65, I@65, Ljava/lang/String;@-689322901, Ljava/lang/String;@-689322901} | {}
================================================================
```

那么，为什么第二次尝试是错误的呢？是因为`BasicValue.hashCode()`是经过修改的，它会进一步调用`Type.hashCode()`；而`Type.hashCode()`会根据descritor来计算hash值，只要descriptor相同，那么hash值就相同。

第三次尝试（正确示例，能够区分）：借助于`System.identityHashCode()`方法

```text
print(owner, mn, new SimpleVerifier(), item -> item.toString() + "@" + System.identityHashCode(item));
```

输出结果：`a`和`b`都用`I@1267032364`表示，`str1`用`Ljava/lang/String;@661672156`表示，`str2`都用`Ljava/lang/String;@96639997`，可以看出`str1`和`str2`是不同的对象。

```text
test:()V
000:    iconst_1                                {Lsample/HelloWorld;@1147985808, .@2040495657, .@2040495657, .@2040495657, .@2040495657} | {}
001:    istore_1                                {Lsample/HelloWorld;@1147985808, .@2040495657, .@2040495657, .@2040495657, .@2040495657} | {I@1267032364}
002:    iconst_2                                {Lsample/HelloWorld;@1147985808, I@1267032364, .@2040495657, .@2040495657, .@2040495657} | {}
003:    istore_2                                {Lsample/HelloWorld;@1147985808, I@1267032364, .@2040495657, .@2040495657, .@2040495657} | {I@1267032364}
004:    ldc "AAA"                               {Lsample/HelloWorld;@1147985808, I@1267032364, I@1267032364, .@2040495657, .@2040495657} | {}
005:    astore_3                                {Lsample/HelloWorld;@1147985808, I@1267032364, I@1267032364, .@2040495657, .@2040495657} | {Ljava/lang/String;@661672156}
006:    ldc "BBB"                               {Lsample/HelloWorld;@1147985808, I@1267032364, I@1267032364, Ljava/lang/String;@661672156, .@2040495657} | {}
007:    astore 4                                {Lsample/HelloWorld;@1147985808, I@1267032364, I@1267032364, Ljava/lang/String;@661672156, .@2040495657} | {Ljava/lang/String;@96639997}
008:    return                                  {Lsample/HelloWorld;@1147985808, I@1267032364, I@1267032364, Ljava/lang/String;@661672156, Ljava/lang/String;@96639997} | {}
================================================================
```

那么，我们为什么要将三次尝试都记录下来呢？因为大家在自己尝试的过程当中，可能也会想去确定local variable和operand stack上的某两个位置的值到底是不是同一个元素呢？如果说具体的`Value`值修改过`hashCode()`方法，那么可能就检测不出来。**为了正确的检测两个位置的值是不是同一个对象，我们可以借助于`System.identityHashCode()`方法**。

## 总结

本文内容总结如下：

- 第一点，介绍`SimpleVerifier`类的各个部分。
- 第二点，理解`SimpleVerifier`类的表达能力。
