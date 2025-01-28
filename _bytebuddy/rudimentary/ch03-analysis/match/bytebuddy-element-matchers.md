---
title: "ElementMatchers"
sequence: "103"
---

`net.bytebuddy.matcher.ElementMatchers`

```text
                                                       ┌─── named()
                                                       │
                                                       ├─── namedIgnoreCase()
                                                       │
                                                       ├─── nameStartsWith()
                                                       │
                                                       ├─── nameStartsWithIgnoreCase()
                                                       │
                                                       ├─── nameEndsWith()
                                   ┌─── name ──────────┤
                                   │                   ├─── nameEndsWithIgnoreCase()
                                   │                   │
                                   │                   ├─── nameContains()
                                   │                   │
                                   │                   ├─── nameContainsIgnoreCase()
                                   │                   │
                                   │                   ├─── nameMatches(regex)
                                   │                   │
                                   │                   └─── namedOneOf()
                                   │
                                   │                   ┌─── isPublic()
                                   │                   │
                   ┌─── common ────┤                   ├─── isProtected()
                   │               │                   │
                   │               │                   ├─── isPackagePrivate()
                   │               │                   │
                   │               │                   ├─── isPrivate()
                   │               ├─── access flag ───┤
                   │               │                   ├─── isStatic()
                   │               │                   │
                   │               │                   ├─── isFinal()
                   │               │                   │
                   │               │                   ├─── isVarArgs()
                   │               │                   │
                   │               │                   └─── ...
                   │               │
                   │               └─── annotation ────┼─── isAnnotatedWith()
                   │
                   │                                   ┌─── isInterface()
                   │                                   │
                   │               ┌─── class ─────────┼─── isAnnotation()
                   │               │                   │
                   │               │                   └─── isDeclaredBy(Class<?> type)
                   │               │
                   │               │                   ┌─── isConstructor()
                   │               ├─── constructor ───┤
                   │               │                   └─── isDefaultConstructor()
                   │               │
                   │               ├─── field ─────────┼─── fieldType()
                   │               │
                   │               │                                     ┌─── isMethod()
ElementMatchers ───┼─── element ───┤                                     │
                   │               │                   ┌─── basic ───────┼─── isGetter()
                   │               │                   │                 │
                   │               │                   │                 └─── isSetter()
                   │               │                   │
                   │               │                   │                 ┌─── takesNoArguments()
                   │               │                   │                 │
                   │               │                   │                 ├─── takesArguments(length)
                   │               │                   │                 │
                   │               │                   │                 ├─── takesArgument(index,type)
                   │               │                   │                 │
                   │               │                   ├─── parameter ───┼─── takesArgument(type array)
                   │               └─── method ────────┤                 │
                   │                                   │                 ├─── takesGenericArgument()
                   │                                   │                 │
                   │                                   │                 ├─── hasParameters()
                   │                                   │                 │
                   │                                   │                 └─── isOverriddenFrom()
                   │                                   │
                   │                                   │                 ┌─── returns()
                   │                                   ├─── return ──────┤
                   │                                   │                 └─── returnsGeneric()
                   │                                   │
                   │                                   └─── throws ──────┼─── canThrow()
                   │
                   │               ┌─── and
                   │               │
                   │               ├─── or
                   │               │
                   │               ├─── not
                   └─── logic ─────┤
                                   ├─── any()
                                   │
                                   ├─── anyOf()
                                   │
                                   └─── none()
```

```java
package sample;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target({
        ElementType.TYPE,
        ElementType.CONSTRUCTOR,
        ElementType.FIELD,
        ElementType.METHOD
})
public @interface MyTag {
}
```

```java
package sample;

public class HelloWorld {
    private String name;
    private int age;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }
}
```

## Class

- `ElementMatchers.isDeclaredBy()`
- `ElementMatchers.isOverridenFrom()`

```java
package sample;

public class HelloWorld {
    public void test() {
        System.out.println("test");
    }

    @Override
    public String toString() {
        return "Hello World";
    }
}
```

