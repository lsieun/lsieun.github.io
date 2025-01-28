---
title: "javadoc"
sequence: "102"
---

Javadoc is a tool that parses **the declarations and documentation comments in a set of source files** and produces **a set of HTML pages describing the classes, interfaces, constructors, methods, and fields**. ([Link][javadoc-50-tool])

## Terminology

- **Documentation comments** (doc comments): The special comments in the Java source code that are delimited by the `/** ... */` delimiters. These comments are processed by the Javadoc tool to generate the API docs.
- `javadoc`: The JDK tool that generates API documentation from documentation comments.
- HTML
  - **API documentation** (API docs) or **API specifications** (API specs): On-line or hard-copy descriptions of the API, intended primarily for programmers writing in Java. These can be generated using the **Javadoc tool** or created some other way. **An API specification** is a particular kind of **API document**.
  - **Programming Guide Documentation**: What separates **API specifications** from a **programming guide** are **examples, definitions of common programming terms, certain conceptual overviews (such as metaphors), and descriptions of implementation bugs and workarounds**. There is no dispute that these contribute to a developer's understanding and help a developer write reliable applications more quickly. However, because these do not contain API "assertions", they are not necessary in an API specification. You can include any or all of this information in documentation comments.

## Javadoc Comments

A typical javadoc comment always appears immediately above the entity it is documenting, and has this general form:

```text
/**
 * A sentence or short paragraph of general description for
 * the class, interface, method or field being documented.
 * The first sentence should be given special attention,
 * since it will be extracted to serve as an even shorter
 * summary of the item.
 *
 * @tag1 description
 * @tag2 description
 */
```

Javadoc recognizes special comments `/** .... */` (regular comments `//` and `/* ... */`).

Javadoc allows you to attach **descriptions** to **classes, constructors, fields, interfaces and methods** in the generated html documentation by placing Javadoc comments directly before their declaration statements.  

Here's an example using Javadoc comments to describe a class, a field and a constructor:

## Javadoc Tags

Each tag is a special keyword that starts with the `@` character and serves as an indicator of some special kind of descriptive information.

**Tags** are keywords recognized by `javadoc` which define the type of information that follows.

Tags come after the description (separated by a new line). （这里讲的Tags和Description之间要有空行分隔）

Here are some common pre-defined tags:
- `@author [author name]` - identifies author(s) of a class or interface.
- `@version [version]` - version info of a class or interface.
- `@param [argument name] [argument description]` - describes an argument of method or constructor.
- `@return [description of return]` - describes data returned by method (unnecessary for constructors and void methods).
- `@exception [exception thrown] [exception description]` - describes exception thrown by method.
- `@throws [exception thrown] [exception description]` - same as @exception.

```java
/**
 * Class Description of MyClass
 */
public class MyClass {
    /**
     * Field Description of myIntField
     */
    public int myIntField;

    /**
     * Constructor Description of MyClass()
     */
    public MyClass() {
        // Do something ...
    }
}
```

## Javadoc Compilation

查看帮助：

```text
javadoc -help
```

To generate the html documentation, run `javadoc` followed by the list of source files:

```text
javadoc [files]
```

Javadoc also provides additional **options** which can be entered as **switches** following the `javadoc` command:

```text
javadoc [options] [files]
```

```text
javadoc [options] [packagenames] [sourcefiles] [@files]
```

Here are some basic Javadoc options:
- `-author` - generated documentation will include a author section
- `-classpath [path]` - specifies path to search for referenced .class files.
- `-classpathlist [path];[path];...;[path]` - specifies a list locations (separated by ";") to search for referenced .class files.
- `-d [path]` - specifies where generated documentation will be saved.
- `-private` - generated documentation will include private fields and methods (only public and protected ones are included by default).
- `-sourcepath [path]` - specifies path to search for .java files to generate documentation form.
- `-sourcepathlist [path];[path];...;[path]` - specifies a list locations (separated by ";") to search for .java files to generate documentation form.
- `-version` - generated documentation will include a version section

Some examples

- Basic example that generates and saves documentation to the current directory (`c:\MyWork`) from `A.java` and `B.java` in current directory and all `.java` files in `c:\OtherWork\`.

```text
c:\MyWork> Javadoc A.java B.java c:\OtherWork\*.java
```

- More complex example with the generated documentation showing **version** information and **private** members from all `.java` files in `c:\MySource\` and `c:\YourSource\` which references files in `c:\MyLib` and saves it to `c:\MyDoc`.

```text
c:\> Javadoc -version -private -d c:\MyDoc -sourcepathlist c:\MySource;c:\YourSource\ -classpath c:\MyLib
```

```bash
# Linux / MacOS
$ find -name "*.java" > sources.txt
$ javadoc -d docs/ @sources.txt
## 添加classpath的情况
$ javadoc -classpath "${CLASSPATH}" @java_sources.txt
```

## Reference

- [Wiki: Javadoc](https://en.wikipedia.org/wiki/Javadoc)
- [Oracle: Javadoc Tool](https://www.oracle.com/java/technologies/javase/javadoc.html)
- [Oracle: Javadoc Tool](https://www.oracle.com/java/technologies/javase/javadoc-tool.html)
- [x] [Oracle: How to Write Doc Comments for the Javadoc Tool](https://www.oracle.com/technical-resources/articles/java/javadoc-tool.html)
- [Oracle: Javadoc 5.0 Tool](https://docs.oracle.com/javase/1.5.0/docs/guide/javadoc/)
  - [solaris: javadoc - The Java API Documentation Generator](https://docs.oracle.com/javase/1.5.0/docs/tooldocs/solaris/javadoc.html)
  - [windows: javadoc - The Java API Documentation Generator](https://docs.oracle.com/javase/1.5.0/docs/tooldocs/windows/javadoc.html)
- [x] [javadoc - The Java API Documentation Generator](https://docs.oracle.com/javase/7/docs/technotes/tools/windows/javadoc.html#javadoctags)
- [uta.edu: Javadoc Tutorial](https://ranger.uta.edu/~tiernan/CSE1325/spring14/Javadoc%20Tutorial.htm)
- [Chapter 10. Documentation with Javadoc](http://drjava.org/docs/user/ch10.html)
- [javadoc: @version and @since](https://www.thecodingforums.com/threads/javadoc-version-and-since.671996/)
- [Java Tools for Development and Testing: javadoc](https://cs.smu.ca/~porter/csc/465/notes/java_tools_javadoc.html)

[javadoc-50-tool]: https://docs.oracle.com/javase/1.5.0/docs/guide/javadoc/
