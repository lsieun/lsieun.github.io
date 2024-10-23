---
title: "Reliable Configuration"
sequence: "106"
---

## Reliable Configuration

**reliable configuration** aims to ensure that the particular configuration of artifacts
a Java program is compiled against or launched with
can sustain the program without spurious run-time errors.
To this end, it performs a couple of checks (during **module resolution**).

The module system checks whether the universe of **observable modules** contains all required dependencies,
direct and transitive, and reports an error if something's missing.

**There must be no ambiguity**: no two artifacts can claim they're the same module.
This is particularly interesting in the case where two versions of the same module are present—
because the **module system has no concept of versions**, it treats this as a duplicate module.
Accordingly, it reports an error if it runs into this situation.

**There must be no static dependency cycles between modules**.
At run time, it's possible and even necessary for modules to access each other
(think about code using Spring annotations and Spring reflecting over that code),
but these must not be compile dependencies
(Spring is obviously not compiled against the code it reflects over).

**Packages should have a unique origin**,
so no two modules must contain types in the same package.
If they do, this is called a **split package**,
and the module system will refuse to compile or launch such configurations.
This is particularly interesting in the context of migration
because some existing libraries and frameworks split packages on purpose.

Although it makes sense to enforce the presence of **all transitively required modules** at **launch time**,
the same can't be said for the **compiler**.
Accordingly, if an indirect dependency is missing, the **compiler** emits neither a warning nor an error.

> 对于深层的依赖（transitive dependency），java和javac的处理是不同的。

## duplicate modules

Because modules reference one another by name,
any situation where two modules claim to have the same name is ambiguous.
Which one is correct to pick is highly dependent on the context and
not something the **module system** can generally **decide**.

So instead of **making** a potentially bad **decision**,
it **makes none** at all, and instead produces an error.
Failing fast like this allows the developer to notice the problem and fix it before it causes any more issues.

**Ambiguity checks** are only applied to **individual module path** entries!

The module system also throws the **duplicate module error** if **the module isn't actually required**.
It suffices that the **module path** contains it!
Two of the reasons for that are **services** and **optional dependencies**.

## split packages

A **split package** occurs when two modules contain types in the same package.

Interestingly, the compiler shows an error only if
the module under compilation can access the split package in the other module.
That means the split package must be exported.
