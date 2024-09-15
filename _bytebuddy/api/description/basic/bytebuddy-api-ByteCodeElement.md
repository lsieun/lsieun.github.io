---
title: "ByteCodeElement"
sequence: "ByteCodeElement"
---

```java
public interface ByteCodeElement extends NamedElement.WithRuntimeName,
        NamedElement.WithDescriptor,
        ModifierReviewable.OfByteCodeElement,
        DeclaredByType,
        AnnotationSource {
    boolean isVisibleTo(TypeDescription typeDescription);

    boolean isAccessibleTo(TypeDescription typeDescription);
}
```

```text
Visibility > Accessibility
```

```text
                                           ┌─── Parent
                   ┌─── class.hierarchy ───┤
                   │                       └─── Child
ByteCodeElement ───┤
                   │                       ┌─── super.invokeXxx()
                   └─── visible ───────────┤
                                           └─── accessible ──────────┼─── Parent.invokeXxx()
```

## 示例

```java
package sample.parent;

public class Parent {
    public void myPublicMethod() {
    }

    protected void myProtectedMethod() {
    }

    private void myPrivateMethod() {
    }
}
```

```java
package sample.child;

import sample.parent.Parent;

public class Child extends Parent {
    void testSuper() {
        super.myPublicMethod();
        super.myProtectedMethod();
        // super.myPrivateMethod();
    }

    void test(Parent parent) {
        super.myPublicMethod();
        // parent.myProtectedMethod();
        // parent.myPrivateMethod();
    }
}
```

```java
import net.bytebuddy.description.method.MethodDescription;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.matcher.ElementMatchers;
import sample.child.Child;
import sample.parent.Parent;

public class HelloWorldAnalysis {
    public static void main(String[] args) throws ClassNotFoundException, NoSuchFieldException {
        Class<?> firstClass = Parent.class;
        Class<?> secondClass = Child.class;

        String[] methodNames = {
                "myPublicMethod",
                "myProtectedMethod",
                "myPrivateMethod",
        };

        for (String methodName : methodNames) {
            printVisibilityAndAccessibility(firstClass, methodName, secondClass);
        }
    }

    private static void printVisibilityAndAccessibility(Class<?> firstClass, String methodName, Class<?> secondClass) {
        MethodDescription methodDesc = TypeDescription.ForLoadedType.of(firstClass)
                .getDeclaredMethods()
                .filter(ElementMatchers.named(methodName))
                .getOnly();
        TypeDescription typeDesc = TypeDescription.ForLoadedType.of(secondClass);
        boolean visible = methodDesc.isVisibleTo(typeDesc);
        boolean accessible = methodDesc.isAccessibleTo(typeDesc);


        String[][] matrix = {
                {"method", methodDesc.toString()},
                {"type", typeDesc.toString()},
                {"isVisibleTo()", String.valueOf(visible)},
                {"isAccessibleTo()", String.valueOf(accessible)
                }
        };
        TableUtils.printTable(matrix, TableType.ONE_LINE);
    }
}
```

```text
┌──────────────────┬───────────────────────────────────────────────────┐
│      method      │ public void sample.parent.Parent.myPublicMethod() │
├──────────────────┼───────────────────────────────────────────────────┤
│       type       │             class sample.child.Child              │
├──────────────────┼───────────────────────────────────────────────────┤
│  isVisibleTo()   │                       true                        │
├──────────────────┼───────────────────────────────────────────────────┤
│ isAccessibleTo() │                       true                        │
└──────────────────┴───────────────────────────────────────────────────┘

┌──────────────────┬─────────────────────────────────────────────────────────┐
│      method      │ protected void sample.parent.Parent.myProtectedMethod() │
├──────────────────┼─────────────────────────────────────────────────────────┤
│       type       │                class sample.child.Child                 │
├──────────────────┼─────────────────────────────────────────────────────────┤
│  isVisibleTo()   │                          true                           │
├──────────────────┼─────────────────────────────────────────────────────────┤
│ isAccessibleTo() │                          false                          │
└──────────────────┴─────────────────────────────────────────────────────────┘

┌──────────────────┬─────────────────────────────────────────────────────┐
│      method      │ private void sample.parent.Parent.myPrivateMethod() │
├──────────────────┼─────────────────────────────────────────────────────┤
│       type       │              class sample.child.Child               │
├──────────────────┼─────────────────────────────────────────────────────┤
│  isVisibleTo()   │                        false                        │
├──────────────────┼─────────────────────────────────────────────────────┤
│ isAccessibleTo() │                        false                        │
└──────────────────┴─────────────────────────────────────────────────────┘
```
