---
title: "Stage Bound - 位置、窗口大小、全屏"
sequence: "143"
---

## Setting the Bounds of a Stage

The bounds of a stage consist of four properties: `x`, `y`, `width`, and `height`.
The `x` and `y` properties determine the location (or position) of the upper-left corner of the stage.
The `width` and `height` properties determine its size.
In this section, you will learn how to position and size a stage on the screen.
You can use the getters and setters for these properties to get and set their values.

**When a stage does not have a scene and its position and size are not set explicitly,
its position and size are determined and set by the platform.**

```java
import javafx.application.Application;
import javafx.stage.Stage;

public class HelloFXApp extends Application {
    public static void main(String[] args) {
        Application.launch(args);
    }

    @Override
    public void start(Stage stage) throws Exception {
        stage.setTitle("Blank Stage");
        stage.show();
    }
}
```

When you run this code, you would see a window with the title bar, borders, and an empty area.
If other applications are open, you can see their content through the transparent area of the stage.
The position and size of the window are decided by the platform.

Let's modify the logic a bit.
Here, you will set an empty scene to the stage without setting the size of the scene.

```java
import javafx.application.Application;
import javafx.scene.Group;
import javafx.scene.Scene;
import javafx.stage.Stage;

public class HelloFXApp extends Application {
    public static void main(String[] args) {
        Application.launch(args);
    }

    @Override
    public void start(Stage stage) throws Exception {
        // scene
        Scene scene = new Scene(new Group());

        // stage
        stage.setTitle("Stage with an Empty Scene");
        stage.setScene(scene);
        stage.show();
    }
}
```

Notice that you have set a `Group` with no children nodes as the **root node** for the scene,
because you cannot create a scene without a root node.

The position and size of the stage are determined by the platform.
This time, the content area will have a **white background**,
because **the default background color for a scene is white**.

```java
import javafx.application.Application;
import javafx.scene.Group;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.stage.Stage;

public class HelloFXApp extends Application {
    public static void main(String[] args) {
        Application.launch(args);
    }

    @Override
    public void start(Stage stage) throws Exception {
        // sub node
        Button btn = new Button("Hello");

        // root node
        Group root = new Group(btn);

        // scene
        Scene scene = new Scene(root);

        // stage
        stage.setTitle("Stage with a Button in the Scene");
        stage.setScene(scene);
        stage.show();
    }
}
```

The position and size of the **stage** are determined by the computed size of the **scene**.
The content area of the stage is wide enough to show the title bar menus or the content of the scene, whichever is bigger.
The content area of the stage is tall enough to show the content of the scene, which in this case has only one button.
The stage is centered on the screen

Let's add another twist to the logic by adding a button to the scene and
set the scene width and height to 300 and 100, respectively:

```java
import javafx.application.Application;
import javafx.scene.Group;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.stage.Stage;

public class HelloFXApp extends Application {
    public static void main(String[] args) {
        Application.launch(args);
    }

    @Override
    public void start(Stage stage) throws Exception {
        // sub node
        Button btn = new Button("Hello");

        // root node
        Group root = new Group(btn);

        // scene
        Scene scene = new Scene(root, 300, 100);

        // stage
        stage.setTitle("Stage with a Sized Scene");
        stage.setScene(scene);
        stage.show();
    }
}
```

The position and size of the **stage** are determined by the specified size of the **scene**.
The content area of the stage is the same as the specified size of the scene.
The width of the stage includes the borders on the two sides,
and the height of the stage includes the height of the title bar and the bottom border.
The stage is centered on the screen.

Let's add one more twist to the logic.
You will set the size of the scene and the stage using the following code:

```java
import javafx.application.Application;
import javafx.scene.Group;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.stage.Stage;

public class HelloFXApp extends Application {
    public static void main(String[] args) {
        Application.launch(args);
    }

    @Override
    public void start(Stage stage) throws Exception {
        // sub node
        Button btn = new Button("Hello");

        // root node
        Group root = new Group(btn);

        // scene
        Scene scene = new Scene(root, 300, 100);

        // stage
        stage.setTitle("A Sized Stage with a Sized Scene");
        stage.setScene(scene);
        stage.setWidth(400);
        stage.setHeight(200);
        stage.show();
    }
}
```

The position and size of the stage are determined by the specified size of the stage.
The stage is centered on the screen.

