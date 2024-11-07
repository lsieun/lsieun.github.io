---
title: "Utility Classes and Enums"
sequence: "102"
---

While working with layout panes, you will need to use several classes and enums
that are related to **spacing** and **directions**.
These classes and enums are not useful when used stand-alone.
They are always used as properties for nodes.

## The Insets Class

### Basic

The Insets class represents **inside offsets** in four directions:
top, right, bottom, and left, for a rectangular area.

> 是什么

It is an immutable class.

> immutable

It has two constructors—one lets you set the same offset for all four directions,
and another lets you set different offsets for each direction:

> two constructors

```text
Insets(double topRightBottomLeft)
Insets(double top, double right, double bottom, double left)
```

The `Insets` class declares a constant, `Insets.EMPTY`, to represent a zero offset for all four directions.

> constant

Use the `getTop()`, `getRight()`, `getBottom()`, and `getLeft()` methods
to get the value of the offset in a specific direction.

> methods

### How to understand

An inset is the distance between the same edges (from top to top, from left to left, etc.) of two rectangles.
There are four inset values—one for each side of the rectangles.
An object of the `Insets` class stores the four distances.

![](/assets/images/java/fx/insets-illustration.png)

It is possible for two rectangles to overlap instead of one to be contained fully within another.
In this case, some inset values may be positive and some negative.
Inset values are interpreted relative to a reference rectangle.
To interpret an inset value correctly,
it is required that you get the position of the reference rectangle, its edge,
and the direction in which the inset needs to be measured.
The context where the term “insets” is used should make these pieces of information available.
In the figure, we can define the same insets relative to the inner or outer rectangle.
The inset values would not change.
However, the reference rectangle and the direction
in which the insets are measured (to determine the sign of the inset values) will change.

Typically, in JavaFX, the term insets and the Insets object are used in four contexts:

- Border insets
- Background insets
- Outsets
- Insets

In the first two contexts, **insets** mean the distances between the edges of the layout bounds and the
inner edge of the border or the inner edge of the background.
In these contents, insets are measured inward from the edges of the layout bounds.
A negative value for an inset means a distance measured outward from
the edges of the layout bounds.

A border stroke or image may fall outside of the layout bounds of a `Region`.
**Outsets** are the distances between the edges of the layout bounds of a Region and the outer edges of its border.
Outsets are also represented as an `Insets` object.

Javadoc for JavaFX uses the term insets several times to mean the sum of the thickness of the border and
the padding measured inward from all edges of the layout bounds.
Be careful interpreting the meaning of the term insets when you encounter it in Javadoc.

## The HPos Enum

The `HPos` enum defines three constants: `LEFT`, `CENTER`, and `RIGHT`,
to describe the horizontal positioning and alignment.

```java
package javafx.geometry;

/**
 * A set of values for describing horizontal positioning and alignment.
 * @since JavaFX 2.0
 */
public enum HPos {
    LEFT,
    CENTER,
    RIGHT,
}
```

### The VPos Enum

The constants of the `VPos` enum describe vertical positioning and alignment.
It has four constants: `TOP`, `CENTER`, `BASELINE`, and `BOTTOM`.

```java
package javafx.geometry;

/**
 * A set of values for describing vertical positioning and alignment.
 * @since JavaFX 2.0
 */
public enum VPos {
    TOP,
    CENTER,
    BASELINE,
    BOTTOM
}
```

### The Pos Enum

The constants in the `Pos` enum describe vertical and horizontal positioning and alignment.
It has constants for all combinations of `VPos` and `HPos` constants.
Constants in `Pos` enum are `BASELINE_CENTER`, `BASELINE_LEFT`, `BASELINE_RIGHT`, 
`BOTTOM_CENTER`, `BOTTOM_LEFT`, `BOTTOM_RIGHT`, `CENTER`, `CENTER_LEFT`, `CENTER_RIGHT`,
`TOP_CENTER`, `TOP_LEFT`, and `TOP_RIGHT`.

It has two methods—`getHpos()` and `getVpos()`—that return objects of `HPos` and `VPos` enum types,
describing the horizontal and vertical positioning and alignment, respectively.

```java
package javafx.geometry;

import static javafx.geometry.HPos.LEFT;
import static javafx.geometry.HPos.RIGHT;
import static javafx.geometry.VPos.BASELINE;
import static javafx.geometry.VPos.BOTTOM;
import static javafx.geometry.VPos.TOP;

/**
 * A set of values for describing vertical and horizontal positioning and
 * alignment.
 *
 * @since JavaFX 2.0
 */
public enum Pos {

    TOP_LEFT(TOP, LEFT),

    TOP_CENTER(TOP, HPos.CENTER),

    TOP_RIGHT(TOP, RIGHT),

    CENTER_LEFT(VPos.CENTER, LEFT),

    CENTER(VPos.CENTER, HPos.CENTER),

    CENTER_RIGHT(VPos.CENTER, RIGHT),

    BOTTOM_LEFT(BOTTOM, LEFT),

    BOTTOM_CENTER(BOTTOM, HPos.CENTER),

    BOTTOM_RIGHT(BOTTOM, RIGHT),

    BASELINE_LEFT(BASELINE, LEFT),

    BASELINE_CENTER(BASELINE, HPos.CENTER),

    BASELINE_RIGHT(BASELINE, RIGHT);

    private final VPos vpos;
    private final HPos hpos;

    private Pos(VPos vpos, HPos hpos) {
        this.vpos = vpos;
        this.hpos = hpos;
    }

    public VPos getVpos() {
        return vpos;
    }

    public HPos getHpos() {
        return hpos;
    }
}
```

## The HorizontalDirection Enum

The `HorizontalDirection` enum has two constants, `LEFT` and `RIGHT`,
which denote directions to the left and right, respectively.

## The VerticalDirection Enum

The `VerticalDirection` enum has two constants, `UP` and `DOWN`,
which denote up and down directions, respectively.

## The Orientation Enum

The `Orientation` enum has two constants, `HORIZONTAL` and `VERTICAL`,
which denote horizontal and vertical orientations, respectively.

## The Side Enum

The `Side` enum has four constants: `TOP`, `RIGHT`, `BOTTOM`, and `LEFT`, to denote the four sides of a rectangle.

## The Priority Enum

Sometimes, a container may have more or less space available than required
to lay out its children using their preferred sizes.

The `Priority` enum is used to denote the priority of a node to grow or shrink
when its parent has more or less space.
It contains three constants: `ALWAYS`, `NEVER`, and `SOMETIMES`.

A node with the `ALWAYS` priority always grows or shrinks as the available space increases or decreases.
A node with `NEVER` priority never grows or shrinks as the available space increases or decreases.
A node with `SOMETIMES` priority grows or shrinks when there are no other nodes
with `ALWAYS` priority or nodes with `ALWAYS` priority could not consume all the increased or decreased space.