```java

import net.bytebuddy.ByteBuddy;
import net.bytebuddy.asm.MemberAttributeExtension;
import net.bytebuddy.description.annotation.AnnotationDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.matcher.ElementMatchers;

import java.io.File;

public class HelloWorldRedefine {
    public static void main(String[] args) {
        ByteBuddy byteBuddy = new ByteBuddy();

        AnnotationDescription myAnnotation = AnnotationDescription.Builder.ofType(MyTag.class).build();

        DynamicType.Builder<?> builder = byteBuddy.redefine(HelloWorld.class)
                .visit(
                        new MemberAttributeExtension.ForMethod()
                                .annotateMethod(myAnnotation)
                                .on(
                                        ElementMatchers.isDeclaredBy(HelloWorld.class).and(
                                                ElementMatchers.not(
                                                        ElementMatchers.isOverriddenFrom(Object.class)
                                                )
                                        )
                                )
                );

        DynamicType.Unloaded<?> unloadedType = builder.make();

        File dirFile = FileUtils.getOutputDirectory();
        unloadedType.saveIn(dirFile);
    }
}
```

## Field

```java

import net.bytebuddy.ByteBuddy;
import net.bytebuddy.asm.MemberAttributeExtension;
import net.bytebuddy.description.annotation.AnnotationDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.matcher.ElementMatchers;

import java.io.File;

public class HelloWorldRedefine {
    public static void main(String[] args) {
        ByteBuddy byteBuddy = new ByteBuddy();

        AnnotationDescription myAnnotation = AnnotationDescription.Builder.ofType(MyTag.class).build();

        DynamicType.Builder<?> builder = byteBuddy.redefine(HelloWorld.class)
                .visit(
                        new MemberAttributeExtension.ForField()
                                .annotate(myAnnotation)
                                .on(ElementMatchers.isFinal())
                );

        DynamicType.Unloaded<?> unloadedType = builder.make();

        File dirFile = FileUtils.getOutputDirectory();
        unloadedType.saveIn(dirFile);
    }
}
```

### field type

```java

import net.bytebuddy.ByteBuddy;
import net.bytebuddy.asm.MemberAttributeExtension;
import net.bytebuddy.description.annotation.AnnotationDescription;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.matcher.ElementMatchers;

import java.io.File;

public class HelloWorldRedefine {
    public static void main(String[] args) {
        ByteBuddy byteBuddy = new ByteBuddy();

        AnnotationDescription myAnnotation = AnnotationDescription.Builder.ofType(MyTag.class).build();

        DynamicType.Builder<?> builder = byteBuddy.redefine(HelloWorld.class)
                .visit(
                        new MemberAttributeExtension.ForField()
                                .annotate(myAnnotation)
                                .on(
                                        ElementMatchers.fieldType(
                                                ElementMatchers.is(
                                                        TypeDescription.ForLoadedType.of(int.class)
                                                )
                                        )
                                )
                );

        DynamicType.Unloaded<?> unloadedType = builder.make();

        File dirFile = FileUtils.getOutputDirectory();
        unloadedType.saveIn(dirFile);
    }
}
```

上面的例子，我感觉，`ElementMatchers.is` 是无用的：

```text
ElementMatchers.fieldType(
        TypeDescription.ForLoadedType.of(int.class)
)
```

## Getter and Setter

### isSetter

```java

import net.bytebuddy.ByteBuddy;
import net.bytebuddy.asm.MemberAttributeExtension;
import net.bytebuddy.description.annotation.AnnotationDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.matcher.ElementMatchers;

import java.io.File;

public class HelloWorldRedefine {
    public static void main(String[] args) {
        ByteBuddy byteBuddy = new ByteBuddy();

        AnnotationDescription myAnnotation = AnnotationDescription.Builder.ofType(MyTag.class).build();

        DynamicType.Builder<?> builder = byteBuddy.redefine(HelloWorld.class)
                .visit(
                        new MemberAttributeExtension.ForMethod()
                                .annotateMethod(myAnnotation)
                                .on(ElementMatchers.isSetter("name"))
                );

        DynamicType.Unloaded<?> unloadedType = builder.make();

        File dirFile = FileUtils.getOutputDirectory();
        unloadedType.saveIn(dirFile);
    }
}
```

### isGetter

