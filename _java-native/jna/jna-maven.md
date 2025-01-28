---
title: "JNA Maven"
sequence: "102"
---

```xml
<dependency>
    <groupId>net.java.dev.jna</groupId>
    <artifactId>jna-platform</artifactId>
    <version>5.12.1</version>
</dependency>
```

The latest version of [jna-platform](https://search.maven.org/search?q=g:net.java.dev.jna%20a:jna-platform)
can be downloaded from Maven Central.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>lsieun</groupId>
    <artifactId>learn-java-jna</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <java.version>8</java.version>
        <maven.compiler.source>${java.version}</maven.compiler.source>
        <maven.compiler.target>${java.version}</maven.compiler.target>
        <jna.version>5.12.1</jna.version>
        <junit.version>5.8.2</junit.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>net.java.dev.jna</groupId>
            <artifactId>jna-platform</artifactId>
            <version>${jna.version}</version>
        </dependency>

        <!-- JUnit -->
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter-api</artifactId>
            <version>${junit.version}</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter-engine</artifactId>
            <version>${junit.version}</version>
            <scope>test</scope>
        </dependency>
    </dependencies>

</project>
```

## Using JNA

Using JNA is a two-step process:

- First, we create a Java interface that extends JNA's `com.sun.jna.Library` interface
  to describe the methods and types used when calling the target native code.
- Next, we pass this interface to JNA which returns a concrete implementation of this interface
  that we use to invoke native methods

## Example

```java
package lsieun.jna;

import com.sun.jna.Library;

public interface CMath extends Library {
    double cosh(double value);
}
```

```java
import com.sun.jna.Native;
import com.sun.jna.Platform;
import lsieun.jna.CMath;

public class JNARun {
    public static void main(String[] args) {
        String libName = Platform.isWindows() ? "msvcrt" : "c";
        CMath instance = Native.load(libName, CMath.class);
        double result = instance.cosh(0);
        System.out.println(result);
    }
}
```

## 解释

```text
CMath instance = Native.load(libName, CMath.class);
```

The fascinating part here is the call to the `Native.load()` method.
It takes two arguments: the dynamic library name and a Java interface describing the methods that we'll use.
It returns a concrete implementation of this interface, allowing us to call any of its methods.

```text
String libName = Platform.isWindows() ? "msvcrt" : "c";
```

Dynamic library names are usually system-dependent, and C standard library is no exception:
`libc.so` in most Linux-based systems, but `msvcrt.dll` in Windows.
This is why we've used the `Platform` helper class, included in **JNA**,
to check which platform we're running in and select the proper library name.

Notice that we don't have to add the `.so` or `.dll` extension, as they're implied.
Also, for Linux-based systems, we don't need to specify the “`lib`” prefix that is standard for shared libraries.

## Common Practice

Since dynamic libraries behave like Singletons from a Java perspective,
a common practice is to declare an `INSTANCE` field as part of the interface declaration:

```java
import com.sun.jna.Library;
import com.sun.jna.Native;
import com.sun.jna.Platform;

public interface CMath extends Library {
    CMath INSTANCE = Native.load(Platform.isWindows() ? "msvcrt" : "c", CMath.class);

    double cosh(double value);
}
```

```java
import lsieun.jna.CMath;

public class JNARun {
    public static void main(String[] args) {
        CMath instance = CMath.INSTANCE;
        double result = instance.cosh(0);
        System.out.println(result);
    }
}
```
