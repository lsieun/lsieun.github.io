---
title: "ByteBuddy 类库介绍"
sequence: "101"
---

## 介绍

**ByteBuddy is a library for generating Java classes dynamically at run-time.**

ByteBuddy 的主要功能：在 JVM 的运行过程（run-time）中，ByteBuddy 可以动态的（dynamically）生成 Java 类（generating Java classes）。

### 项目信息

ByteBuddy 作者：Rafael Winterhalter

ByteBuddy 开始时间：2014 年

ByteBuddy 网站：

```text
https://bytebuddy.net/
```

ByteBuddy Github 地址:

```text
https://github.com/raphw/byte-buddy/
```

ByteBuddy Logo：

![](/assets/images/bytebuddy/byte-buddy-logo.png)

### 做什么

**instrumentation** to describe the bytecode generation, manipulation, and interception.

### 何时

With ByteBuddy,the **instrumentation** process can occur during **maven build time**, or **application runtime**.

## 类库比较

### 类库依赖

**Byte Buddy is written on top of ASM**, a mature and well-tested library for reading and writing compiled Java classes.

在这里我们希望大家意识到：ByteBuddy 并不是一个独立的类库，它需要依赖于 ASM 类库。

![](/assets/images/bytebuddy/bytebuddy-depends-on-asm.png)

### 调用关系

一般情况下，我们编写 `.java` 文件，然后使用编译器（`javac`）来生成 `.class` 文件：

![From Java to Class](/assets/images/java/javac-from-dot-java-to-dot-class.jpeg)

当我们使用 ByteBuddy 来生成 `.class` 文件时，其整体思路如下：

![](/assets/images/bytebuddy/java-bytebuddy-asm-classfile.png)

- 起点和终点：Java 语言是我们开始的起点，最终生成的 ClassFile（`.class`）是我们的终点
- 过程：我们使用 Java 语言调用 ByteBuddy 的 API；ByteBuddy 会进一步调用 ASM 的 API；最后，ASM 来负责生成真正的 `.class` 文件。

## 业务代码和非业务代码

Modern applications tend to be complex in nature
because the application needs to fulfill different type of requirements,
for example, **functional requirement** and **non-functional requirement**.
These applications contain multiple modules with each of them has their own functional code.
Because of the non-functional requirements, the functional code is surrounded by non-functional code,
for example, security processing, logging, performance monitoring, resource usage, tracing for pay-per-use billing,
DevOps related processing, and others.

```text
// calculatePrice method without non-functional code
public double calculatePrice() {
    double discount = getDiscount();
    return this.price + this.deliveryCharge - discount;
}
```

```text
// calculatePrice method with non-functional code

@Secure(authority="normalUser, premiumUser")
public double calculatePrice() {
    long startTime = System.currentMilliseconds();
    logger.info("Calculate price begin");
    // ---------------------------------------------------------------------------------
    double discount = getDiscount();
    double price = this.price + this.deliveryCharge - discount;
    // ---------------------------------------------------------------------------------
    logger.info("Calculate price end");
    perfLogger.info(
        "Calculate price execution time: " + 
        (System.currentMilliseconds() - startTime)
    );
    return price;
}
```

## 总结

本文内容总结如下：

- 第一点，ByteBuddy 的**主要功能**：ByteBuddy 可以动态的生成 Java 类。
- 第二点，ByteBuddy 的**工作流程**：Java --> ByteBuddy --> ASM --> ClassFile

