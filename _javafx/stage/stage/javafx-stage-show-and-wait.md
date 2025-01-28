---
title: "Stage ShowAndWait - 退出前询问"
sequence: "146"
---

## 退出前询问

```java
import javafx.application.Application;
import javafx.application.Platform;
import javafx.scene.Group;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.ButtonType;
import javafx.stage.Stage;

import java.util.Optional;

public class HelloFXApp extends Application {
    public static void main(String[] args) {
        Application.launch(args);
    }

    @Override
    public void start(Stage stage) throws Exception {
        Group root = new Group();
        Scene scene = new Scene(root, 400, 200);

        Platform.setImplicitExit(false);

        stage.setOnCloseRequest(event -> {
            event.consume();
            Alert alert = new Alert(Alert.AlertType.CONFIRMATION);
            alert.setTitle("退出程序");
            alert.setHeaderText(null);
            alert.setContentText("您是否要退出程序？");

            Optional<ButtonType> result = alert.showAndWait();
            if (result.isPresent() && result.get() == ButtonType.OK) {
                Platform.exit();
            }
        });

        stage.setScene(scene);
        stage.setTitle("Hello JavaFX");
        stage.show();
    }
}
```

## Showing a Stage and Waiting for It to Close

You often want to display a dialog box and suspend further processing until it is closed.
For example, you may want to display a message box to the user with options to click yes and no buttons,
and you want different actions performed based on which button is clicked by the user.

In this case, when the message box is displayed to the user,
the program must wait for it to close before it executes the next sequence of logic.
Consider the following pseudo-code:

```text
Option userSelection = messageBox("Close", "Do you want to exit?", YESNO);
if (userSelection == YES) {
       stage.close();
}
```

In this pseudo-code, when the `messageBox()` method is called,
the program needs to wait to execute the subsequent if statement until the message box is dismissed.

The `show()` method of the `Window` class returns immediately,
making it useless to open a dialog box in the preceding example.
You need to use the `showAndWait()` method,
which shows the stage and waits for it to close before returning to the caller.
The `showAndWait()` method stops processing the current event temporarily and
starts a nested event loop to process other events.

The `showAndWait()` method must be called on the **JavaFX Application Thread**.
It should not be called on the **primary stage** or a runtime exception will be thrown.

You can have multiple stages open using the `showAndWait()` method.
Each call to the method starts a new nested event loop.
A specific call to the method returns to the caller
when all nested event loops created after this method call have terminated.

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

    protected static int counter = 0;
    protected Stage lastOpenStage;

    @Override
    public void start(Stage stage) throws Exception {
        VBox root = new VBox();
        Button openButton = new Button("Open");
        openButton.setOnAction(e -> open(++counter));
        root.getChildren().add(openButton);
        Scene scene = new Scene(root, 400, 400);
        stage.setScene(scene);
        stage.setTitle("The Primary Stage");
        stage.show();

        this.lastOpenStage = stage;
    }

    private void open(int stageNumber) {
        Stage stage = new Stage();
        stage.setTitle("#" + stageNumber);

        Button sayHelloButton = new Button("Say Hello");
        sayHelloButton.setOnAction(e -> System.out.println("Hello from #" + stageNumber));

        Button openButton = new Button("Open");
        openButton.setOnAction(e -> open(++counter));

        VBox root = new VBox();
        root.getChildren().addAll(sayHelloButton, openButton);
        Scene scene = new Scene(root, 200, 200);
        stage.setScene(scene);
        stage.setX(this.lastOpenStage.getX() + 50);
        stage.setY(this.lastOpenStage.getY() + 50);
        this.lastOpenStage = stage;
        System.out.println("Before stage.showAndWait(): " + stageNumber);

        // Show the stage and wait for it to close
        stage.showAndWait();

        System.out.println("After stage.showAndWait(): " + stageNumber);
    }
}
```

JavaFX does not provide a built-in window that can be used as a dialog box
(a message box or a prompt window).
You can develop one by setting the appropriate **modality** for a stage and
showing it using the `showAndWait()` method.
