---
title: "Jar URI scheme"
sequence: "108"
---

A URL Connection to a Java ARchive (JAR) file or an entry in a JAR file.

The syntax of a JAR URL is:

```text
jar:<url>!/{entry}
```

for example:

```text
jar:http://www.foo.com/bar/baz.jar!/COM/foo/Quux.class
```

**Jar URLs should be used to refer to a JAR file or entries in a JAR file.**
The example above is a JAR URL which refers to a JAR entry.
If the entry name is omitted, the URL refers to the whole JAR file: `jar:http://www.foo.com/bar/baz.jar!/`

> Jar URL可以用来表示Jar文件整体，也可以表示Jar文件中的某一个entry，也可以表示Jar文件里的某一个directory

Examples:

- A Jar entry `jar:http://www.foo.com/bar/baz.jar!/COM/foo/Quux.class`
- A Jar file `jar:http://www.foo.com/bar/baz.jar!/`
- A Jar directory `jar:http://www.foo.com/bar/baz.jar!/COM/foo/`

`!/` is referred to as the **separator**.

When constructing a JAR url via `new URL(context, spec)`, the following rules apply:

- if there is no context URL and the specification passed to the URL constructor doesn't contain a separator, the URL is considered to refer to a JarFile.
- if there is a context URL, the context URL is assumed to refer to a JAR file or a Jar directory.
- if the specification begins with a '/', the Jar directory is ignored, and the spec is considered to be at the root of the Jar file.

Examples:

- context: jar:http://www.foo.com/bar/jar.jar!/, spec:baz/entry.txt
- url:jar:http://www.foo.com/bar/jar.jar!/baz/entry.txt
- context: jar:http://www.foo.com/bar/jar.jar!/baz, spec:entry.txt
- url:jar:http://www.foo.com/bar/jar.jar!/baz/entry.txt
- context: jar:http://www.foo.com/bar/jar.jar!/baz, spec:/entry.txt
- url:jar:http://www.foo.com/bar/jar.jar!/entry.txt

## JarURLConnection

Users should cast the generic `URLConnection` to a `JarURLConnection` when they know that the URL they created is a JAR URL,
and they need JAR-specific functionality. For example:

```text
URL url = new URL("jar:file:/home/duke/duke.jar!/");
JarURLConnection jarConnection = (JarURLConnection)url.openConnection();
Manifest manifest = jarConnection.getManifest();
```

`JarURLConnection` instances can only be used to **read** from JAR files.
It is not possible to get a `java.io.OutputStream` to modify or write to the underlying JAR file using this class.

> JarURLConnection只能对Jar文件进行“读”操作，而不能进行“写”操作。




