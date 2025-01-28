---
title: "工厂模式"
sequence: "102"
---

A factory is a class that creates objects of a prototype class, aka interface, from a method call:

![](/assets/images/design-pattern/creational/factory-method-instance.jpg)

The factory pattern is good when we want to create objects of a common interface
while hiding the creation logic from the user.

Factory, Factory Method and Abstract Factory design pattern
all does the same thing - **takes care of object creation but differs in how they do it.**

These are major differences between Factory, Factory Method and Abstract Factory:

- Factory — Consists of Factory Class which can produce one or more types of objects.
- Factory Method — Consists of a Factory Class with a Create Method which can produce only one kind of objects.
- Abstract Factory — Creates abstraction of Factory Class using interface, which can produce different kind of objects.

![](/assets/images/design-pattern/diagrams/factory-method-structure.png)

![](/assets/images/design-pattern/diagrams/abstract-factory-structure.png)


## Simple Factory

### 抽象的产品

```java
public class Operation {
    private double left;
    private double right;

    public double getLeft() {
        return left;
    }

    public void setLeft(double left) {
        this.left = left;
    }

    public double getRight() {
        return right;
    }

    public void setRight(double right) {
        this.right = right;
    }

    public double getResult() {
        double result = 0;
        return result;
    }
}
```

### 具体的产品

```java
// 没有 public 标识，是为了避免暴露具体的对象
class OperationAddImpl extends Operation {
    @Override
    public double getResult() {
        return getLeft() + getRight();
    }
}
```

```java
class OperationSubImpl extends Operation {
    @Override
    public double getResult() {
        return getLeft() - getRight();
    }
}
```

```java
class OperationMulImpl extends Operation {
    @Override
    public double getResult() {
        return getLeft() * getRight();
    }
}
```

```java
class OperationDivImpl extends Operation {
    @Override
    public double getResult() {
        double left = getLeft();
        double right = getRight();
        if (right == 0) {
            return Double.NaN;
        }
        return left / right;
    }
}
```

### 简单工厂

```java
public class FactoryOfOperation {
    public static Operation createOperate(String op) {
        Operation instance = null;
        switch (op) {
            case "+": {
                // 隐藏细节：将创建“具体产品”的细节隐藏在这里
                instance = new OperationAddImpl();
                break;
            }
            case "-": {
                instance = new OperationSubImpl();
                break;
            }
            case "*": {
                instance = new OperationMulImpl();
                break;
            }
            case "/": {
                instance = new OperationDivImpl();
                break;
            }
            // 扩展：如果新增一个操作，就需要修改代码
        }
        return instance;
    }
}
```

### 客户端

在客户端程序中，只会看到 `Operation` 和 `FactoryOfOperation`，
而不会看到 `OperationAddImpl` 等具体的实现类的创建细节。

```java
public class OperationRunner {
    public static void main(String[] args) {
        Operation instance = FactoryOfOperation.createOperate("+");
        instance.setLeft(10);
        instance.setRight(5);
        double result = instance.getResult();
        System.out.println("result = " + result);
    }
}
```

## Factory Method Pattern

## Abstract Factory Pattern

**This pattern is commonly used when we start using the Factory Method Pattern,
and we need to evolve our system to a more complex system.
It centralizes the product creation code in one place.**

## Reference

- [The Factory Design Pattern in Java](https://www.baeldung.com/java-factory-pattern)
- [Factory Method vs. Factory vs. Abstract Factory](https://www.baeldung.com/cs/factory-method-vs-factory-vs-abstract-factory)
- [Factory vs Factory Method vs Abstract Factory](https://medium.com/bitmountn/factory-vs-factory-method-vs-abstract-factory-c3adaeb5ac9a)
