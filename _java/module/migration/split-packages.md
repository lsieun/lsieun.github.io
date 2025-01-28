---
title: "Split Packages"
sequence: "102"
---

A **split package** means two modules contain the same package.

> split package的含义

The Java module system doesn't allow split packages.

> module system对待split packages的态度：不支持

When using **automatic modules**, we can run into **split packages** as well.
In large applications, it is common to find split packages due to dependency mismanagement.
Split packages are always a mistake, because they don't work reliably on the classpath either.
Unfortunately, when using build tools that resolve transitive dependencies,
it's easy to end up with multiple versions of the same library.
The first class found on the classpath is loaded.
When classes from two versions of a library mix, this often leads to hard-to-debug exceptions at run-time.

> 在classpath的情况下，会导致一些问题

**The Java module system is much stricter** about this issue than the classpath.
When it detects that a package is exported from two modules on the module path, it will refuse to start.
This fail-fast mechanism is much better than the unreliable situation we used to have with the classpath.
Better to fail during development than in production,
when some unlucky user hits a code path that is broken by an obscure classpath problem.
But it also means we have to deal with these issues.
Blindly moving all JARs from the classpath to the module path may result in **split packages**
between the resulting automatic modules.
These will then be rejected by the module system.

> module system如何处理split package

To make migration a little easier, an exception to this rule exists
when it comes to **automatic modules** and the **unnamed module**.
It acknowledges that a lot of classpaths are simply incorrect and contain split packages.
**When both a (automatic) module and the unnamed module contain the same package, the package from the module will be used.**
**The package in the unnamed module will be ignored.**
This is also the case for packages that are part of the platform modules.
It's common to override platform packages by putting them on the classpath.
This approach is no longer working in Java 9.
`java.se.ee` modules are not included in the `java.se` module for this reason.

If you run into split package issues while migrating to Java 9, there's is no way around them.
You must deal with them, even when your classpath-based application works correctly from a user's perspective.