The default centering of a stage centers it horizontally on the screen.
The `y` coordinate of the upper-left corner of the stage is
one-third of the height of the screen minus the height of the stage.
This is the logic used in the `centerOnScreen()` method in the `Window` class.

```java
import javafx.application.Application;
import javafx.geometry.Rectangle2D;
import javafx.scene.Group;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.stage.Screen;
import javafx.stage.Stage;

public class HelloFXApp extends Application {
    public static void main(String[] args) {
        Application.launch(args);
    }

    @Override
    public void start(Stage stage) throws Exception {
        // sub node
        Button btn = new Button("Hello");

        // root node
        Group root = new Group(btn);

        // scene
        Scene scene = new Scene(root, 300, 100);

        // stage
        stage.setTitle("A Truly Centered Stage");
        stage.setScene(scene);
        stage.show();

        // position
        Rectangle2D bounds = Screen.getPrimary().getVisualBounds();
        double x = bounds.getMinX() + (bounds.getWidth() - stage.getWidth()) / 2.0;
        double y = bounds.getMinY() + (bounds.getHeight() - stage.getHeight()) / 2.0;
        stage.setX(x);
        stage.setY(y);
    }
}
```

## Resizing a Stage

By default, a stage is resizable.

You can set whether a user can or cannot resize a stage by using its `setResizable(boolean resizable)` method.
Note that a call to the `setResizable()` method is a hint to the implementation to make the stage resizable.

Calling the `setResizable(false)` method on a `Stage` object prevents the user from resizing the stage.
You can still resize the stage programmatically.



Sometimes, you may want to restrict the use to resize a stage within a range of width and height.
The `setMinWidth()`, `setMinHeight()`, `setMaxWidth()`, and `setMaxHeight()` methods of the `Stage` class
let you set the range within which the user can resize a stage.

It is often required to open a window that takes up the entire screen space.
To achieve this, you need to set the position and size of the window to the available visual bounds of the screen.

```java
import javafx.application.Application;
import javafx.geometry.Rectangle2D;
import javafx.scene.Group;
import javafx.scene.Scene;
import javafx.stage.Screen;
import javafx.stage.Stage;

public class HelloFXApp extends Application {
    public static void main(String[] args) {
        Application.launch(args);
    }

    @Override
    public void start(Stage stage) throws Exception {
        Group root = new Group();

        Scene scene = new Scene(root, 300, 200);

        stage.setScene(scene);
        stage.setTitle("A Maximized Stage");

        // Set the position and size of the stage equal to the
        // position and size of the screen
        Rectangle2D visualBounds = Screen.getPrimary().getVisualBounds();
        stage.setX(visualBounds.getMinX());
        stage.setY(visualBounds.getMinY());
        stage.setWidth(visualBounds.getWidth());
        stage.setHeight(visualBounds.getHeight());

        stage.show();
    }
}
```

## Showing a Stage in Full-Screen Mode

The `Stage` class has a fullScreen property that specified whether a stage should be displayed in full-screen mode.

The implementation of full-screen mode depends on the platform and profile.
If the platform does not support full-screen mode,
the JavaFX runtime will simulate it by displaying the stage maximized and undecorated.

> 具体实现上的差异

A stage may enter full-screen mode by calling the `setFullScreen(true)` method.
When a stage enters full-screen mode, a brief message is displayed about how to exit the full-screen mode:
you will need to press the ESC key to exit full-screen mode.
You can exit full-screen mode programmatically by calling the `setFullScreen(false)` method.
Use the `isFullScreen()` method to check if a stage is in full-screen mode.

```java
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

public class HelloFXApp extends Application {
    public static void main(String[] args) {
        Application.launch(args);
    }

    @Override
    public void start(Stage stage) throws Exception {
        Button btnEnterFullScreen = new Button("进入全屏");
        btnEnterFullScreen.setOnAction(e -> stage.setFullScreen(true));

        Button btnExitFullScreen = new Button("退出全屏");
        btnExitFullScreen.setOnAction(e -> stage.setFullScreen(false));

        VBox root = new VBox();
        root.getChildren().addAll(btnEnterFullScreen, btnExitFullScreen);

        Scene scene = new Scene(root, 300, 200);

        stage.setScene(scene);
        stage.setTitle("A Maximized Stage");

        stage.show();
    }
}
```
