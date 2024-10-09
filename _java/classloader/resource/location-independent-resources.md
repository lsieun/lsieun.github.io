---
title: "Location-Independent Access to Resources"
sequence: "101"
---


## Overview

A resource is data (images, audio, text, and so on) that a program needs to access in a way
that is independent of the location of the program code.

Java programs can use **two mechanisms** to access resources:

- Applets use `Applet.getCodeBase()` to get the base `URL` for the applet code and
  then extend the base `URL` with a relative path to load the desired resource,
  for example with `Applet.getAudioClip(url)`.
- Applications use "well known locations" such as `System.getProperty("user.home")` or `System.getProperty("java.home")`,
  then add "/lib/resource", and open that file.

Methods in the classes `Class` and `ClassLoader` provide **a location-independent way to locate resources**. For example, they enable locating resources for:

- An applet loaded from the Internet using multiple HTTP connections.
- An applet loaded using JAR files.
- A Java Bean loaded or installed in the `CLASSPATH`.
- A "library" installed in the `CLASSPATH`.

## Resources, names, and contexts

A **resource** is identified by a string consisting of a sequence of substrings, delimited by slashes (`/`), followed by a resource name.
Each substring must be a valid Java identifier.
The resource name is of the form `shortName` or `shortName.extension`.
Both `shortName` and `extension` must be Java identifiers.

The **name** of a resource is independent of the Java implementation;
in particular, the path separator is always a slash (`/`).
However, the Java implementation controls the details of
how the contents of the resource are mapped into a file, database, or other object containing the actual resource.

The interpretation of **a resource name** is relative to a **class loader instance**.
Methods implemented by the `ClassLoader` class do this interpretation.

## Resource Type

### System Resources

A **system resource** is a resource that is either built-in to the system,
or kept by the host implementation in, for example, a local file system.
Programs access **system resources** through the `ClassLoader` methods `getSystemResource` and `getSystemResourceAsStream`.

For example, in a particular implementation, **locating a system resource may involve searching the entries in the `CLASSPATH`.**
The `ClassLoader` methods search each directory, ZIP file, or JAR file entry in the `CLASSPATH` for the resource file,
and, if found, returns either an `InputStream`, or the **resource name**.
If not found, the methods return `null`.
A resource may be found in a different entry in the `CLASSPATH` than the location where the class file was loaded.

### Non-System Resources

The implementation of `getResource` on a class loader depends on the details of the `ClassLoader` class. For example, `AppletClassLoader`:

- First tries to locate the resource as a system resource; then, if not found,
- Searches through the resources in archives (JAR files) already loaded in this `CODEBASE`; then, if not found,
- Uses `CODEBASE` and attempts to locate the resource (which may involve contacting a remote site).

All **class loaders** will search for **a resource** first as a **system resource**, in a manner analogous to searcing for class files.
This search rule permits overwriting locally any resource.
Clients should choose a resource name that will be unique (using the company or package name as a prefix, for instance).

## Resource Names

A common convention for the name of a resource used by a class is to use the fully qualified name of the package of the class,
but convert all periods (`.`) to slashes (`/`), and add a resource name of the form `name.extension`.
To support this, and to simplify handling the details of system classes (for which `getClassLoader` returns `null`),
the class `Class` provides two convenience methods that call the appropriate methods in `ClassLoader`.

The **resource name** given to a `Class` method may have an initial starting "/" that identifies it as an **"absolute" name**.
Resource names that do not start with a "/" are **"relative"**.

**Absolute names** are stripped of their starting "/" and are passed, without any further modification,
to the appropriate `ClassLoader` method to locate the resource.
**Relative names** are modified according to the convention described previously and then are passed to a `ClassLoader` method.

## Find Resource

### Using Methods of java.lang.Class

The `Class` class implements several methods for loading resources.

The method `getResource()` returns a `URL` for the resource.
The `URL` (and its representation) is specific to the implementation and the JVM
(that is, the `URL` obtained in one runtime instance may not work in another).
Its protocol is usually specific to the `ClassLoader` loading the resource.
If the resource does not exist or is not visible due to security considerations, the methods return `null`.

If the client code wants to read the contents of the resource as an `InputStream`,
it can apply the `openStream()` method on the `URL`.
This is common enough to justify adding `getResourceAsStream()` to `Class` and `ClassLoader`.
`getResourceAsStream()` the same as calling `getResource().openStream()`,
except that `getResourceAsStream()` catches IO exceptions returns a null `InputStream`.

Client code can also request the contents of the resource as an object
by applying the `java.net.URL.getContent()` method on the `URL`.
This is useful when the resource contains the data for an image, for instance.
In the case of an image, the result is an `awt.image.ImageProducer` object, not an Image object.

```java
public final class URL implements java.io.Serializable {
    public final Object getContent() throws java.io.IOException {
        return openConnection().getContent();
    }
}
```

The `getResource` and `getResourceAsStream` methods find a resource with a given name.
They return `null` if they do not find a resource with the specified name.
The rules for searching for resources associated with a given class are implemented by the class's `ClassLoader`.
The `Class` methods delegate to `ClassLoader` methods, after applying a **naming convention**:
if the resource name starts with "/", it is used as is.
Otherwise, the name of the package is prepended, after converting all periods (`.`) to slashes (`/`).

