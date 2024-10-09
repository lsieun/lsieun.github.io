---
title: "Annotation Element: Default Value"
sequence: "106"
---

## syntax

```text
[modifiers] @interface <annotation-type-name> {
    <data-type> <element-name>() default <default-value>;
}
```

The keyword `default` is used to specify the default value.

```text
public @interface Version {
    int major();
    int minor() default 0; // Set zero as default value for minor
}
```

All default values must be compile-time constants.

## array type

How do you specify the default value for an array type? You need to use the array initializer syntax.

```text
public @interface MyTag {
    double d() default 12.89;

    int num() default 12;

    int[] x() default {1, 2};

    String s() default "Hello";

    String[] s2() default {"abc", "xyz"};

    Class<?> c() default Exception.class;

    Class<?>[] c2() default {Exception.class, java.io.IOException.class};
}
```

The default value for an element is not compiled with the annotation.
It is read from the annotation type definition
when a program attempts to read the value of an element at runtime.

The implication of this mechanism is that
if you change the default value of an element,
the changed default value will be read whenever a program attempts to read it,
even if the annotated program was compiled before you changed the default value.



