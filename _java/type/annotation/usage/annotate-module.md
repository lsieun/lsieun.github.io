---
title: "Annotating Modules"
sequence: "109"
---

You can use annotations on **module declarations**.
For this aim, the `java.lang.annotation.ElementType` enum has a value called `MODULE`.
If you use `MODULE` as a target type on an annotation declaration,
it allows the annotation type to be used on modules.

The two annotations `java.lang.Deprecated` and `java.lang.SuppressWarnings`
can be used on module declarations as follows:

```java
@Deprecated(since="1.2", forRemoval=true)
@SuppressWarnings("unchecked")
module com.jdojo.myModule {
    // Module statements go here
}
```

When a module is deprecated, the use of that module in `requires`,
but not in `exports` or `opens` statements, causes a warning to be issued.
This rule is based on the fact that if module M is deprecated,
a “requires M” statement will be used by the module's users
who need to get the deprecation warnings.

Other statements such as `exports` and `opens` are within the module that is deprecated.
A deprecated module does not cause warnings to be issued for uses of types within the module.

Similarly, if a warning is suppressed in a module declaration,
the suppression applies to elements within the
module declaration and not to types contained in that module.

## individual module statements

Note: You cannot annotate **individual module statements**.
For example, you cannot annotate an `exports` statement with a `@Deprecated` annotation
indicating that the exported package will be removed in a future release.
During the early design phase, it was considered and rejected on the ground that
this feature will take a considerable amount of time that is not needed at this time.
This could be added in the future, if needed.
