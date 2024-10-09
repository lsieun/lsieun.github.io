---
title: "The Life Cycle of a JavaFX Application"
sequence: "105"
---

## Life Cycle

During the lifetime of a JavaFX application,
the JavaFX runtime calls the following methods of the specified JavaFX Application class in order:

- The no-args constructor
- The `init()` method
- The `start()` method
- The `stop()` method

```java
public abstract class Application {
    public void init() throws Exception {
    }

    public abstract void start(Stage primaryStage) throws Exception;

    public void stop() throws Exception {
    }
}
```

```java
import javafx.application.Application;
import javafx.scene.Group;
import javafx.scene.Scene;
import javafx.stage.Stage;

import java.io.IOException;

public class HelloApplication extends Application {
    public static void main(String[] args) {
        Application.launch(args);
    }

    public HelloApplication() {
        String name = Thread.currentThread().getName();
        String message = String.format("%20s: %s", "Constructor Thread", name);
        System.out.println(message);
    }

    @Override
    public void init() throws Exception {
        String name = Thread.currentThread().getName();
        String message = String.format("%20s: %s", "init() Thread", name);
        System.out.println(message);
    }

    @Override
    public void start(Stage stage) throws IOException {
        String name = Thread.currentThread().getName();
        String message = String.format("%20s: %s", "start() Thread", name);
        System.out.println(message);

        Scene scene = new Scene(new Group(), 300, 200);

        stage.setTitle("JavaFX Application Life Cycle");
        stage.setScene(scene);
        stage.show();
    }

    @Override
    public void stop() throws Exception {
        String name = Thread.currentThread().getName();
        String message = String.format("%20s: %s", "stop() Thread", name);
        System.out.println(message);
    }
}
```

输出结果：

```text
Constructor Thread: JavaFX Application Thread
     init() Thread: JavaFX-Launcher
    start() Thread: JavaFX Application Thread
     stop() Thread: JavaFX Application Thread
```

## Thread

### Two Threads

JavaFX runtime creates several threads.
At different stages in the application, threads are used to perform different tasks.

> JavaFX runtime创建不同的thread，每个thread有不同的作用。

与`Application`类的生命周期（Life Cycle）相关的线程有两个：

- JavaFX-Launcher
- JavaFX Application Thread

```text
                  ┌─── JavaFX-Launcher Thread
JavaFX runtime ───┤
                  └─── JavaFX Application Thread
```

这两个Thread由`Application.launch()`方法所创建。

### Thread + Life Cycle

```java
import javafx.application.Application;
import javafx.scene.Group;
import javafx.scene.Scene;
import javafx.stage.Stage;

public class HelloFXApp extends Application {
    public static void main(String[] args) {
        Application.launch(args);
    }

    public HelloFXApp() {
        String name = Thread.currentThread().getName();
        String message = String.format("%20s: %s", "Constructor Thread", name);
        System.out.println(message);
    }

    @Override
    public void init() throws Exception {
        String name = Thread.currentThread().getName();
        String message = String.format("%20s: %s", "init() Thread", name);
        System.out.println(message);
    }

    @Override
    public void start(Stage stage) throws Exception {
        String name = Thread.currentThread().getName();
        String message = String.format("%20s: %s", "start() Thread", name);
        System.out.println(message);

        Scene scene = new Scene(new Group(), 300, 200);

        stage.setTitle("JavaFX Application Life Cycle");
        stage.setScene(scene);
        stage.show();
    }

    @Override
    public void stop() throws Exception {
        String name = Thread.currentThread().getName();
        String message = String.format("%20s: %s", "stop() Thread", name);
        System.out.println(message);
    }
}
```

```text
  Constructor Thread: JavaFX Application Thread
       init() Thread: JavaFX-Launcher
      start() Thread: JavaFX Application Thread
       stop() Thread: JavaFX Application Thread
```

```text
                  ┌─── JavaFX-Launcher Thread ──────┼─── init()
                  │
JavaFX runtime ───┤                                 ┌─── constructor()
                  │                                 │
                  └─── JavaFX Application Thread ───┼─── start()
                                                    │
                                                    └─── stop()
```

The JavaFX runtime creates an object of the specified `Application` class on the **JavaFX Application Thread**.
The **JavaFX Launcher Thread** calls the `init()` method of the specified `Application` class.
The **JavaFX Application Thread** calls the `start(Stage stage)` method of the specified `Application` class.

At this point, the `launch()` method waits for the JavaFX application to finish.
When the application finishes, the **JavaFX Application Thread** calls the `stop()` method of the specified Application class.


### JavaFX Launcher Thread

It is not allowed to create a `Stage` or a `Scene` on the **JavaFX Launcher Thread**.
They must be created on the **JavaFX Application Thread**.
Therefore, you cannot create a `Stage` or a `Scene` inside the `init()` method.
Attempting to do so throws a runtime exception.
It is fine to create UI controls, for example, buttons or shapes.

### JavaFX Application Thread

In JavaFX, event queues are managed by a single, operating system–level thread called **JavaFX Application Thread**.
All user input events are dispatched on the **JavaFX Application Thread**.
JavaFX requires that a live scene graph must be modified only on the **JavaFX Application Thread**.



