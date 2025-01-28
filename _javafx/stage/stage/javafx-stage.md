---
title: "舞台（Stage）"
sequence: "142"
---

A **stage** in JavaFX is a top-level container that hosts a **scene**, which consists of visual elements.

> 从概念上来说，stage是一个container，用来存放scene

The `Stage` class in the `javafx.stage` package represents a stage in a JavaFX application.

> 从API的角度来说，stage体现为Stage类

The **primary stage** is created by the platform and passed to the `Application.start(Stage primaryStage)` method.

> 从JVM运行的角度来说，primary stage是由platform创建的

You can create additional stages as needed.

> 从JVM运行的角度来说，我们也可以自己添加stage

## 类继承关系

The `Stage` inherits from the `Window` class.

```text
          ┌─── Stage
          │
Window ───┤                   ┌─── Popup
          │                   │
          └─── PopupWindow ───┤
                              │                    ┌─── ContextMenu
                              └─── PopupControl ───┤
                                                   └─── Tooltip
```

The `Window` class is the superclass for several window-line container classes.
It contains the basic functionalities that are common to all types of windows
(e.g., methods to show and hide the window;
set x, y, width, and height properties;
set the opacity of the window; etc.).

The `Window` class defines x, y, width, height, and opacity properties.
It has `show()` and `hide()` methods to show and hide a window, respectively.

The `setScene()` method of the `Window` class sets the scene for a window.

The `Stage` class defines a `close()` method,
which has the same effect as calling the `hide()` method of the `Window` class.

## 线程

A `Stage` object must be created and modified on the **JavaFX Application Thread**.
Recall that the `Application.start()` method is called on the **JavaFX Application Thread**,
and a **primary Stage** is created and passed to this method.

Note that the **primary stage** that is passed the `start()` method is not shown.
You need to call the `show()` method to show it.


## Primary Stage

### Showing the Primary Stage

The `start()` method has no code.
When you run the application, you do not see a window, nor do you see output on the console.
**The application runs forever.**

```java
import javafx.application.Application;
import javafx.stage.Stage;

public class HelloFXApp extends Application {
    public static void main(String[] args) {
        Application.launch(args);
    }

    @Override
    public void start(Stage stage) throws Exception {
        // Do not write any code here
    }
}
```

Recall that the **JavaFX Application Thread** is terminated when the `Platform.exit()` method is called
or the last shown stage is closed.
The JVM terminates when all non-daemon threads die.
The **JavaFX Application Thread** is a non-daemon thread.
The `Application.launch()` method returns when the **JavaFX Application Thread** terminates.
In the preceding example, there is no way to terminate the **JavaFX Application Thread**.
**This is the reason the application runs forever.**

You will need to use the system-specific keys to cancel the application.
If you are using Windows, use your favorite key combination `Ctrl + Alt + Del` to activate the task manager!
If you are using the command prompt, use `Ctrl + C`.

Using the `Platform.exit()` method in the `start()` method will fix the problem.

```java
import javafx.application.Application;
import javafx.application.Platform;
import javafx.stage.Stage;

public class HelloFXApp extends Application {
    public static void main(String[] args) {
        Application.launch(args);
    }

    @Override
    public void start(Stage stage) throws Exception {
        Platform.exit(); // Exit the application
    }
}
```

Let's try to fix the ever-running program by closing the **primary stage**.
You have only one stage when the `start()` method is called,
and closing it should terminate the **JavaFX Application Thread**.
Let's modify the `start()` method:

```java
import javafx.application.Application;
import javafx.stage.Stage;

public class HelloFXApp extends Application {
    public static void main(String[] args) {
        Application.launch(args);
    }

    @Override
    public void start(Stage stage) throws Exception {
        stage.close(); // Close the only stage you have
    }
}
```

Even with this code for the `start()` method, the App runs forever.
The `close()` method does not close the stage if the stage is not showing.
The primary stage was never shown.
Therefore, adding a `stage.close()` call to the `start()` method did not do any good.

The following code for the `start()` method would work.
However, this will cause the screen to flicker as the stage is shown and closed:

```java
import javafx.application.Application;
import javafx.stage.Stage;

public class HelloFXApp extends Application {
    public static void main(String[] args) {
        Application.launch(args);
    }

    @Override
    public void start(Stage stage) throws Exception {
        stage.show();  // First show the stage
        stage.close(); // Now close it
    }
}
```

The `close()` method of the `Stage` class has the same effect
as calling the `hide()` method of the `Window` class.
The JavaFX API documentation does not mention that
**attempting to close a not showing window has no effect.**


