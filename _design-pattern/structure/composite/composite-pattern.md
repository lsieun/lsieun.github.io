---
title: "组合模式"
sequence: "composite"
---

The Composite Pattern describes **how objects are put together to form larger meaningful units.**

In short, the Composite Pattern helps you represent **tree structures**.
Let's clarify some terms!
Each item in a tree structure is a **node**.
A node that has no child nodes is a **leaf**.
A node that has subnodes is called a **composite**.
The node at the top of the tree is the **root**.

![](/assets/images/design-pattern/diagrams/composite-structure.png)

There are two different approaches to implement the composite pattern.

## 第一种实现方式: 考虑 Security

**Leafs** and **composites** must have different behavior;
consequently, they must be defined in different classes.
However, **composites** can store both other **composites** and **leafs** as nodes;
therefore, composites and leafs must have a common interface.

```java
public abstract class Node {
    protected final String description;

    public Node(String description) {
        this.description = description;
    }

    public abstract void print(int indentation);
}
```

```java
import java.text.NumberFormat;

public class Leaf extends Node {
    private final boolean required;
    private double amount = 0.0;

    public Leaf(String description, double amount, boolean required) {
        super(description);
        this.amount = amount;
        this.required = required;
    }

    @Override
    public void print(int indentation) {
        for (var i = 0; i < indentation; i++) {
            System.out.print("\t");
        }
        System.out.println(this);
    }

    @Override
    public String toString() {
        var prefix = required ? "(!) " : "( ) ";
        var tempAmount = NumberFormat.getCurrencyInstance().format(amount);
        return prefix + description + ": " + tempAmount;
    }
}
```

```java
import java.util.ArrayList;
import java.util.List;

public class Composite extends Node {
    private final List<Node> children = new ArrayList<>();

    public Composite(String description) {
        super(description);
    }

    // 注意：这是 Composite 特有的方法
    public void add(Node kid) {
        children.add(kid);
    }

    // 注意：这是 Composite 特有的方法
    public Node getChild(int index) {
        return children.get(index);
    }

    // 注意：这是 Composite 特有的方法
    public int getNumberChildNodes() {
        return children.size();
    }

    @Override
    public void print(int indentation) {
        for (var i = 0; i < indentation; i++) {
            System.out.print("\t");
        }
        System.out.println(this);
        children.forEach((node) -> {
            node.print(indentation + 1);
        });
    }

    @Override
    public String toString() {
        return description;
    }
}
```

```java
public class App {
    public static void main(String[] args) {
        final var root = new Composite("Budget book");
        final var january = new Composite("January");
        final var income = new Composite("Income");
        final var expenses = new Composite("Expenses");
        final var books = new Composite("Books");
        january.add(income);
        january.add(expenses);
        root.add(january);

        income.add(new Leaf("Main job", 1900.00, true));
        income.add(new Leaf("Side job", 200.00, true));

        expenses.add(books);
        expenses.add(new Leaf("rent", -600.00, true));
        books.add(new Leaf("Design Patterns", -29.9, true));
        books.add(new Leaf("trashy novel", -9.99, false));

        root.print(0);

        System.out.println("Only the expenses: ");
        expenses.print(0);
    }
}
```

```java
public class App2 {
    public static void main(String[] args) {
        final var root = new Composite("Budget book");
        final var january = new Composite("January");
        final var february = new Composite("February");

        final var income = new Composite("Income");
        final var expenses = new Composite("Expenses");
        final var books = new Composite("Books");
        january.add(income);
        january.add(expenses);
        root.add(january);

        income.add(new Leaf("Main job", 1900.00, true));
        income.add(new Leaf("Side job", 200.00, true));

        expenses.add(books);
        expenses.add(new Leaf("rent", -600.00, true));
        books.add(new Leaf("Design Patterns", -29.9, true));
        books.add(new Leaf("trashy novel", -9.99, false));

        print(root, 0);
    }

    private static void print(Node node, int indentation) {
        for (var i = 0; i < indentation; i++) {
            System.out.print("\t");
        }
        System.out.println(node);
        if (node instanceof Composite composite) {
            var numberChildren = composite.getNumberChildNodes();
            for (var j = 0; j < numberChildren; j++) {
                var childNode = composite.getChild(j);
                print(childNode, indentation + 1);
            }
        }
    }
}
```

## 第二种实现：考虑 Transparency

```java
public abstract class Node {
    protected final String description;

    public Node(String description) {
        this.description = description;
    }

    public Node getChild(int index) {
        throw new RuntimeException("No child nodes");
    }

    public int getNumberChildNodes() {
        return 0;
    }

    public abstract void print(int indentation);
}
```

```java
import java.text.NumberFormat;

public class Leaf extends Node {
    private final boolean required;
    private double amount = 0.0;

    public Leaf(String description, double amount, boolean required) {
        super(description);
        this.amount = amount;
        this.required = required;
    }

    @Override
    public void print(int indentation) {
        for (var i = 0; i < indentation; i++) {
            System.out.print("\t");
        }
        System.out.println(this);
    }

    @Override
    public String toString() {
        var prefix = required ? "(!) " : "( ) ";
        var tempAmount = NumberFormat.getCurrencyInstance().format(amount);
        return prefix + description + ": " + tempAmount;
    }
}
```

```java
import java.util.ArrayList;
import java.util.List;

public class Composite extends Node {
    private final List<Node> children = new ArrayList<>();

    public Composite(String description) {
        super(description);
    }

    public void add(Node kid) {
        children.add(kid);
    }

    public Node getChild(int index) {
        return children.get(index);
    }

    public int getNumberChildNodes() {
        return children.size();
    }

    @Override
    public void print(int indentation) {
        for (var i = 0; i < indentation; i++) {
            System.out.print("\t");
        }
        System.out.println(this);
        children.forEach((node) -> {
            node.print(indentation + 1);
        });
    }

    @Override
    public String toString() {
        return description;
    }
}
```

```java
public class App {
    public static void main(String[] args) {
        final var root = new Composite("Budget book");
        final var january = new Composite("January");
        final var february = new Composite("February");

        final var income = new Composite("Income");
        final var expenses = new Composite("Expenses");
        final var books = new Composite("Books");
        january.add(income);
        january.add(expenses);
        root.add(january);

        income.add(new Leaf("Main job", 1900.00, true));
        income.add(new Leaf("Side job", 200.00, true));

        expenses.add(books);
        expenses.add(new Leaf("rent", -600.00, true));
        books.add(new Leaf("Design Patterns", -29.9, true));
        books.add(new Leaf("trashy novel", -9.99, false));

        print(root, 0);
    }

    private static void print(Node node, int indentation) {
        for (var i = 0; i < indentation; i++) {
            System.out.print("\t");
        }
        System.out.println(node);
        for (var j = 0; j < node.getNumberChildNodes(); j++) {
            var childNode = node.getChild(j);
            print(childNode, indentation + 1);
        }
    }
}
```