```java

import net.bytebuddy.ByteBuddy;
import net.bytebuddy.asm.MemberAttributeExtension;
import net.bytebuddy.description.annotation.AnnotationDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.matcher.ElementMatchers;

import java.io.File;

public class HelloWorldRedefine {
    public static void main(String[] args) {
        ByteBuddy byteBuddy = new ByteBuddy();

        AnnotationDescription myAnnotation = AnnotationDescription.Builder.ofType(MyTag.class).build();

        DynamicType.Builder<?> builder = byteBuddy.redefine(HelloWorld.class)
                .visit(
                        new MemberAttributeExtension.ForMethod()
                                .annotateMethod(myAnnotation)
                                .on(ElementMatchers.isGetter("name"))
                );

        DynamicType.Unloaded<?> unloadedType = builder.make();

        File dirFile = FileUtils.getOutputDirectory();
        unloadedType.saveIn(dirFile);
    }
}
```

## Constructor

### isConstructor

```java

import net.bytebuddy.ByteBuddy;
import net.bytebuddy.asm.MemberAttributeExtension;
import net.bytebuddy.description.annotation.AnnotationDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.matcher.ElementMatchers;

import java.io.File;

public class HelloWorldRedefine {
    public static void main(String[] args) {
        ByteBuddy byteBuddy = new ByteBuddy();

        AnnotationDescription myAnnotation = AnnotationDescription.Builder.ofType(MyTag.class).build();

        DynamicType.Builder<?> builder = byteBuddy.redefine(HelloWorld.class)
                .visit(
                        new MemberAttributeExtension.ForMethod()
                                .annotateMethod(myAnnotation)
                                .on(ElementMatchers.isConstructor())
                );

        DynamicType.Unloaded<?> unloadedType = builder.make();

        File dirFile = FileUtils.getOutputDirectory();
        unloadedType.saveIn(dirFile);
    }
}
```

### isDefaultConstructor

```java

import net.bytebuddy.ByteBuddy;
import net.bytebuddy.asm.MemberAttributeExtension;
import net.bytebuddy.description.annotation.AnnotationDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.matcher.ElementMatchers;

import java.io.File;

public class HelloWorldRedefine {
    public static void main(String[] args) {
        ByteBuddy byteBuddy = new ByteBuddy();

        AnnotationDescription myAnnotation = AnnotationDescription.Builder.ofType(MyTag.class).build();

        DynamicType.Builder<?> builder = byteBuddy.redefine(HelloWorld.class)
                .visit(
                        new MemberAttributeExtension.ForMethod()
                                .annotateMethod(myAnnotation)
                                .on(ElementMatchers.isDefaultConstructor())
                );

        DynamicType.Unloaded<?> unloadedType = builder.make();

        File dirFile = FileUtils.getOutputDirectory();
        unloadedType.saveIn(dirFile);
    }
}
```

## Access Flag

- `ElementMatchers.isFinal()`

## Method

### parameter

- `isVarArgs()`

#### takesArgument

```java
package sample;

public class HelloWorld {
    public void first(int a, float b, long c, double d) {
        //
    }

    public void second(int a, float b, long c, Double d) {
        //
    }

    public void third(int a, float b, long c, @Deprecated double d) {
        //
    }

    public void target(int a, float b, long c, @Deprecated Double d) {
        //
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.asm.MemberAttributeExtension;
import net.bytebuddy.description.annotation.AnnotationDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldTransform {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";
        Class<?> clazz = ClassUtils.loadClass(className);

        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.redefine(clazz);

        AnnotationDescription myAnnotation = AnnotationDescription.Builder.ofType(MyTag.class).build();

        builder = builder.visit(
                new MemberAttributeExtension.ForMethod()
                        .annotateMethod(myAnnotation)
                        .on(
                                ElementMatchers.isMethod().and(
                                        ElementMatchers.takesArgument(0, int.class)
                                ).and(
                                        ElementMatchers.takesArgument(1, float.class)
                                ).and(
                                        ElementMatchers.takesArgument(2, long.class)
                                ).and(
                                        ElementMatchers.takesArgument(3, Double.class)
                                )
                        )
        );

        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        FileUtils.save(unloadedType);
    }
}
```

#### takesGenericArgument

```java
package sample;

public class HelloWorld<A, B> {
    public void test(int i) {
        //
    }

    public void test(int i, A a) {
        //
    }
}
```

