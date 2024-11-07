---
title: "JavaFX Intro"
sequence: "101"
---

## JavaFX Runtime Library

All JavaFX classes are packaged in a Java Archive (JAR) file named `jfxrt.jar`.
The JAR file is located in the `jre\lib\ext` directory under the Java home directory.

![](/assets/images/java/fx/jfx-rt-jar.png)

If you compile and run JavaFX programs on the command line,
you do not need to worry about setting the JavaFX runtime JAR file in the `CLASSPATH`.
Java 8 compiler (the `javac` command) and launcher (the `java` command)
automatically include the JavaFX runtime JAR file in the `CLASSPATH`.

## JavaFX Source Code

Oracle provides the JavaFX source code.
The Java 8 installation copies the source in the Java home directory.
The file name is `javafx-src.zip`.
Unzip the file to a directory and use your favorite Java editor to open the source code.

![](/assets/images/java/fx/java-fx-src-zip.png)
