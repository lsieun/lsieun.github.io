---
title: "Application"
sequence: "902"
---

## Application

Every JavaFX application class inherits from the `Application` class.

## Application.launch

The `Application` class contains a static `launch()` method.
Its sole purpose is to launch a JavaFX application.

It is an overloaded method with the following two variants:

```java
public abstract class Application {
    public static void launch(Class<? extends Application> appClass, String... args) {
        LauncherImpl.launchApplication(appClass, args);
    }

    public static void launch(String... args) {
        //...
    }
}
```

### 创建对象

Notice that you do not create an object of your JavaFX application class to launch it.
The JavaFX runtime creates an object of your application class when the `launch()` method is called.

Your JavaFX application class must have a **no-args constructor**;
otherwise, a runtime exception will be thrown when an attempt is made to launch it.

### 什么时候结束

## Parameters

The `Parameters` class, which is a static inner class of the `Application` class,
encapsulates the parameters passed to a JavaFX application.
It divides parameters into three categories:

- Named parameters: `Map<String, String> getNamed()`
- Unnamed parameters: `List<String> getUnnamed()`
- Raw parameters: `List<String> getRaw()`

A raw parameters is a combination of named and unnamed parameters.

The `getParameters()` method of the `Application` class returns the reference of the `Application.Parameters` class.

### 获取时机

The reference to the `Parameters` class is available
in the `init()` method of the `Application` class and the code that executes afterward.

能够在`init()`或之后获取

The parameters are not available in the constructor of the application
as it is called before the `init()` method.
Calling the `getParameters()` method in the constructor returns `null`.

不能在构造方法中获取