```java

import net.bytebuddy.ByteBuddy;
import net.bytebuddy.asm.MemberAttributeExtension;
import net.bytebuddy.description.annotation.AnnotationDescription;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.matcher.ElementMatchers;

import java.io.File;

public class HelloWorldRedefine {
    public static void main(String[] args) {
        ByteBuddy byteBuddy = new ByteBuddy();

        AnnotationDescription myAnnotation = AnnotationDescription.Builder.ofType(MyTag.class).build();
        TypeDescription.Generic A_type = TypeDescription.Generic.Builder.typeVariable("A").build();

        DynamicType.Builder<?> builder = byteBuddy.redefine(HelloWorld.class)
                .visit(
                        new MemberAttributeExtension.ForMethod()
                                .annotateMethod(myAnnotation)
                                .on(
                                        ElementMatchers.takesGenericArgument(1, A_type)
                                )
                );

        DynamicType.Unloaded<?> unloadedType = builder.make();

        File dirFile = FileUtils.getOutputDirectory();
        unloadedType.saveIn(dirFile);
    }
}
```

#### hasParameters

```java
package sample;

public class HelloWorld {
    public void first(int a, float b, long c, double d) {
        //
    }

    public void second(int a, float b, long c, Double d) {
        //
    }

    public void third(int a, float b, long c, @Deprecated double d) {
        //
    }

    public void target(int a, float b, long c, @Deprecated Double d) {
        //
    }
}
```

```java

import net.bytebuddy.ByteBuddy;
import net.bytebuddy.asm.MemberAttributeExtension;
import net.bytebuddy.description.annotation.AnnotationDescription;
import net.bytebuddy.description.method.ParameterDescription;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.matcher.ElementMatcher;
import net.bytebuddy.matcher.ElementMatchers;

import java.io.File;

public class HelloWorldRedefine {
    public static void main(String[] args) {
        ByteBuddy byteBuddy = new ByteBuddy();

        AnnotationDescription myAnnotation = AnnotationDescription.Builder.ofType(MyTag.class).build();

        ElementMatcher<Iterable<? extends ParameterDescription>> paramMatcher =
                (paramDescriptionList) -> {
                    for (ParameterDescription param : paramDescriptionList) {
                        int deprecatedCount = param.getDeclaredAnnotations().filter(
                                ElementMatchers.annotationType(Deprecated.class)
                        ).size();
                        if (deprecatedCount > 0 && param.getType().equals(
                                TypeDescription.ForLoadedType.of(Double.class)
                        )) {
                            return true;
                        }
                    }
                    return false;
                };

        DynamicType.Builder<?> builder = byteBuddy.redefine(HelloWorld.class)
                .visit(
                        new MemberAttributeExtension.ForMethod()
                                .annotateMethod(myAnnotation)
                                .on(
                                        ElementMatchers.hasParameters(paramMatcher)
                                )
                );

        DynamicType.Unloaded<?> unloadedType = builder.make();

        File dirFile = FileUtils.getOutputDirectory();
        unloadedType.saveIn(dirFile);
    }
}
```



### return

```text
ElementMatchers.returns(int.class)
```

### throws

```text
ElementMatchers.canThrow(FileNotFoundException.class)
```

## Annotation

两者要进行对比：

- `ElementMatchers.isAnnotatedWith`: `<T extends AnnotationDescription> ElementMatcher.Junction<T>`
- `ElementMatchers.annotationType`: `<T extends AnnotationSource> ElementMatcher.Junction<T>`

- `AnnotationSource`: where annotation comes from, class, method, field
- `AnnotationDescription`: annotation itself

### isAnnotatedWith

```java

import net.bytebuddy.ByteBuddy;
import net.bytebuddy.asm.MemberAttributeExtension;
import net.bytebuddy.description.annotation.AnnotationDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.matcher.ElementMatchers;

import java.io.File;

public class HelloWorldRedefine {
    public static void main(String[] args) {
        ByteBuddy byteBuddy = new ByteBuddy();

        AnnotationDescription myAnnotation = AnnotationDescription.Builder.ofType(MyTag.class).build();

        DynamicType.Builder<?> builder = byteBuddy.redefine(HelloWorld.class)
                .visit(
                        new MemberAttributeExtension.ForMethod()
                                .annotateMethod(myAnnotation)
                                .on(ElementMatchers.isAnnotatedWith(Deprecated.class))
                );

        DynamicType.Unloaded<?> unloadedType = builder.make();

        File dirFile = FileUtils.getOutputDirectory();
        unloadedType.saveIn(dirFile);
    }
}
```

