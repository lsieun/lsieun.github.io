---
title: "classpath"
sequence: "101"
---

Whether or not your application uses modules, the JDK it runs on always consists of modules as of Java 9.

When using **modules**, JDK 9 by default disallows access to **encapsulated packages** and **deep reflection** on code
in other modules, which includes platform modules.

On the classpath, **strong encapsulation** of platform internals is not enforced as strictly,
although it still plays a role.

## deep reflection

To ease migration of **classpath-based applications** to Java 9,
the JVM by default shows a warning when **deep reflection** is applied on classes in platform modules.
Or, when reflection is used to access types in nonexported packages.

```text
WARNING: An illegal reflective access operation has occurred
WARNING: Illegal reflective access by javassist.util.proxy.SecurityActions
  (...javassist-3.20.0-GA.jar) to method
  java.lang.ClassLoader.defineClass(...)
WARNING: Please consider reporting this to the maintainers of
  javassist.util.proxy.SecurityActions
WARNING: Use --illegal-access=warn to enable warnings of further illegal
  reflective access operations
WARNING: All illegal access operations will be denied in a future release
```

Code that ran without any issues on JDK 8 and earlier now prints a prominent warning to the console—even in production.
It shows **how seriously the breach of strong encapsulation** is taken.

Besides this warning, the application will still run as usual.
As indicated by the warning message, the behavior will change in a next version of Java.

> 现在：除了warning之外，运行没有问题。

In the future, the JDK will enforce strong encapsulation of platform modules even for code on the classpath.
The same application will not run on default settings in a future Java release.
Therefore, **it is important to investigate the warnings and to fix the underlying problems**.
When the warnings are caused by libraries, that usually means reporting the issue to the maintainers.

> 将来：JDK对于classpath也要保持strong encapsulation

By default, only a single warning is generated on the first illegal access attempt.
Following attempts will not generate extra errors or warnings.
If we want to further investigate the cause of the problem,
we can use different settings for the `--illegal-access` command-line flag to tweak the behavior:

- `--illegal-access=permit`: The default behavior. Illegal access to encapsulated types is allowed.
  Generates a warning on the first illegal access attempt through reflection.
- `--illegal-access=warn`: Like permit, but generates an error on every illegal access attempt.
- `--illegal-access=debug`: Also shows stack traces for illegal access attempts.
- `--illegal-access=deny`: Does not allow illegal access attempts. This will be the default in the future.

Remember to run your application with `--illegal-access=deny` as well, to be prepared for the future.

Notice that none of the settings allow you to suppress the printed warnings. This is by design.

We can use the `--add-opens` flag to grant the classpath **deep reflection** access to a specific package in a module.

As a refresher, a package needs to be **open** to allow **deep reflection**.
This is even true when the package is exported as is the case here with `java.lang`.
A package is usually opened in a **module descriptor**, similar to the way packages are exported.

We can do the same from the command line for modules that we don't control (for example, platform modules):

```text
java --add-opens java.base/java.lang=ALL-UNNAMED
```

`java.base/java.lang` is the `module/package` we grant access to.
The last argument is **the module** that gets the access.
Because the code is still on the classpath, we use `ALL-UNNAMED`, which represents the classpath.

The package is now open, so the deep reflection is no longer illegal.
This will remove the **warning** (or error, when running with `--illegal-access=deny`).

Remember that this is still just a workaround. Ask the
maintainers of a library that causes illegal access problems for an updated version of
the library with a proper fix.

### TOO MANY COMMAND-LINE FLAGS!

Some operating systems limit the length of the command line that can be executed.
When you need to add many flags during migration, you can hit these limits.
You can use a file to provide all the command-line arguments to `java`/`javac` instead:

```text
$ java @arguments.txt
```

The argument files must contain all necessary command-line flags.
Each line in the file contains a single option.
For instance, `arguments.txt` could contain the following:

```text
-cp application.jar:javassist.jar
--add-opens java.base/java.lang=ALL-UNNAMED
--add-exports java.base/sun.security.x509=ALL-UNNAMED
-jar application.jar
```

Even if you're not running into command-line limits,
argument files can be clearer than a very long line somewhere in a script.


