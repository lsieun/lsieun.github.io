---
title: " Using GraalVM's Native Image"
sequence: "102"
---

## Intro

The `jpackage` tool lets you build native applications for specific operating systems.
The Java runtime is bundled with the application, and when the native application is executed,
it will internally use the Java runtime to execute the bytecodes.
Typically, the Java runtime contains a Just In Time (JIT) compiler
that compiles Java bytecode to native code.

> jpackage ---> Java runtime

Another option for building a native application moves the compilation step to build time.
With GraalVM's Native Image, the Java code is compiled Ahead Of Time (AOT).
This means the Java bytecode is compiled to native code
before it is executed and before it is bundled into an application.
As a result, the resulting binary no longer contains a Java runtime.

> GraalVM's Native Image ---> no Java runtime

While GraalVM provides the AOT compiler that translates Java bytecode into native code for a given platform,
there are more actions needed in order to link the program code into an executable.
Fortunately, there are open source tools available that help developers achieve this.
The GluonFX plugin (from gluonhq.com) lets developers create native images for
Linux, macOS, and Windows based on existing Java code.

> GraalVM ---> GluonFX plugin

During the installation process, make sure to select at least the following individual components:

- Choose the English Language Pack.
- C++/CLI support for v142 build tools (v 14.25 or later).
- MSVC v142 – VS 2019 C++ x64/x86 build tools (v 14.25 or later).
- Windows Universal CRT SDK.
- Windows 10 SDK (10.0.19041.0 or later).

![](/assets/images/graalvm/vs-installer-english-language-pack.png)

![](/assets/images/graalvm/vs-installer-win10-sdk--and-c-plus-plus-build-tools.png)

![](/assets/images/graalvm/vs-installer-windows-universal-crt-sdk.png)

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.openjfx</groupId>
            <artifactId>javafx-maven-plugin</artifactId>
            <version>0.0.8</version>
            <configuration>
                <mainClass>jm.data.excel.gui.fx.Main</mainClass>
            </configuration>
        </plugin>

        <plugin>
            <groupId>com.gluonhq</groupId>
            <artifactId>gluonfx-maven-plugin</artifactId>
            <version>1.0.19</version>
            <configuration>
                <mainClass>jm.data.excel.gui.fx.Main</mainClass>
                <graalvmHome>D:\software\jdk\graalvm-svm-java17-windows-gluon-22.1.0.1-Final</graalvmHome>
            </configuration>
        </plugin>
    </plugins>
</build>
```

Note that all build commands must be executed in a Visual Studio 2019 command
prompt called **x64 Native Tools Command Prompt for VS 2019**.

```text
mvn clean javafx:run
mvn gluonfx:compile
mvn gluonfx:link
mvn gluonfx:run
mvn gluonfx:nativerun
```

```text
mvn gluonfx:runagent
mvn gluonfx:build
gluonfx:nativerun
```

- [Gluon JavaFX maven nativerun rises errors when loading fxml files](https://stackoverflow.com/questions/69021262/gluon-javafx-maven-nativerun-rises-errors-when-loading-fxml-files)

## Reference

- [GraalVM](https://graalvm.org/)
- [Github: oracle/graal](https://github.com/oracle/graal)
- [Github: oracle/graal Release](https://github.com/gluonhq/graal/releases/)
- [GluonFX plugin for Maven](https://github.com/gluonhq/gluonfx-maven-plugin/)
- [Error compiling using reflectionList](https://github.com/gluonhq/gluonfx-maven-plugin/issues/36)

