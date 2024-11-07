---
title: "001"
sequence: "113"
---

A JavaFX application is a class that must inherit from the `javafx.application.Application` class.

```java
import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.stage.Stage;

import java.io.IOException;

public class HelloApplication extends Application {
    @Override
    public void start(Stage stage) throws IOException {
        FXMLLoader fxmlLoader = new FXMLLoader(HelloApplication.class.getResource("hello-view.fxml"));
        Scene scene = new Scene(fxmlLoader.load(), 320, 240);
        stage.setTitle("Hello!");
        stage.setScene(scene);
        stage.show();
    }

    public static void main(String[] args) {
        launch();
    }
}
```

## Overriding the start() Method

The `start()` method is the entry point for a JavaFX application.
It is called by the JavaFX application launcher.

Notice that the `start()` method is passed an instance of the `Stage` class,
which is known as the **primary stage** of the application.
You can create more stages as necessary in your application.
However, the primary stage is always created by the JavaFX runtime for you. 

Every JavaFX application class must inherit from the `Application` class and
provide the implementation for the `start(Stage stage)` method.

## Showing the Stage

Similar to a stage in the real world, a JavaFX stage is used to display a scene.
A scene has visuals—such as text, shapes, images, controls, animations, and effects—with which the user may interact,
as is the case with all GUI-based applications.

In JavaFX, the primary stage is a container for a scene.
For example, if the application runs as a desktop application,
the primary stage will be a window with a title bar and an area to display the scene;
if the application runs an applet in a web browser,
the primary stage will be an embedded area in the browser window.

The primary stage created by the application launcher does not have a scene.

Use the `show()` method to show the stage.
Optionally, you can set a title for the stage using the `setTitle()` method.

```java
import javafx.application.Application;
import javafx.stage.Stage;

import java.io.IOException;

public class HelloApplication extends Application {
    @Override
    public void start(Stage stage) throws IOException {
        stage.setTitle("Hello!");
        stage.show();
    }

    public static void main(String[] args) {
        Application.launch(args);
    }
}
```

![](/assets/images/java/fx/example-stage-without-a-scene.png)

The main area of the window is empty.
This is the content area in which the stage will show its scene.
Because you do not have a scene for your stage yet, you will see an empty area.

## Launching the Application

You can use one of the following two options to run it:

- It is not necessary to have a `main()` method in the class to start a JavaFX application.
  When you run a Java class that inherits from the `Application` class,
  the java command launches the JavaFX application
  if the class being run does not contain the `main()` method.
- If you include a `main()` method in the JavaFX application class inside the `main()` method,
  call the `launch()` static method of the Application class to launch the application.
  The `launch()` method takes a `String` array as an argument,
  which are the parameters passed to the JavaFX application.

```java
public abstract class Application {
    public static void launch(String... args);
}
```

The `launch()` method of the `Application` class does not return
until all windows are closed or the application exits using the `Platform.exit()` method.
The `Platform` class is in the `javafx.application` package.

## Adding a Scene to the Stage

An instance of the `Scene` class, which is in the `javafx.scene` package, represents a scene.


A stage contains one scene, and a scene contains visual contents.

```text
stage --> scene --> visual contents
```

The contents of the scene are arranged in a tree-like hierarchy.
At the top of the hierarchy is the root node.
The root node may contain child nodes,
which in turn may contain their child nodes, and so on.
You must have a root node to create a scene.

```java
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.layout.VBox;
import javafx.scene.text.Text;
import javafx.stage.Stage;

import java.io.IOException;

public class HelloApplication extends Application {
    public static void main(String[] args) {
        Application.launch(args);
    }

    @Override
    public void start(Stage stage) throws IOException {
        Text txt = new Text("Hello JavaFX");

        VBox root = new VBox();
        root.getChildren().add(txt);

        Scene scene = new Scene(root, 300, 50);

        stage.setTitle("Hello!");
        stage.setScene(scene);
        stage.show();
    }
}
```

