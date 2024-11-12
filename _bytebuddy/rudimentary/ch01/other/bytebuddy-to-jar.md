---
title: "To Jar"
sequence: "104"
---

## DynamicType.toJar

### 第一个版本

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Ownership;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodCall;

import java.io.File;
import java.io.PrintStream;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .name("sample.HelloWorld");

        builder = builder.defineMethod("main", void.class, Visibility.PUBLIC, Ownership.STATIC)
                .withParameter(String[].class, "args")
                .intercept(
                        MethodCall.invoke(
                                        PrintStream.class.getDeclaredMethod("println", String.class)
                                )
                                .onField(
                                        System.class.getDeclaredField("out")
                                )
                                .with("Hello World")
                );

        DynamicType.Unloaded<?> unloadedType = builder.make();

        String filepath = FileUtils.getFilePath("my.jar");
        System.out.println(filepath);
        File jarFile = new File(filepath);
        unloadedType.toJar(jarFile);
    }
}
```


```text
> java -cp my.jar sample.HelloWorld
Hello World
```

### 第二个版本

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Ownership;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodCall;

import java.io.File;
import java.io.PrintStream;
import java.util.jar.Attributes;
import java.util.jar.Manifest;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .name("sample.HelloWorld");

        builder = builder.defineMethod("main", void.class, Visibility.PUBLIC, Ownership.STATIC)
                .withParameter(String[].class, "args")
                .intercept(
                        MethodCall.invoke(
                                        PrintStream.class.getDeclaredMethod("println", String.class)
                                )
                                .onField(
                                        System.class.getDeclaredField("out")
                                )
                                .with("Hello World")
                );

        DynamicType.Unloaded<?> unloadedType = builder.make();

        String filepath = FileUtils.getFilePath("../my.jar");
        System.out.println(filepath);
        File jarFile = new File(filepath);

        Manifest manifest = new Manifest();
        Attributes mainAttributes = manifest.getMainAttributes();
        mainAttributes.put(Attributes.Name.MAIN_CLASS, "sample.HelloWorld");
        mainAttributes.put(Attributes.Name.MANIFEST_VERSION, "1.2.3");

        unloadedType.toJar(jarFile, manifest);
    }
}
```

```text
$ java -jar my.jar
Hello World
```

## DynamicType.inject

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Ownership;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodCall;

import java.io.File;
import java.io.PrintStream;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .name("sample.HelloWorld2");

        builder = builder.defineMethod("main", void.class, Visibility.PUBLIC, Ownership.STATIC)
                .withParameter(String[].class, "args")
                .intercept(
                        MethodCall.invoke(
                                        PrintStream.class.getDeclaredMethod("println", String.class)
                                )
                                .onField(
                                        System.class.getDeclaredField("out")
                                )
                                .with("Hello World")
                );

        DynamicType.Unloaded<?> unloadedType = builder.make();

        String filepath = FileUtils.getFilePath("../my.jar");
        System.out.println(filepath);
        File jarFile = new File(filepath);

        unloadedType.inject(jarFile);
    }
}
```
