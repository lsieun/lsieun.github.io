---
title: "Java 2D Intro"
sequence: "101"
---

Java 2D objects exist on a plane called **user coordinate space**, or just **user space**.

When objects are rendered on a screen or a printer, **user space coordinates** are transformed to **device space coordinates**.

## Coordinates

The Java 2D API maintains **two coordinate spaces**:

- **User space** – The space in which graphics primitives are specified
- **Device space** – The coordinate system of an output device such as a screen, window, or a printer

**User space** is a device-independent **logical coordinate system**, the coordinate space that **your program** uses.
All geometries passed into Java 2D rendering routines are specified in user-space coordinates.

## Java 2D Rendering

When a component needs to be displayed, its `paint` or `update` method is automatically invoked with the appropriate `Graphics` context.

The Java 2D API includes the `java.awt.Graphics2D` class, which extends the `Graphics` class
to provide access to the enhanced graphics and rendering features of the Java 2D API.
These features include:

- Rendering the **outline** of any geometric primitive, using the stroke and paint attributes (`draw` method).
- Rendering any geometric primitive by **filling** its interior with the color or pattern specified by the paint attributes (`fill` method).
- Rendering any **text** string (the `drawString` method). The font attribute is used to convert the string to glyphs, which are then filled with the color or pattern specified by the paint attributes.
- Rendering the specified **image** (the `drawImage` method).

In addition, the `Graphics2D` class supports the `Graphics` rendering methods for **particular shapes**, such as `drawOval` and `fillRect`.
All methods that are represented above can be divided into two groups:

- Methods to draw a shape
- Methods that affect rendering

The second group of the methods uses the `state` attributes that form the `Graphics2D` context for following purposes:

- To vary the stroke width
- To change how strokes are joined together
- To set a clipping path to limit the area that is rendered
- To translate, rotate, scale, or shear objects when they are rendered
- To define colors and patterns to fill shapes with
- To specify how to compose multiple graphics objects

## Geometric Primitives

The Java 2D API provides a useful set of standard shapes such as points, lines, rectangles, arcs, ellipses, and curves.
The most important package to define common geometric primitives is the `java.awt.geom` package.
Arbitrary shapes can be represented by combinations of straight geometric primitives.

> 定义了一些 common geometric primitives，它们位于 java.awt.geom 内。任何复杂的 shape，都可以由 geometric primitives 来组成。

The `Shape` interface represents a geometric shape,
which has an **outline** and an **interior**.
This interface provides a common set of methods for describing and inspecting two-dimensional geometric objects and
supports curved line segments and multiple sub-shapes.
The `Graphics` class supports only straight **line segments**.
The `Shape` interface can support **curves segments**.

- Shape
  - outline
  - interior

### Points

The `Point2D` class defines a point representing a location in (x, y) coordinate space.
The term "point" in the Java 2D API is not the same as a pixel.
A point has no area, does not contain a color, and cannot be rendered.

## Text

- Text
  - Fonts
  - Text Layout

### Fonts

The shapes that a font uses to represent the characters in a string are called **glyphs**.
A particular character or combination of characters might be represented as one or more glyphs.
For example, á might be represented by two glyphs,
whereas the ligature fi might be represented by a single glyph.

- glyph: 石雕符号；象形文字 a symbol carved out of stone, especially one from an ancient writing system

**A font can be thought of as a collection of glyphs.**
A single font might have many faces, such as italic and regular.
All of the faces in a font have similar typographic features and
can be recognized as members of the same family.
In other words, **a collection of glyphs** with a particular style form a **font face**.
A collection of **font faces** forms a **font family**.
The collection of font families forms the set of fonts that are available on the system.

```text
a collection of glyphs ---> font face --> font family
```

When you are using the Java 2D API, you specify fonts by using an instance of `Font`.
You can determine what fonts are available by calling the static method `GraphicsEnvironment.getLocalGraphicsEnvironment`
and then querying the returned `GraphicsEnvironment`.
The `getAllFonts` method returns an array that contains `Font` instances for all of the fonts available on the system.
The `getAvailableFontFamilyNames` method returns a list of the available font families.

```java
import java.awt.*;

public class HelloWorld {
    public static void main(String[] args) {
        GraphicsEnvironment graphicsEnvironment = GraphicsEnvironment.getLocalGraphicsEnvironment();
        Font[] allFonts = graphicsEnvironment.getAllFonts();
//        for (Font font : allFonts) {
//            String family = font.getFamily();
//            System.out.println(family);
//        }

        String[] availableFontFamilyNames = graphicsEnvironment.getAvailableFontFamilyNames();
        for (String name : availableFontFamilyNames) {
            System.out.println(name);
        }
    }
}
```

```java
import java.awt.*;

public class HelloWorld {
    public static void main(String[] args) {
        GraphicsEnvironment graphicsEnvironment = GraphicsEnvironment.getLocalGraphicsEnvironment();
        Font[] allFonts = graphicsEnvironment.getAllFonts();
        for (Font font : allFonts) {
            String fontName = font.getFontName();
            String family = font.getFamily();

            String info = String.format("%s-%s", fontName, family);
            System.out.println(info);

        }

//        String[] availableFontFamilyNames = graphicsEnvironment.getAvailableFontFamilyNames();
//        for (String name : availableFontFamilyNames) {
//            System.out.println(name);
//        }
    }
}
```

```text
Consolas-Consolas
Consolas Bold-Consolas
Consolas Bold Italic-Consolas
Consolas Italic-Consolas
```

### Text Layout

Before text can be displayed, it must be laid out so that the characters are represented by the appropriate glyphs in the proper positions.

The following are two Java 2D mechanisms for managing text layout:

- The `TextLayout` class manages text layout, highlighting, and hit detection.
  The facilities provided by `TextLayout` handle the most common cases, including strings with mixed fonts, mixed languages, and bidirectional text.
- You can create the own `GlyphVector` objects by using the `Font` class and then rendering each `GlyphVector` object through the `Graphics2D` class.
  Thus, you can completely control how text is shaped and positioned.



