---
title: "Shadowing"
sequence: "104"
---

If a declaration of a type (such as a member variable or a parameter name) in a particular scope
(such as an inner class or a method definition) has the same name as another declaration in the enclosing scope,
then the declaration shadows the declaration of the enclosing scope.
You cannot refer to a shadowed declaration by its name alone.

The following example, `ShadowTest`, demonstrates this:

```text
public class ShadowTest {

    public int x = 0;

    class FirstLevel {

        public int x = 1;

        void methodInFirstLevel(int x) {
            System.out.println("x = " + x);
            System.out.println("this.x = " + this.x);
            System.out.println("ShadowTest.this.x = " + ShadowTest.this.x);
        }
    }

    public static void main(String... args) {
        ShadowTest st = new ShadowTest();
        ShadowTest.FirstLevel fl = st.new FirstLevel();
        fl.methodInFirstLevel(23);
    }
}
```

The following is the output of this example:

```text
x = 23
this.x = 1
ShadowTest.this.x = 0
```

This example defines three variables named `x`:
the member variable of the class `ShadowTest`,
the member variable of the inner class `FirstLevel`,
and the parameter in the method `methodInFirstLevel`.
The variable `x` defined as a parameter of the method `methodInFirstLevel` shadows the variable of the inner class `FirstLevel`.
Consequently, when you use the variable `x` in the method `methodInFirstLevel`,
it refers to the method parameter.
To refer to the member variable of the inner class `FirstLevel`, use the keyword `this` to represent the enclosing scope:

```text
System.out.println("this.x = " + this.x);
```

Refer to member variables that enclose larger scopes by the class name to which they belong.
For example, the following statement accesses the member variable of the class `ShadowTest` from the method `methodInFirstLevel`:

```text
System.out.println("ShadowTest.this.x = " + ShadowTest.this.x);
```
