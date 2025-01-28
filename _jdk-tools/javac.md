---
title: "javac"
sequence: "103"
---

`javac` is the **Java source code compiler** - it produces **bytecode** (in the form of `.class` files) from `.java` **source files**.

## 1. Basic usage

```bash
javac some/package/MyClass.java
```

过去，我经常使用`javac Hello.java`；今天突然遇到`javac *.java`，原来也可以这么用啊。

```bash
javac *.java
```

- 优点：不用指定特定的 Java 文件名
- 缺点：这些 `.java` 文件必须位于同一个目录下

## 2. How to

- **How to** compile a single source file:

```bash
javac MySourceFile.java
```

- **How to** compile multiple source files by name

```bash
javac FileOne.java FileTwo.java FileThree.java
```

- **How to** compile multiple source files using **wildcards** - if you have all of the source files for a single program in the same directory you can compile them all with a single command without having to specify all of their names

```bash
javac *.java
```

- **How to** compile using compiler flags

```bash
javac -Xlint:unchecked SourceFile.java
```

- How to compile all java files under a given directory recursively

If you need to try something out for a larger project and don't have any proper build tools nearby, you can always use a small trick that `javac` offers: the **classnames** to compile can be specified in a file. You simply have to pass the name of the file to `javac` with the `@` prefix.

If you can create a list of all the `*.java` files in your project, it's easy:

```bash
# Linux / MacOS
$ find -name "*.java" > sources.txt
$ javac @sources.txt
## 添加classpath的情况
$ javac -classpath "${CLASSPATH}" @java_sources.txt
```

```cmd
:: Windows
> dir /s /b *.java > sources.txt
> javac @sources.txt
```

**The advantage** is that is is a quick and easy solution.

**The drawback** is that you have to regenerate the `sources.txt` file each time you create a new source or rename an existing one file which is an easy to forget (thus error-prone) and tiresome task.

## 3. Common switches

### 3.1. classpath and output dir

- `-classpath`: Supplies classes we need for compilation.
- `-d some/dir`: Tells `javac` where to output class files.

### 3.2. debug

- `-g`: Generate all debugging info
- `-g:none`: Generate no debugging info
- `-g:{lines,vars,source}`: Generate only some debugging info

查看Byte Code的时候，我喜欢使用`-g:vars`参数：

```bash
javac -g:vars Main.java
javac -g:vars,lines Main.java
```

- `-profile <profile>`: Control the profile that javac will use when compiling the application.

### 3.3. source and target

source and target

- `-source <version>`: Control the Java version that javac will accept.
- `-target <version>`: Control the version of class files that javac will output.

`javac` has traditionally accepted switches (`-source` and `-target`) that control **the version of the source language** that the compiler would accept, and **the version of the class file format** that was used for the outputted class files.

From JDK 8 onward, javac will only accept **source** and **target** options from **three versions back**. That is, only the formats from JDK 5, 6, 7, and 8 will be accepted by `javac`. This does not affect the **java interpreter**—any class file from any Java version will still work on the JVM shipped with Java 8.

### 3.4. parameters

- `-parameters`: Stores formal parameter names of constructors and methods in the generated class file so that the method `java.lang.reflect.Executable.getParameters` from the Reflection API can retrieve them.

```bash
javac -parameters Main.java
```

在`.class`文件中，为了生成Method的`MethodParameters`属性，需要满足这两个条件：

- （1）在使用javac时，使用`-parameters`参数
- （2）方法本身，至少要有一个参数；如果方法没有参数，也不会生成`MethodParameters`属性

### 3.5. Xlint

- `-Xlint`: Enable recommended warnings

```bash
javac -Xlint:all HelloWorld.java
```

**lint**, or a **linter**, is a tool that analyzes source code to flag programming errors, bugs, stylistic errors, and suspicious constructs. The term originates from a Unix utility that examined C language source code.

History:

- Stephen C. Johnson, a computer scientist at Bell Labs, came up with **lint** in 1978 while debugging the yacc grammar he was writing for C and dealing with portability issues stemming from porting Unix to a 32-bit machine. The term "lint" was derived from the name of the undesirable bits of **fiber and fluff** found in sheep's wool. In 1979, lint was used outside of Bell Labs for the first time in the seventh version (V7) of the Unix operating system. 最初lint的出现
- Over the years, different versions of lint were developed for many C and C++ compilers and while modern-day compilers have lint-like functions, lint-like tools have also advanced their capabilities. 不同版本的出现

The analysis performed by lint-like tools can also be performed by an **optimizing compiler**, which aims to generate faster code. In his original 1978 paper, Johnson addressed this issue, concluding that "**the general notion of having two programs is a good one**" because they concentrated on different things, thereby allowing the programmer to "concentrate at one stage of the programming process solely on the algorithms, data structures, and correctness of the program, and then later retrofit, with the aid of lint, the desirable properties of universality and portability". 原lint的作者Johnson认为“写成两个程序比较好，一次只做好一件事”

Even though modern compilers have evolved to include **many of lint's historical functions**, lint-like tools have also evolved to detect **an even wider variety of suspicious constructs**. These include "warnings about syntax errors, uses of undeclared variables, calls to deprecated functions, spacing and formatting conventions, misuse of scope, implicit fallthrough in switch statements, missing license headers, and...dangerous language features". 功能包含的越来越多

## 4. javac restriction

When `javac` is compiling code it doesn't link against `rt.jar` by default. Instead it uses special symbol file `JAVA_HOME/lib/ct.sym` with class stubs. Surprisingly this file contains many but not all of internal `sun` classes. The option `-XDignore.symbol.file` is to ignore the **symbol file** so that it will link against `rt.jar`.

And the answer to my question is: `javac -XDignore.symbol.file`

### 4.1. Ant Solution

```xml
<target name="compile" depends="init" description="Compiles the source code">
    <javac srcdir="${src}" destdir="${build.class}">
        <compilerarg value="-XDignore.symbol.file"/>
    </javac>
</target>
```

### 4.2. Maven Solution

If you're using Maven, note that the compiler plugin will silently drop any `-XD` flags, unless you also specify `<fork>true</fork>`:

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.8.1</version>
            <configuration>
                <source>1.8</source>
                <target>1.8</target>
                <compilerArgs>
                    <arg>-g:none</arg>
                    <arg>-parameters</arg>
                    <arg>-XDignore.symbol.file</arg>
                </compilerArgs>
                <fork>true</fork>
            </configuration>
```

## Reference

- [Compile-time optimizations in Java](https://fekir.info/post/compile-time-optimizations-in-java/)