![](/assets/images/java/fx/example-txt-hello-javafx.png)

You will use a `VBox` as the root node. `VBox` stands for vertical box,
which arranges its children vertically in a column.

Any node that inherits from the `javafx.scene.Parent` class can be used as the root node for a scene.
Several nodes, known as layout panes or containers such as `VBox`, `HBox`, `Pane`, `FlowPane`, `GridPane`, or
`TilePane` can be used as a root node.
`Group` is a special container that groups its children together.

A node that can have children provides a `getChildren()` method
that returns an `ObservableList` of its children.
To add a child node to a node, simply `add` the child node to the ObservableList.

The `Scene` class contains several constructors.
You will use the one that lets you specify the **root node** and the size of the scene.

```text
                                                   ┌─── FlowPane
                                                   │
                                                   ├─── GridPane
                                                   │
                       ┌─── Region ───┼─── Pane ───┼─── TilePane
                       │                           │
                       │                           ├─── HBox
Node ───┼─── Parent ───┤                           │
                       │                           └─── VBox
                       │
                       └─── Group
```

## Improving the HelloFX Application

When a button is clicked, an `ActionEvent` is fired.
You can add an `ActionEvent` handler to handle the event.
Use the `setOnAction()` method to set an `ActionEvent` handler for the button.

```java
import javafx.application.Application;
import javafx.application.Platform;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

import java.io.IOException;

public class HelloApplication extends Application {
    public static void main(String[] args) {
        Application.launch(args);
    }

    @Override
    public void start(Stage stage) throws IOException {
        Label labelName = new Label("Enter your name:");

        TextField fieldName = new TextField();

        Label labelMsg = new Label();
        labelMsg.setStyle("-fx-text-fill:blue");

        Button btnHello = new Button("Say Hello");
        btnHello.setOnAction(e -> {
            String name = fieldName.getText();
            if (name.trim().length() > 0) {
                labelMsg.setText("Hello " + name);
            }
            else {
                labelMsg.setText("Hello there");
            }
        });

        Button btnExit = new Button("Exit");
        btnExit.setOnAction(e -> Platform.exit());

        VBox root = new VBox();
        // set the vertical spacing between children to 5px
        root.setSpacing(5);
        root.getChildren().addAll(labelName, fieldName, labelMsg, btnHello, btnExit);

        Scene scene = new Scene(root, 300, 150);

        stage.setTitle("JavaFX Application");
        stage.setScene(scene);
        stage.show();
    }
}
```

## Passing Parameters to a JavaFX Application

```java
import javafx.application.Application;
import javafx.scene.Group;
import javafx.scene.Scene;
import javafx.scene.control.TextArea;
import javafx.scene.text.Font;
import javafx.stage.Stage;

import java.io.IOException;
import java.util.Formatter;
import java.util.List;
import java.util.Map;

public class HelloApplication extends Application {
    public static void main(String[] args) {
        Application.launch(args);
    }

    @Override
    public void start(Stage stage) throws IOException {
        // Get application parameter
        Parameters parameters = this.getParameters();

        Map<String, String> namedParams = parameters.getNamed();
        List<String> unnamedParams = parameters.getUnnamed();
        List<String> rawParams = parameters.getRaw();

        StringBuilder sb = new StringBuilder();
        Formatter fm = new Formatter(sb);
        fm.format("Named   Parameters: %s%n", namedParams);
        fm.format("Unnamed Parameters: %s%n", unnamedParams);
        fm.format("Raw     Parameters: %s%n", rawParams);
        String strParams = sb.toString();

        TextArea textArea = new TextArea(strParams);
        //textArea.setStyle("-fx-font-family: 'Courier New'");
        textArea.setFont(Font.font("monospace"));
        Group root = new Group(textArea);

        Scene scene = new Scene(root);

        stage.setTitle("Application Parameters");
        stage.setScene(scene);
        stage.show();
    }
}
```











