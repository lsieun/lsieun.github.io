---
title: "Understanding Group"
sequence: "103"
---

A `Group` has features of a container;
for example, it has its own layout policy and coordinate system,
and it is a subclass of the `Parent` class.

```text
                       ┌─── Group
                       │
                       │                           ┌─── HBox
                       │                           │
                       │                           ├─── VBox
Node ───┼─── Parent ───┤                           │
                       │                           ├─── BorderPane
                       │                           │
                       │                           ├─── StackPane
                       │                           │
                       └─── Region ───┼─── Pane ───┼─── TextFlow
                                                   │
                                                   ├─── AnchorPane
                                                   │
                                                   ├─── TilePane
                                                   │
                                                   ├─── GridPane
                                                   │
                                                   └─── FlowPane
```

However, its meaning is best reflected by calling it **a collection of nodes or a group**, rather than a container.
It is used to manipulate a collection of nodes as a single node (or as a group).
**Transformations**, **effects**, and **properties** applied to a `Group` are applied to all nodes in the Group.

A Group has its own layout policy, which does not provide any specific layout to its children,
except giving them their preferred size:

- 样式。It renders nodes in the order they are added.
- 位置。It does not position its children. All children are positioned at (0, 0) by default.
  You need to write code to position child nodes of a Group.
  Use the `layoutX` and `layoutY` properties of the children nodes to position them within the Group.
- 大小。By default, it resizes all its children to their preferred size.
  The auto-sizing behavior can be disabled by setting its `autoSizeChildren` property to `false`.
  Note that if you disable the auto-sizing property, all nodes, except shapes,
  will be invisible as their size will be zero, by default.

A `Group` does not have a size of its own.
It is not resizable directly.
Its size is the collective bounds of its children.
Its bounds change, as the bounds of any or all of its children change.

> Group本身没有大小的概念，是依赖于它的children来决定大小。

## Creating a Group Object

You can use the no-args constructor to create an empty Group:

```text
Group emptyGroup = new Group();
```

Other constructors of the `Group` class let you add children to the `Group`.
One constructor takes a `Collection<Node>` as the initial children;
another takes a var-args of the `Node` type.

```text
Button smallBtn = new Button("Small Button");
Button bigBtn = new Button("This is a big button");

// Create a Group with two buttons using its var-args constructor
Group group1 = new Group(smallBtn, bigBtn);

List<Node> initialList = new ArrayList<>();
initailList.add(smallBtn);
initailList.add(bigBtn);

// Create a Group with all Nodes in the initialList as its children
Group group2 = new Group(initailList);
```

## Rendering Nodes in a Group

Children of a `Group` are rendered in the order they are added.

```text
Button smallBtn = new Button("Small button");
Button bigBtn = new Button("This is a big button");
Group root = new Group();
root.getChildren().addAll(smallBtn, bigBtn);
Scene scene = new Scene(root);
```

## Positioning Nodes in a Group

You can position child nodes in a `Group` by assigning them absolute positions using the `layoutX` and `layoutY`
properties of the nodes.
Alternatively, you can use the binding API to position them relative to other nodes in the `Group`.

```java
import javafx.application.Application;
import javafx.beans.binding.NumberBinding;
import javafx.scene.Group;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.stage.Stage;

public class NodesLayoutInGroup extends Application {
	public static void main(String[] args) {
		Application.launch(args);
	}

	@Override
	public void start(Stage stage) {
		// Create two buttons
		Button okBtn = new Button("OK");
		Button cancelBtn = new Button("Cancel");

		// Set the location of the OK button
		okBtn.setLayoutX(10);
		okBtn.setLayoutY(10);

		// Set the location of the Cancel botton relative to the OK button 		
		NumberBinding layoutXBinding = 
			okBtn.layoutXProperty().add(okBtn.widthProperty().add(10));
		cancelBtn.layoutXProperty().bind(layoutXBinding);
		cancelBtn.layoutYProperty().bind(okBtn.layoutYProperty());

		Group root = new Group();
		root.getChildren().addAll(okBtn, cancelBtn);

		Scene scene = new Scene(root);
		stage.setScene(scene);
		stage.setTitle("Positioning Nodes in a Group");
		stage.show();
	}
}
```

## Applying Effects and Transformations to a Group

When you apply effects and transformations to a `Group`, they are automatically applied to all of its children.
Setting a property, for example, the disable or opacity property, on a `Group`,
sets the property on all of its children.

```java
import javafx.application.Application;
import javafx.scene.Group;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.effect.DropShadow;
import javafx.stage.Stage;

public class GroupEffect extends Application {
    public static void main(String[] args) {
        Application.launch(args);
    }

    @Override
    public void start(Stage stage) {
        // Create two buttons
        Button okBtn = new Button("OK");
        Button cancelBtn = new Button("Cancel");

        // Set the locations of the buttons
        okBtn.setLayoutX(10);
        okBtn.setLayoutY(10);
        cancelBtn.setLayoutX(80);
        cancelBtn.setLayoutY(10);

        Group root = new Group();
        root.setEffect(new DropShadow()); // Set a drop shadow effect
        root.setRotate(10);               // Rotate by 10 degrees clockwise
        root.setOpacity(0.80);            // Set the opacity to 80%

        root.getChildren().addAll(okBtn, cancelBtn);

        Scene scene = new Scene(root);
        stage.setScene(scene);
        stage.setTitle("Applying Transformations and Effects to a Group");
        stage.show();
    }
}
```

## Styling a Group with CSS

The `Group` class does not offer much CSS styling.

All CSS properties for the `Node` class are available for the `Group` class:
for example, `-fx-cursor`, `-fx-opacity`, `-fx-rotate`, etc.

A Group cannot have its own appearance such as padding, backgrounds, and borders.
