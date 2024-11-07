---
title: "Jar File"
sequence: "108"
---


## Working with the JAR File Format

JAR (**J**ava **Ar**chive) is a file format based on the ZIP file format.
It is used to bundle resources, class files, sound files, images, etc. for a Java application or applet.
It also provides data compression.
Originally, it was developed to bundle resources for an applet to reduce download time over an HTTP connection.

You can think of a JAR file as a special kind of ZIP file.
A JAR file provides many features that are not available in a ZIP file.
You can digitally sign the contents of a JAR file to provide security.
It provides a platform-independent file format.
You can use the JAR API to manipulate a JAR file in a Java program.

A JAR file can have an optional `META-INF` directory to contain files and directories
containing information about application configuration.

The following table lists the entries in a `META-INF` directory.

Contents of the `META-INF` Directory of a JAR File:

- `MANIFEST.MF`: File, Contains extension and package related data.
- `INDEX.LIST`: File, Contains location information of packages. Class loaders use it to speed up the class searching and loading process.
- `X.SF`: File, X is the base file name. It stores the signature for the JAR file.
- `X.DSA`: File, X is the base file name. It stores the digital signature of the corresponding signature file.
- `/services`: Directory, Contains all service provider configuration files.
  This directory is not needed if your application is developed using the module system in JDK9, which lets you configure services in module declaration.
- `versions`: Directory, Contains files specific to a JDK versions in a multi-release JAR file.

The JDK ships with a `jar` tool to create and manipulate JAR files.
You can also create and manipulate a JAR file using the Java API using classes in the `java.util.jar` package.
Most of the classes in this package are similar to the classes in the `java.util.zip` package.
In fact, most of the classes in this package are inherited from the classes that deal with the ZIP file format.
For example, the `JarFile` class inherits from the `ZipFile` class;
the `JarEntry` class inherits from the `ZipEntry` class;
the `JarInputStream` class inherits from the `ZipInputStream` class;
the `JarOutputStream` class inherits from the `ZipOutputStream` class, etc.
The JAR API has some new classes to deal with a manifest file.
The `Manifest` class represents a manifest file.

JDk9 added a few methods to the `JarFile` class to work with multi-release Jar files, which were introduced in JDk9.
For example, the `isMultiRelease()` method returns `true` if a `JarFile` represents a multi-release Jar.