```java
public final class Class<T> implements java.io.Serializable, GenericDeclaration, Type, AnnotatedElement {
    public InputStream getResourceAsStream(String name) {
        name = resolveName(name);
        ClassLoader cl = getClassLoader0();
        if (cl==null) {
            // A system class.
            return ClassLoader.getSystemResourceAsStream(name);
        }
        return cl.getResourceAsStream(name);
    }

    public URL getResource(String name) {
        name = resolveName(name);
        ClassLoader cl = getClassLoader0();
        if (cl==null) {
            // A system class.
            return ClassLoader.getSystemResource(name);
        }
        return cl.getResource(name);
    }

    private String resolveName(String name) {
        if (name == null) {
            return name;
        }
        if (!name.startsWith("/")) {
            Class<?> c = this;
            while (c.isArray()) {
                c = c.getComponentType();
            }
            String baseName = c.getName();
            int index = baseName.lastIndexOf('.');
            if (index != -1) {
                name = baseName.substring(0, index).replace('.', '/') +"/"+name;
            }
        } else {
            name = name.substring(1);
        }
        return name;
    }
}
```

The `resolveName` method adds a package name prefix if the name is not absolute,
and removes any leading "/" if the name is absolute.
It is possible, though uncommon, to have classes in diffent packages sharing the same resource.

### Using Methods of java.lang.ClassLoader

The `ClassLoader` class has two sets of methods to access resources.
One set returns an `InputStream` for the resource. The other set returns a `URL`.
The methods that return an `InputStream` are easier to use and will satisfy many needs,
while the methods that return `URL`s provide access to more complex information, such as an `Image` and an `AudioClip`.

The `ClassLoader` manges resources similarly to the way it manages classes.
A `ClassLoader` controls how to map the name of a resource to its content.
`ClassLoader` also provides methods for accessing **system resources**, analogous to the **system classes**.
The `Class` class provides some convenience methods that delegate functionality to the `ClassLoader` methods.

Many Java programs will access these methods indirectly through the I18N (localization) APIs.
Others will access it through methods in `Class`.
A few will directly invoke the `ClassLoader` methods.

The methods in `ClassLoader` use the given `String` as the name of the resource
without applying any absolute/relative transformation (see the methods in `Class`).
**The name should not have a leading "/".**

**System resources** are those that are handled by the host implemenation directly.
For example, they may be located in the `CLASSPATH`.

The **name of a resource** is a "/"-separated sequence of identifiers.
The `Class` class provides convenience methods for accessing resources;
the methods implement a convention where the package name is prefixed to the short name of the resource.

Resources can be accessed as an `InputStream`, or a `URL`.

The `getSystemResourceAsStream` method returns an `InputStream` for the specified system resource or `null` if it does not find the resource.
The resource name may be any system resource.

The `getSystemResource` method finds a system resource with the specified name.
It returns a `URL` to the resource or `null` if it does not find the resource.
Calling `java.net.URL.getContent()` with the `URL` will return an object such as `ImageProducer`, `AudioClip`, or `InputStream`.

The `getResourceAsStream` method returns an `InputStream` for the specified resource or `null` if it does not find the resource.

The `getResource` method finds a resource with the specified name.
It returns a `URL` to the resource or `null` if it does not find the resource.
Calling `java.net.URL.getContent()` with the `URL` will return an object such as `ImageProducer`, `AudioClip`, or `InputStream`.

## Security

Since `getResource()` provides access to information, it must have well-defined and well-founded security rules.
If security considerations do not allow a resource to be visible in some security context,
the `getResource()` method will fail (return `null`) as if the resource were not present at all, this addresses existence attacks.

Class loaders may not provide access to the contents of a `.class` file for both security and performance reasons.
Whether it is possible to obtain a `URL` for a `.class` file depends on the specifics, as shown below.

There are no specified security issues or restrictions regarding resources that are found by a non-system class loader.
`AppletClassLoader` provides access to information that is loaded from a source location,
either individually, or in a group through a JAR file;
thus `AppletClassLoader` should apply the same `checkConnect()` rules when dealing with `URL`s through `getResource()`.

The system `ClassLoader` provides access to information in the `CLASSPATH`.
A `CLASSPATH` may contain directories and JAR files.
**Since a JAR file is created intentionally,
it has a different significance than a directory**
where things may end up in a more casual manner.
In particular, we are more strict on getting information out of a directory than out from a JAR file.

If a resource is in a directory:

- `getResource()` invocations will use `File.exists()` to determine whether to make the corresponding file visible to the user.
  Recall that `File.exists()` uses the `checkRead()` method in the security manager.
- the same applies to `getResourceAsStream()`.

If the resource is in a JAR file:

- `getResource()` invocations will succeed for all files, regardless of whether the invocation is done from within a system or a non-system class.
- `getResourceAsStream()` invocations will succeed for non `.class` resources, and so will for `java.net.URL.getContent()` on corresponding `URL`s.

## Reference

- [Location-Independent Access to Resources](https://docs.oracle.com/javase/8/docs/technotes/guides/lang/resources.html)

