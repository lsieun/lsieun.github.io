---
title: "Binding Examples"
sequence: "124"
---

## Using Bindings to Center a Circle

```java
import javafx.application.Application;
import javafx.beans.binding.Bindings;
import javafx.scene.Group;
import javafx.scene.Scene;
import javafx.scene.shape.Circle;
import javafx.stage.Stage;

public class HelloFXApp extends Application {
    public static void main(String[] args) {
        Application.launch(args);
    }

    @Override
    public void start(Stage stage) throws Exception {
        // sub node
        Circle circle = new Circle();

        // root node
        Group root = new Group(circle);

        // scene
        Scene scene = new Scene(root, 300, 200);

        // binding
        circle.centerXProperty().bind(scene.widthProperty().divide(2));
        circle.centerYProperty().bind(scene.heightProperty().divide(2));
        circle.radiusProperty().bind(Bindings.min(scene.widthProperty(), scene.heightProperty()).divide(2));

        // stage
        stage.setTitle("JavaFX Application");
        stage.setScene(scene);
        stage.show();
    }
}
```

类关系图：

```text
          ┌─── application ───┼─── Application
          │
          ├─── beans ─────────┼─── binding ───┼─── Bindings
          │
          │                   ┌─── Group
javafx ───┤                   │
          ├─── scene ─────────┼─── Scene
          │                   │
          │                   └─── shape ───┼─── Circle
          │
          └─── stage ─────────┼─── Stage
```
