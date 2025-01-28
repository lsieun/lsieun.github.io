---
title: "Checkstyle配置：概览"
sequence: "102"
---

Checkstyle 的工作方式：通过配置文件（`xml`）来检查 Java 源代码。

```text
Checkstyle --> xml configuration (module) --> Java Source files
```

A Checkstyle configuration specifies which **modules** to plug in and apply to Java source files.

在 `checkstyle.xml` 文件中，主要由 `<module>` 和 `<property>` 组成。

```xml
<!DOCTYPE module PUBLIC
        "-//Checkstyle//DTD Checkstyle Configuration 1.3//EN"
        "https://checkstyle.org/dtds/configuration_1_3.dtd">
<module name="Checker">
    <module name="TreeWalker">
        <module name="AvoidStarImport">
            <property name="severity" value="warning"/>
        </module>
    </module>
</module>
```

在 `checkstyle.jar` 中，提供了 `google_checks.xml` 和 `sun_checks.xml` 示例文件：

![](/assets/images/java/checkstyle/checkstyle-jar-built-in-checks-xml.png)

## 语法

### module

```text
<module name="ModuleName"/>
```

其中，`ModuleName` 可以是如下包中的类：

- `com.puppycrawl.tools.checkstyle`
- `com.puppycrawl.tools.checkstyle.checks`
- `com.puppycrawl.tools.checkstyle.filters`

```text
                                                              ┌─── Checker
              ┌─── com.puppycrawl.tools.checkstyle ───────────┤
              │                                               └─── TreeWalker
              │
              │                                                               ┌─── AvoidStaticImportCheck
Checkstyle ───┤                                                               │
              ├─── com.puppycrawl.tools.checkstyle.checks ────┼─── imports ───┼─── RedundantImportCheck
              │                                                               │
              │                                                               └─── UnusedImportsCheck
              │
              └─── com.puppycrawl.tools.checkstyle.filters
```

## Checker

Modules are structured in a tree whose root is the `Checker` module.
The next level of modules contains:

- **File Set Checks** - modules that take a set of input files and fire violation messages.
- **Filters** - modules that filter audit events, including messages, for acceptance.
- **Audit Listeners** - modules that report accepted events.

```java
package com.puppycrawl.tools.checkstyle;

public class Checker extends AbstractAutomaticBean implements MessageDispatcher, RootModule {
    private final List<FileSetCheck> fileSetChecks = new ArrayList<>();

    private final FilterSet filters = new FilterSet();

    private final List<AuditListener> listeners = new ArrayList<>();
}
```

## TreeWalker

Many checks are submodules of the `TreeWalker` **File Set Check module**.
The `TreeWalker` operates by separately transforming each of the Java source files into an abstract syntax tree and
then handing the result over to each of its submodules which in turn have a look at certain aspects of the tree.

```java
package com.puppycrawl.tools.checkstyle;

public final class TreeWalker extends AbstractFileSetCheck implements ExternalResourceHolder {
    private final Set<AbstractCheck> ordinaryChecks = createNewCheckSortedSet();
}
```

```java
public abstract class AbstractFileSetCheck
    extends AbstractViolationReporter
    implements FileSetCheck {
    // ...
}
```



```java
package com.puppycrawl.tools.checkstyle.checks.imports;

public class AvoidStarImportCheck
        extends AbstractCheck {
    
}
```

## Reference

- [最全详解CheckStyle的检查规则](https://blog.csdn.net/rogerjava/article/details/119322285)
