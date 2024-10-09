---
title: "Resource Paths"
sequence: "101"
---

A big part of packaging and deploying an application is dealing with all of the resource files that must go with it,
such as configuration files, graphics, and application data.

Java provides several ways to access these resources.

- One way is to simply open files and read the bytes.
- Another is to construct a `URL` pointing to a well-known location in the filesystem or over the network.

The problem with these methods is that they generally rely on knowledge of the application's location and packaging,
which could change or break if it is moved.
**What is really needed is a universal way to access resources associated with our application,
regardless of how it's installed.**

The `Class` class's `getResource()` method and the Java classpath provides just this. For example:


```text
URL resource = MyApplication.class.getResource("/config/config.xml");
```

Instead of constructing a `File` reference to an absolute file path,
or relying on composing information about an install directory,
the `getResource()` method provides a standard way to get resources relative to the classpath of the application.
A resource can be located either **relative to a given class file** or **to the overall system classpath**.
`getResource()` uses the classloader that loads the application's class files to load the data.
This means that no matter where the application classes reside—a web server, the local filesystem,
or even inside a JAR file or other archive—we can load resources packaged with those classes consistently.

Many APIs for loading data (for example, images) accept a `URL` directly.
If you're reading the data yourself, you can ask the `URL` for an `InputStream` with
the `URL.openStream()` method and treat it like any other stream.
A convenience method called `getResourceAsStream()` skips this step for you and
returns an `InputStream` directly.

`getResource()` takes as an argument a slash-separated **resource path** for the resource and returns a `URL`.
**There are two kinds of resource paths: absolute and relative.**
**An absolute path** begins with a slash (for example, `/config/config.xml`).
In this case, the search for the object begins at the “top” of the classpath.
By the “top” of the classpath,
we mean that Java looks within each element of the classpath (directory or JAR file) for the specified file.
Given `/config/config.xml`, it would check **each directory** or **JAR file** in the path for the file `config/config.xml`.
In this case, the class on which `getResource()` is called doesn't matter
as long as it's from a class loader that has the resource file in its classpath. For example:

```text
URL data = AnyClass.getResource("/config/config.xml");
```

On the other hand, a **relative URL** does not begin with a slash (for example, `mydata.txt`).
In this case, the search begins at the location of the class file on which `getResource()` is called.
In other words, the path is relative to the package of the target class file.
For example, if the class file `foo.bar.MyClass` is located at the path `foo/bar/MyClass.class` in some directory
or JAR of the classpath and the file `mydata.txt` is in the same directory (`foo/bar/mydata.txt`),
we can request the file via `MyClass` with:

```text
URL data = MyClass.getResource("mydata.txt");
```
