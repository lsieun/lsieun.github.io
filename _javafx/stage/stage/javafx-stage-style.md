---
title: "Stage Style - 样式、移动无标题窗口、透明度"
sequence: "144"
---

## Initializing the Style of a Stage

The area of a stage can be divided into two parts: **content area** and **decorations**.

The **content area** displays the visual content of its scene.
Typically, **decorations** consist of a title bar and borders.

The presence of a title bar and its content varies depending on the type of decorations provided by the platform.

Some decorations provide additional features rather than just an aesthetic look.
For example, a title bar may be used to drag a stage to a different location;
buttons in a title bar may be used to minimize, maximize, restore, and close a stage;
or borders may be used to resize a stage.

In JavaFX, the **style attribute** of a **stage** determines its **background color** and **decorations**.
Based on styles, you can have the following five types of stages in JavaFX:

- Decorated
- Undecorated
- Transparent
- Unified
- Utility

A **decorated** stage has a solid white background and platform decorations.
An **undecorated** stage has a solid white background and no decorations.
A **transparent** stage has a transparent background and no decorations.
A **unified** stage has platform decorations and no border between the client area and decorations;
the client area background is unified with the decorations.
To see the effect of the unified stage style,
the **scene** should be filled with `Color.TRANSPARENT`.
Unified style is a conditional feature.
A **utility** stage has a solid white background and minimal platform decorations.

The style of a stage specifies only its decorations.
The background color is controlled by its scene background, which is solid white by default.
If you set the style of a stage to `TRANSPARENT`,
you will get a stage with a solid white background, which is the background of the scene.
To get a truly **transparent** stage,
you will need to set the background color of the scene to `null` using its `setFill()` method.

You can set the style of a stage using the `initStyle(StageStyle style)` method of the `Stage` class.
The style of a stage must be set before it is shown for the first time.
Setting it the second time, after the stage has been shown, throws a runtime exception.
By default, a stage is decorated.

The five types of styles for a stage are defined as five constants in the `StageStyle` enum:

- StageStyle.DECORATED
- StageStyle.UNDECORATED
- StageStyle.TRANSPARENT
- StageStyle.UNIFIED
- StageStyle.UTILITY


```java
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.VBox;
import javafx.scene.paint.Color;
import javafx.stage.Stage;
import javafx.stage.StageStyle;

import static javafx.stage.StageStyle.*;

public class HelloFXApp extends Application {
    public static void main(String[] args) {
        Application.launch(args);
    }

    @Override
    public void start(Stage stage) throws Exception {
        // A label to display the style type
        Label styleLabel = new Label("Stage Style");

        // A button to close the stage
        Button btnClose = new Button("Close");
        btnClose.setOnAction(e -> stage.close());

        VBox root = new VBox();
        root.getChildren().addAll(styleLabel, btnClose);

        Scene scene = new Scene(root, 100, 70);

        stage.setScene(scene);
        // The title of the stage is not visible for all styles.
        stage.setTitle("The Style of a Stage");
        /* Uncomment one of the following statements at a time */
        this.show(stage, styleLabel, DECORATED);
//        this.show(stage, styleLabel, UNDECORATED);
//        this.show(stage, styleLabel, TRANSPARENT);
//        this.show(stage, styleLabel, UNIFIED);
//        this.show(stage, styleLabel, UTILITY);
    }

    private void show(Stage stage, Label styleLabel, StageStyle style) {
        // Set the text for the label to match the style
        styleLabel.setText(style.toString());

        // Set the style
        stage.initStyle(style);

        // For a transparent style, set the scene fill to null.
        // Otherwise, the content area will have the default white
        // background of the scene.
        if (style == TRANSPARENT) {
            stage.getScene().setFill(null);
            stage.getScene().getRoot().setStyle("-fx-background-color: transparent");
        }
        else if (style == UNIFIED) {
            stage.getScene().setFill(Color.TRANSPARENT);
        }

        // Show the stage
        stage.show();
    }
}
```

```text
          ┌─── application ───┼─── Application
          │
          │                   ┌─── Scene
          │                   │
          │                   │               ┌─── Button
          │                   ├─── control ───┤
          ├─── scene ─────────┤               └─── Label
javafx ───┤                   │
          │                   ├─── layout ────┼─── VBox
          │                   │
          │                   └─── paint ─────┼─── Color
          │
          │
          │                   ┌─── Stage
          └─── stage ─────────┤
                              └─── StageStyle
```

## Moving an Undecorated Stage

You can move a stage to a different location by dragging its title bar.

In an **undecorated** or **transparent** stage, a title bar is not available.
You need to write a few lines of code to let the user move this kind of stage by
dragging the mouse over the scene area.

If you change the stage to be **transparent**,
you will need to drag the stage by dragging the mouse over only the message label,
as the transparent area will not respond to the mouse events.

```java
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;
import javafx.stage.StageStyle;

public class HelloFXApp extends Application {
    public static void main(String[] args) {
        Application.launch(args);
    }

    private Stage stage;
    private double dragOffsetX;
    private double dragOffsetY;

    @Override
    public void start(Stage stage) throws Exception {
        // Store the stage reference in the instance variable to
        // use it in the mouse pressed event handler later.
        this.stage = stage;

        Label msgLabel = new Label("Press the mouse button and drag.");
        Button closeButton = new Button("Close");
        closeButton.setOnAction(e -> stage.close());

        VBox root = new VBox();
        root.getChildren().addAll(msgLabel, closeButton);

        Scene scene = new Scene(root, 300, 200);

        // Set mouse pressed and dragged even handlers for the scene
        scene.setOnMousePressed(e -> handleMousePressed(e));
        scene.setOnMouseDragged(e -> handleMouseDragged(e));

        stage.setScene(scene);
        stage.setTitle("Moving a Stage");
        stage.initStyle(StageStyle.UNDECORATED);
        stage.show();
    }

    protected void handleMousePressed(MouseEvent e) {
        // Store the mouse x and y coordinates with respect to the
        // stage in the reference variables to use them in the
        // drag event
        this.dragOffsetX = e.getScreenX() - stage.getX();
        this.dragOffsetY = e.getScreenY() - stage.getY();
    }

    protected void handleMouseDragged(MouseEvent e) {
        // Move the stage by the drag amount
        stage.setX(e.getScreenX() - this.dragOffsetX);
        stage.setY(e.getScreenY() - this.dragOffsetY);
    }
}
```

```text
          ┌─── application ───┼─── Application
          │
          │                   ┌─── Scene
          │                   │
          │                   │               ┌─── Button
          │                   ├─── control ───┤
          ├─── scene ─────────┤               └─── Label
javafx ───┤                   │
          │                   ├─── input ─────┼─── MouseEvent
          │                   │
          │                   └─── layout ────┼─── VBox
          │
          │
          │                   ┌─── Stage
          └─── stage ─────────┤
                              └─── StageStyle
```

## Setting the Opacity of a Stage

The opacity of a stage determines how much you can see through the stage.
You can set the opacity of a stage using the `setOpacity(double opacity)` method of the `Window` class.
Use the `getOpacity()` method to get the current opacity of a stage.

The opacity value ranges from `0.0` to `1.0`.
Opacity of `0.0` means the stage is fully translucent;
opacity of `1.0` means the stage is fully opaque.

Opacity affects the entire area of a stage, including its decorations.  
Not all JavaFX runtime platforms are required to support opacity.
Setting opacity on the JavaFX platforms that do not support opacity has no effect.
The following snippet of code sets the opacity of a stage to half-translucent:

```text
Stage stage = new Stage();
stage.setOpacity(0.5); // A half-translucent stage
```