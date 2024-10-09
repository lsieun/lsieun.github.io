---
title: "Launching a JavaFX Application"
sequence: "103"
---

Every JavaFX application class inherits from the `Application` class.
The `Application` class is in the `javafx.application` package.
It contains a static `launch()` method.
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

Notice that you do not create an object of your JavaFX application class to launch it.
The JavaFX runtime creates an object of your application class when the `launch()` method is called.

Your JavaFX application class must have **a no-args constructor**,
otherwise a runtime exception will be thrown when an attempt is made to launch it.

Now that you know how to launch a JavaFX application,
it's time to learn the best practice in launching a JavaFX application:
limit the code in the `main()` method to only one statement
that launches the application.

```java
public class MyJavaFXApp extends Application {
    public static void main(String[] args) {
        Application.launch(args);

        // Do not add any more code in this method
    }

    // More code goes here
}
```

The `launch()` method of the `Application` class must be called only once,
otherwise, a runtime exception is thrown.
The call to the `launch()` method blocks until the application is terminated.
It is not always necessary to have a `main()` method to launch a JavaFX application.
A JavaFX packager synthesizes one for you.

