---
title: "Layout Intro"
sequence: "101"
---

## Layout Pane

You can use two types of layouts to arrange nodes in a scene graph:

- Static layout
- Dynamic layout

```text
          ┌─── static layout
layout ───┤
          └─── dynamic layout
```

Both static and dynamic layouts have advantages and disadvantages.
A static layout gives developers full control on the design of the user interface.
It lets you make use of the available space as you see fit.
A dynamic layout requires more programming work, and the logic is much more involved.
Typically, programming languages supporting a GUI, for example, JavaFX, support dynamic layouts through libraries.
Libraries solve most of the use cases for dynamic layouts.
If they do not meet your needs, you must do the hard work to roll out your own dynamic layout.

> Both static and dynamic layouts have advantages and disadvantages.

A **layout pane** is a node that contains other nodes, which are known as its children (or child nodes).
The responsibility of a layout pane is to lay out its children, whenever needed.
A layout pane is also known as a **container** or a **layout container**.

> layout pane

A layout pane has a **layout policy** that controls how the layout pane lays out its children.
For example, a layout pane may lay out its children horizontally, vertically, or in any other fashion.

> layout policy

JavaFX contains several layout-related classes.
A layout pane performs two things:

- It computes the position (the x and y coordinates) of the node within its parent.
- It computes the size (the width and height) of the node.

> 2D = position + size

For a 3D node, a layout pane also computes **the z coordinate of the position** and **the depth of the size**.

> 3D = position + size

The layout policy of a container is a set of rules to compute the position and size of its children.
Pay attention to the layout policy of the containers as to how they compute the position and size of their children.

> layout policy = rules = position + size

A node has three sizes: preferred size, minimum size, and maximum size.
Most of the containers attempt to give its children their preferred size.
The actual (or current) size of a node may be different from its preferred size.
The current size of a node depends on the size of the window, the layout policy of the container,
the expanding and shrinking policy for the node, etc.

> size = preferred size + minimum size + maximum size  
> actual size != preferred size

## Layout Pane Classes

JavaFX contains several container classes.
A container class is a subclass, direct or indirect, of the `Parent` class.

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

A `Group` lets you apply **effects** and **transformations** to all its children collectively.
The `Group` class is in the `javafx.scene` package.

> Group class --> style = effects + transformations

Subclasses of the `Region` class are used to lay out children.
They can be styled with CSS.
The `Region` class and most of its subclasses are in the `javafx.scene.layout` package.

> Region class = layout

It is true that a container needs to be a subclass of the `Parent` class.
However, not all subclasses of the `Parent` class are containers.
For example, the `Button` class is a subclass of the `Parent` class;
however, it is a control, not a container.

> Parent class

A node must be added to a container to be part of a scene graph.
The container lays out its children according to its layout policy.
If you do not want the container to manage the layout for a node,
you need to set the `managed` property of the node to `false`.

> scene graph: container --- node  
> scene graph就是处理container和node之间的关系


The `Parent` class contains three methods to get the list of children of a container:

- `protected ObservableList<Node> getChildren()`
- `public ObservableList<Node> getChildrenUnmodifiable()`
- `protected <E extends Node> List<E> getManagedChildren()`

The `getChildren()` method returns a modifiable `ObservableList` of the child nodes of a container.
If you want to add a node to a container, you would add the node to this list.
This is the most commonly used method for container classes.
We have been using this method to add children to containers such as `Group`,
`HBox`, `VBox`, etc., from the very first program.

> getChildren()

Notice the `protected` access for the `getChildren()` method.
If a subclass of the `Parent` class does not want to be a container,
it will keep the access for this method as protected.
For example, control-related classes (`Button`, `TextField`, etc.) keep this method as `protected`,
so you cannot add child nodes to them.
A container class overrides this method and makes it `public`.
For example, the `Group` and `Pane` classes expose this method as `public`.

The `getChildrenUnmodifiable()` method is declared `public` in the `Parent` class.
It returns a read-only `ObservableList` of children.
It is useful in two scenarios:

- You need to pass the list of children of a container to a method that should not modify the list.
- You want to know what makes up a control, which is not a container.

> getChildrenUnmodifiable()

The `getManagedChildren()` method has the `protected` access.
Container classes do not expose it as `public`.
They use it internally to get the list of managed children, during layouts.
You will use this method to roll out your own container classes.

> getManagedChildren()

List of Container Classes

- `Group`: A Group applies effects and transformations collectively to all its children.
- `Pane`: It is used for absolute positioning of its children.
- `HBox`: It arranges its children horizontally in a single row.
- `VBox`: It arranges its children vertically in a single column.
- `FlowPane`: It arranges its children horizontally or vertically in rows or columns.
  If they do not fit in a single row or column, they are wrapped at the specified width or height.
- `BorderPane`: It divides its layout area in the top, right, bottom, left, and center regions and
  places each of its children in one of the five regions.
- `StackPane`: It arranges its children in a back-to-front stack.
- `TilePane`: It arranges its children in a grid of uniformly sized cells.
- `GridPane`: It arranges its children in a grid of variable-sized cells.
- `AnchorPane`: It arranges its children by anchoring their edges to the edges of the layout area.
- `TextFlow`: It lays out rich text whose content may consist of several Text nodes.

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

## Adding Children to a Layout Pane

A container is meant to contain children.
You can add children to a container when you create the container object or after creating it.

> 两个时机：when you create the container object 和 after creating it

All container classes provide constructors that take a var-args `Node` type argument
to add the initial set of children.
Some containers provide constructors to add an initial set of children and
set **initial properties** for the containers.

> 第一个时机：构造之时。constructor = var-args Node + initial properties

You can also add children to a container at any time after the container is created.
Containers store their children in an observable list, which can be retrieved using the `getChildren()` method.
Adding a node to a container is as simple as adding a node to that observable list.

> 第二个时机：构造之后。after the container is created

The following snippet of code shows how to add children to an HBox when it is created and after it is created:

```text
// Create two buttons
Button okBtn = new Button("OK");
Button cancelBtn = new Button("Cancel");

// Create an HBox with two buttons as its children
HBox hBox1 = new HBox(okBtn, cancelBtn);

// Create an HBox with two buttons with 20px horizontal spacing between them
double hSpacing = 20;
HBox hBox2 = new HBox(hSpacing, okBtn, cancelBtn);

// Create an empty HBox, and afterwards, add two buttons to it
HBox hBox3 = new HBox();
hBox3.getChildren().addAll(okBtn, cancelBtn);
```

TIP: When you need to add multiple child nodes to a container, use the `addAll()` method of the
`ObservableList` rather than using the `add()` method multiple times.

