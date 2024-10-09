---
title: "Using Maven"
sequence: "102"
---

## pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>lsieun</groupId>
    <artifactId>learn-java-fx</artifactId>
    <version>1.0-SNAPSHOT</version>
    <name>learn-java-fx</name>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <java.fx.version>17.0.2</java.fx.version>
        <jfree.chart.version>2.0.1</jfree.chart.version>
        <junit.version>5.8.2</junit.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.openjfx</groupId>
            <artifactId>javafx-controls</artifactId>
            <version>${java.fx.version}</version>
        </dependency>
        <dependency>
            <groupId>org.openjfx</groupId>
            <artifactId>javafx-fxml</artifactId>
            <version>${java.fx.version}</version>
        </dependency>
        <dependency>
            <groupId>org.openjfx</groupId>
            <artifactId>javafx-media</artifactId>
            <version>${java.fx.version}</version>
        </dependency>
        <dependency>
            <groupId>org.openjfx</groupId>
            <artifactId>javafx-swing</artifactId>
            <version>${java.fx.version}</version>
        </dependency>
        <dependency>
            <groupId>org.openjfx</groupId>
            <artifactId>javafx-web</artifactId>
            <version>${java.fx.version}</version>
        </dependency>

        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter-api</artifactId>
            <version>${junit.version}</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter-engine</artifactId>
            <version>${junit.version}</version>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.9.0</version>
                <configuration>
                    <source>17</source>
                    <target>17</target>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.openjfx</groupId>
                <artifactId>javafx-maven-plugin</artifactId>
                <version>0.0.8</version>
                <executions>
                    <execution>
                        <!-- Default configuration for running with: mvn clean javafx:run -->
                        <id>default-cli</id>
                        <configuration>
                            <mainClass>lsieun.fx/lsieun.fx.HelloApplication</mainClass>
                            <launcher>app</launcher>
                            <jlinkZipName>app</jlinkZipName>
                            <jlinkImageName>app</jlinkImageName>
                            <noManPages>true</noManPages>
                            <stripDebug>true</stripDebug>
                            <noHeaderFiles>true</noHeaderFiles>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</project>
```

## module-info.java

```java
module lsieun.fx {
    requires java.desktop;
    requires jdk.jsobject;

    requires javafx.controls;
    requires javafx.fxml;
    requires javafx.graphics;
    requires javafx.media;
    requires javafx.swing;
    requires javafx.web;

    opens lsieun.fx to javafx.fxml,javafx.graphics,javafx.base;
    exports lsieun.fx;
}
```

## 示例

### 示例一

```java
import javafx.application.Application;
import javafx.stage.Stage;

public class HelloFXApp extends Application {
    public static void main(String[] args) {
        Application.launch(args);
    }

    @Override
    public void start(Stage stage) throws Exception {
        // Set a title for the stage
        stage.setTitle("Hello JavaFX Application");

        // Show the stage
        stage.show();
    }
}
```

### 示例二：显示文本

```java
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.layout.VBox;
import javafx.scene.text.Text;
import javafx.stage.Stage;

public class HelloFXApp extends Application {
    public static void main(String[] args) {
        Application.launch(args);
    }

    @Override
    public void start(Stage stage) throws Exception {
        // sub node
        Text msg = new Text("Hello JavaFX");

        // root node
        VBox root = new VBox();
        root.getChildren().add(msg);

        // scene
        Scene scene = new Scene(root, 300, 50);

        // stage
        stage.setScene(scene);
        stage.setTitle("Hello JavaFX Application");
        stage.show();
    }
}
```

### 示例三：点击按钮退出

```java
import javafx.application.Application;
import javafx.application.Platform;
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
        // sub node
        Button btnExit = new Button("退出");
        btnExit.setOnAction(e -> Platform.exit());

        // root node
        VBox root = new VBox();
        root.getChildren().add(btnExit);

        // scene
        Scene scene = new Scene(root, 300, 50);

        // stage
        stage.setScene(scene);
        stage.setTitle("Hello JavaFX Application");
        stage.show();
    }
}
```

其中，

```text
btnExit.setOnAction(e -> Platform.exit());
```

替换成：

```text
btnExit.setOnAction(new EventHandler<ActionEvent>() {
    @Override
    public void handle(ActionEvent event) {
        Platform.exit();
    }
});
```

### 示例四

```java
import javafx.application.Application;
import javafx.application.Platform;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

public class HelloFXApp extends Application {
    public static void main(String[] args) {
        Application.launch(args);
    }

    @Override
    public void start(Stage stage) throws Exception {
        // sub nodes
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


        // root node
        VBox root = new VBox();
        // set the vertical spacing between children to 5px
        root.setSpacing(5);
        root.getChildren().addAll(labelName, fieldName, labelMsg, btnHello, btnExit);


        // scene
        Scene scene = new Scene(root, 300, 150);


        // stage
        stage.setScene(scene);
        stage.setTitle("Hello JavaFX Application");
        stage.show();
    }
}
```

```text
                              ┌─── Application
          ┌─── application ───┤
          │                   └─── Platform
          │
          │                   ┌─── Scene
          │                   │
          │                   │               ┌─── Button
          │                   │               │
javafx ───┼─── scene ─────────┼─── control ───┼─── Label
          │                   │               │
          │                   │               └─── TextField
          │                   │
          │                   └─── layout ────┼─── VBox
          │
          │
          └─── stage ─────────┼─── Stage
```

## 示例五

```java
import javafx.application.Application;
import javafx.scene.Group;
import javafx.scene.Scene;
import javafx.scene.control.TextArea;
import javafx.scene.text.Font;
import javafx.stage.Stage;

import java.util.Formatter;
import java.util.List;
import java.util.Map;

public class HelloFXApp extends Application {
    public static void main(String[] args) {
        Application.launch(args);
    }

    @Override
    public void start(Stage stage) throws Exception {
        // get application parameter
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

        // sub nodes
        TextArea textArea = new TextArea(strParams);
        textArea.setFont(Font.font("monospace"));

        // root node
        Group root = new Group(textArea);

        // scene
        Scene scene = new Scene(root);

        // stage
        stage.setTitle("Application Parameters");
        stage.setScene(scene);
        stage.show();
    }
}
```

```text
          ┌─── application ───┼─── Application
          │
          │                   ┌─── Group
          │                   │
          │                   ├─── Scene
javafx ───┼─── scene ─────────┤
          │                   ├─── control ───┼─── TextArea
          │                   │
          │                   └─── text ──────┼─── Font
          │
          └─── stage ─────────┼─── Stage
```

```text
Tom Jerry
```

```text
Named   Parameters: {}
Unnamed Parameters: [Tom, Jerry]
Raw     Parameters: [Tom, Jerry]
```

```text
Tom Jerry width=200 height=100
```

```text
Named   Parameters: {}
Unnamed Parameters: [Tom, Jerry, width=200, height=100]
Raw     Parameters: [Tom, Jerry, width=200, height=100]
```

To pass a named parameter from the command line,
you need to precede the parameter with exactly two hyphens (`--`).
That is, a named parameter should be entered in the form:

```text
--key=value
```

```text
Tom Jerry --width=200 --height=100
```

```text
Named   Parameters: {width=200, height=100}
Unnamed Parameters: [Tom, Jerry]
Raw     Parameters: [Tom, Jerry, --width=200, --height=100]
```