### annotationType

```text
for (ParameterDescription param : paramDescriptionList) {
    int deprecatedCount = param.getDeclaredAnnotations().filter(
            ElementMatchers.annotationType(Deprecated.class)
    ).size();
    if (deprecatedCount > 0 && param.getType().equals(
            TypeDescription.ForLoadedType.of(Double.class)
    )) {
        return true;
    }
}
```

## Logic

and, or, not

```text
ElementMatchers.isFinal().and(ElementMatchers.isMethod()
```

```java

import net.bytebuddy.ByteBuddy;
import net.bytebuddy.asm.MemberAttributeExtension;
import net.bytebuddy.description.annotation.AnnotationDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.matcher.ElementMatchers;

import java.io.File;

public class HelloWorldRedefine {
    public static void main(String[] args) {
        ByteBuddy byteBuddy = new ByteBuddy();

        AnnotationDescription myAnnotation = AnnotationDescription.Builder.ofType(MyTag.class).build();

        DynamicType.Builder<?> builder = byteBuddy.redefine(HelloWorld.class)
                .visit(
                        new MemberAttributeExtension.ForMethod()
                                .annotateMethod(myAnnotation)
                                .on(
                                        ElementMatchers.isFinal()
                                                .and(ElementMatchers.isMethod())
                                )
                );

        DynamicType.Unloaded<?> unloadedType = builder.make();

        File dirFile = FileUtils.getOutputDirectory();
        unloadedType.saveIn(dirFile);
    }
}
```

## Generic

- `ElementMatchers.genericFieldType`

```java
package sample;

public class HelloWorld<T> {
    private String name;
    private int age;
    private T val;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }
}
```

### genericFieldType

```java

import net.bytebuddy.ByteBuddy;
import net.bytebuddy.asm.MemberAttributeExtension;
import net.bytebuddy.description.annotation.AnnotationDescription;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.matcher.ElementMatchers;

import java.io.File;

public class HelloWorldRedefine {
    public static void main(String[] args) {
        ByteBuddy byteBuddy = new ByteBuddy();

        AnnotationDescription myAnnotation = AnnotationDescription.Builder.ofType(MyTag.class).build();

        DynamicType.Builder<?> builder = byteBuddy.redefine(HelloWorld.class)
                .visit(
                        new MemberAttributeExtension.ForField()
                                .annotate(myAnnotation)
                                .on(
                                        ElementMatchers.genericFieldType(
                                                TypeDescription.Generic.Builder
                                                        .typeVariable("T").build()
                                        )
                                )
                );

        DynamicType.Unloaded<?> unloadedType = builder.make();

        File dirFile = FileUtils.getOutputDirectory();
        unloadedType.saveIn(dirFile);
    }
}
```

### erasure

```java
package sample;

public class HelloWorld<T extends Long> {
    private String name;
    private int age;
    private T val;
}
```

```java

import net.bytebuddy.ByteBuddy;
import net.bytebuddy.asm.MemberAttributeExtension;
import net.bytebuddy.description.annotation.AnnotationDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.matcher.ElementMatchers;

import java.io.File;

public class HelloWorldRedefine {
    public static void main(String[] args) {
        ByteBuddy byteBuddy = new ByteBuddy();

        AnnotationDescription myAnnotation = AnnotationDescription.Builder.ofType(MyTag.class).build();

        DynamicType.Builder<?> builder = byteBuddy.redefine(HelloWorld.class)
                .visit(
                        new MemberAttributeExtension.ForField()
                                .annotate(myAnnotation)
                                .on(
                                        ElementMatchers.genericFieldType(
                                                ElementMatchers.erasure(Long.class)
                                        )
                                )
                );

        DynamicType.Unloaded<?> unloadedType = builder.make();

        File dirFile = FileUtils.getOutputDirectory();
        unloadedType.saveIn(dirFile);
    }
}
```

不知道有没有包含如下内容：

```text
ElementMatchers.isConstructor()
        .and(ElementMatchers.takesArgument(0, int.class))
        .and(ElementMatchers.takesArgument(1, String.class))
        .and(ElementMatchers.takesArgument(2, String.class))
        .and(ElementMatchers.takesArgument(3, String.class))
```

