---
title: "Module Declaration"
sequence: "105"
---

```text
                      ┌─── filename ───┼─── module-info.java
                      │
                      │
                      │                                    ┌─── reverse-domain-name pattern
module declaration ───┤                ┌─── module name ───┤
                      │                │                   └─── com.example.www
                      │                │
                      │                │
                      └─── content ────┤                   ┌─── requires
                                       │                   │
                                       │                   ├─── exports
                                       │                   │
                                       └─── directive ─────┼─── open, opens
                                                           │
                                                           ├─── uses
                                                           │
                                                           └─── provides
```

Each module has a module declaration.
By convention, this is a `module-info.java` file in the project's root source folder.
From this, the compiler creates a module descriptor, `module-info.class`.
When the compiled code is packaged into a JAR,
the descriptor must end up in the root folder for the module system to recognize and process it.

第一点，module declaration的具体表现形式是`module-info.java`。

The `module-info.java` is placed at the root of the module's source-file hierarchy.

第二点，其位置

```text
module-info.java
com/foo/bar/alpha/AlphaFactory.java
com/foo/bar/alpha/Alpha.java
...
```

It's called a module declaration and
is in charge of defining a module's properties.

第三点，在module declaration中，可以定义module's properties。

> 应该画一个图

```text
                                              ┌─── requires
                                              │
                    ┌─── dependency ──────────┼─── requires transitive
                    │                         │
                    │                         └─── requires static
                    │
                    │                         ┌─── exports
                    ├─── public api ──────────┤
                    │                         └─── exports-to
                    │
module-info.java ───┤                         ┌─── open
                    │                         │
                    ├─── reflective access ───┼─── opens
                    │                         │
                    │                         └─── opens-to
                    │
                    │
                    │                         ┌─── uses
                    └─── service provider ────┤
                                              └─── provides
```

Inside the module block, `requires` directives express the dependencies between modules,
and `exports` directives define each module's public API by naming the packages whose public types are to be exported.



What can go inside the module declaration?
You've learned about the `requires` and `exports` clauses,
but there are other clauses, including `requires-transitive`,
`exports-to`, `open`, `opens`, `uses`, and `provides`.

## requires

| directive           | compile time | runtime |
|---------------------|--------------|---------|
| requires            | OK           | OK      |
| requires transitive | OK           | OK      |
| requires static     | OK           | NO      |

The `requires` clause lets you specify that your module depends on another module at both compile time and runtime.

The module `com.iteratrlearning.application`, for example, depends on the module `com.iteratrlearning.ui`:

```text
module com.iteratrlearning.application {
    requires com.iteratrlearning.ui;
}
```

The result is that only `public` types that were exported by `com.iteratrlearning.ui`
are available for `com.iteratrlearning.application` to use.

## exports

The `exports` clause makes the `public` types in specific packages available for use by other modules.
By default, no package is exported.
You gain strong encapsulation by making explicit what packages should be exported.

In the following example, the packages `com.iteratrlearning.ui.panels` and `com.iteratrlearning.ui.widgets` are exported.
(Note that `exports` takes **a package name** as an argument and that `requires` takes **a module name**, despite the similar naming schemes.)

```java
module com.iteratrlearning.ui { 
    requires com.iteratrlearning.core;

    exports com.iteratrlearning.ui.panels;
    exports com.iteratrlearning.ui.widgets;
}
```

## requires transitive

You can specify that a module can use the `public` types required by another module.
You can modify the `requires` clause, for example,
to `requires-transitive` inside the declaration of the module `com.iteratrlearning.ui`:

```java
module com.iteratrlearning.ui { 
    requires transitive com.iteratrlearning.core;

    exports com.iteratrlearning.ui.panels;
    exports com.iteratrlearning.ui.widgets;
}
```

```java
module com.iteratrlearning.application { 
    requires com.iteratrlearning.ui;
}
```

The result is that the module `com.iteratrlearning.application` has access to the `public` types exported by `com.iteratrlearning.core`.
Transitivity is useful when the module required (here, com.iteratrlearning.ui) returns types
from another module required by this module (com.iteratrlearning.core).
It would be annoying to re-declare `requires com.iteratrlearning.core` inside the module `com.iteratrlearning.application`.
This problem is solved by transitive.
Now any module that depends on `com.iteratrlearning.ui` automatically reads the `com.iteratrlearning.core` module.

## exports to

You have a further level of visibility control,
in that you can restrict the allowed users of a particular export by
using the `exports to` construct.
You can restrict the allowed users of
`com.iteratrlearning.ui.widgets` to `com.iteratrlearning.ui.widgetuser` by adjusting the module declaration like so:

```java
module com.iteratrlearning.ui { 
    requires com.iteratrlearning.core;

    exports com.iteratrlearning.ui.panels;
    exports com.iteratrlearning.ui.widgets to com.iteratrlearning.ui.widgetuser;
}
```

## open and opens

Using the `open` qualifier on module declaration gives other modules **reflective access** to all its packages.

The `open` qualifier has no effect on **module visibility** except for allowing **reflective access**, as in this example:

```java
open module com.iteratrlearning.ui {
}
```

Before Java 9, you could inspect the `private` state of objects by using **reflection**.
In other words, nothing was truly encapsulated.
Object-relational mapping (ORM) tools such as Hibernate often use this capability to access and modify state directly.
**In Java 9, reflection is no longer allowed by default.**
The `open` clause in the preceding code serves to allow that behavior when it's needed.

Instead of **opening a whole module to reflection**,
you can use an `opens` clause within a module declaration to **open its packages** individually, as required.
You can also use the `to` qualifier in the `opens-to` variant to limit the modules allowed to perform reflective access,
analogous to how `exports-to` limits the modules allowed to require an exported package.

## uses and provides

If you're familiar with services and `ServiceLoader`,
the Java Module System allows you to specify a module as a service provider using the `provides` clause and
a service consumer using the `uses` clause.

