---
title: "加载：ClassLoader 继承体系"
sequence: "102"
---

## Class And Data

- Class represents code. Data represents state.
- State often change, code mostly not.
- Class + State = Instance
- Once a class is loaded in JVM, the same class (?) will not be loaded.
- Same class concept
  - (C1, P1, K1) != (C1, P1, K2)

```text
C = classloader
P = package
K = Class
```

## 类加载体系（公司运营模式 -JVM）

```text
Bootstrap ClassLoader ---> Ext ClassLoader ---> App ClassLoader
```

- Directory: 分别加载哪些 Jar 包呢？
- Runtime: 与哪些 property 相关呢？例如：`java.class.path`

## 双亲委派 Parent Delegation


## JDK 的类加载对象（家族继承 -Java API）

```text
java.lang.ClassLoader ---> SecureClassLoader ---> URLClassLoader ---> ExtClassLoader,AppClassLoader
```

父亲和儿子在同一个企业工作，

## 自定义类加载器

## ClassLoader 三个阶段

- Loading
- Linking
  - Verify
  - Prepare
  - Resolve
- Initialization

## Bootstrap class loader

Bootstrap class loader (primordial class loader)

- Special class loader
- VM runs without verification
- Access to the repository of “trusted classes”
- Native implementation
- `<JAVA_HOME>/jre/lib` (`rt.jar`, `i18n.jar`)

## Extension class loader

Extension class loader

- Loads the code in the extension directories
- `<JAVA_HOME>/jre/lib/ext`
- `-Djava.ext.dir`
- Java implementation - `sun.misc.Launcher$ExtClassLoader`

## Application class loader

Application class loader

- Loads the code found in `java.class.path` which maps to `CLASSPATH`.
- Java implementation - `sun.misc.Launcher$AppClassLoader`

## JarLoader

## 热加载

## 打破双亲委派

## 多版本共存

## SPI 多版本加载

Tomcat 加载不同 webapp 类的方式是什么？

