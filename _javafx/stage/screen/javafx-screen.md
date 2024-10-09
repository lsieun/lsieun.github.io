---
title: "显示屏幕（Screen）"
sequence: "141"
---

The `Screen` class in the javafx.stage package is used to get the details,
for example, dots-per-inch (DPI) setting and dimensions of user screens (or monitors).

```text
                             ┌─── getPrimary()
                             │
          ┌─── static ───────┼─── getScreens()
          │                  │
          │                  └─── getScreensForRectangle()
Screen ───┤
          │                  ┌─── dpi ──────┼─── getDpi()
          │                  │
          │                  │              ┌─── getBounds()
          └─── non-static ───┼─── bounds ───┤
                             │              └─── getVisualBounds()
                             │
                             │              ┌─── getOutputScaleX()
                             └─── scale ────┤
                                            └─── getOutputScaleY()
```

## 何时可用

Although it is not mentioned in the API documentation for the `Screen` class,
you cannot use this class until the JavaFX launcher has started.
That is, you cannot get screen descriptions in a non-JavaFX application.
This is the reason that you would write the code in the `start()` method of a JavaFX application class.
There is no requirement that the `Screen` class needs to be used on the **JavaFX Application Thread**.
You could also write the same code in the `init()` method of your class.

## 静态方法-获取实例

### 多个屏幕

If multiple screens are hooked up to a computer,
one of the screens is known as the **primary screen** and others as **nonprimary screens**.

You can get the reference of the `Screen` object for the primary monitor
using the static `getPrimary()` method of the `Screen` class with the following code:

```text
// Get the reference to the primary screen
Screen primaryScreen = Screen.getPrimary();
```

The static `getScreens()` method returns an `ObservableList` of `Screen` objects:

```text
ObservableList<Screen> screenList = Screen.getScreens();
```

## 非静态方法-如何使用

### 分辨率

You can get the resolution of a screen in DPI using the `getDpi()` method of the `Screen` class as follows:

```text
Screen primaryScreen = Screen.getPrimary();
double dpi = primaryScreen.getDpi();
```

### Bounds

You can use the `getBounds()` and `getVisualBounds()` methods to get the bounds and visual bounds, respectively.
Both methods return a `Rectangle2D` object,
which encapsulates the (x, y) coordinates of the upper-left and the lower-right corners, the width, and the height of a rectangle.

- The `getMinX()` and `getMinY()` methods return the `x` and `y` coordinates of the upper-left corner of the rectangle, respectively.
- The `getMaxX()` and `getMaxY()` methods return the `x` and `y` coordinates of the lower-right corner of the rectangle, respectively.
- The `getWidth()` and `getHeight()` methods return the width and height of the rectangle, respectively.

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
        Screen primaryScreen = Screen.getPrimary();
        double dpi = primaryScreen.getDpi();
        System.out.println(dpi);

        Rectangle2D bounds = primaryScreen.getBounds();
        System.out.println(bounds);

        Rectangle2D visualBounds = primaryScreen.getVisualBounds();
        System.out.println(visualBounds);

        // root node
        Group root = new Group();

        // scene
        Scene scene = new Scene(root, 300, 200);

        // stage
        stage.setTitle("JavaFX Application");
        stage.setScene(scene);
        stage.show();
    }
}
```

```text
          ┌─── application ───┼─── Application
          │
          ├─── geometry ──────┼─── Rectangle2D
          │
          │                   ┌─── Group
javafx ───┼─── scene ─────────┤
          │                   └─── Scene
          │
          │
          │                   ┌─── Screen
          └─── stage ─────────┤
                              └─── Stage
```

```text
96.0
Rectangle2D [minX = 0.0, minY=0.0, maxX=1920.0, maxY=1080.0, width=1920.0, height=1080.0]
Rectangle2D [minX = 0.0, minY=0.0, maxX=1920.0, maxY=1050.0, width=1920.0, height=1050.0]
```

The **bounds** of a screen cover the area that is available on the screen.
The **visual bounds** represent the area on the screen that is available for use,
after taking into account the area used by the native windowing system such as task bars and menus.
Typically, but not necessarily, the **visual bounds** of a screen represent a smaller area than its **bounds**.

```java
import javafx.application.Application;
import javafx.application.Platform;
import javafx.collections.ObservableList;
import javafx.geometry.Rectangle2D;
import javafx.stage.Screen;
import javafx.stage.Stage;

public class HelloFXApp extends Application {
    public static void main(String[] args) {
        Application.launch(args);
    }

    @Override
    public void start(Stage stage) throws Exception {
        ObservableList<Screen> screenList = Screen.getScreens();
        System.out.println("Screens Count: " + screenList.size());

        // Print the details of all screens
        for (Screen screen : screenList) {
            print(screen);
        }

        Platform.exit();
    }

    public void print(Screen s) {
        System.out.println("DPI: " + s.getDpi());

        System.out.println("Screen Bounds: ");
        Rectangle2D bounds = s.getBounds();
        System.out.println(bounds);

        System.out.println("Screen Visual Bounds: ");
        Rectangle2D visualBounds = s.getVisualBounds();
        System.out.println(visualBounds);
        System.out.println("--------- --------- ---------");
    }
}
```

If a desktop spans multiple screens,
the bounds of the nonprimary screens are relative to the primary screen.
For example, if a desktop spans two screens with
the `(x, y)` coordinates of the upper-left corner of the primary screen at `(0, 0)` and its width `1600`,
the coordinates of the upper-left corner of the second screen would be `(1600, 0)`.

```text
Screens Count: 2
DPI: 96.0
Screen Bounds: 
Rectangle2D [minX = 0.0, minY=0.0, maxX=1920.0, maxY=1080.0, width=1920.0, height=1080.0]
Screen Visual Bounds: 
Rectangle2D [minX = 0.0, minY=0.0, maxX=1920.0, maxY=1050.0, width=1920.0, height=1050.0]
--------- --------- ---------
DPI: 96.0
Screen Bounds: 
Rectangle2D [minX = -1920.0, minY=0.0, maxX=0.0, maxY=1080.0, width=1920.0, height=1080.0]
Screen Visual Bounds: 
Rectangle2D [minX = -1920.0, minY=0.0, maxX=0.0, maxY=1080.0, width=1920.0, height=1080.0]
--------- --------- ---------
```

