---
title: "Understanding Region"
sequence: "104"
---

`Region` is the base class for all layout panes. It can be styled with CSS.
Unlike `Group`, it has its own size. It is resizable.
It can have a visual appearance, for example, with padding, multiple backgrounds, and multiple borders.

You do not use the `Region` class directly as a layout pane.
If you want to roll out your own layout pane, extend the `Pane` class, which extends the `Region` class.

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

TIP: The `Region` class is designed to support the CSS3 specification for backgrounds and borders,
as they are applicable to JavaFX.
The specification for “Css Backgrounds and Borders Module Level 3” can be found
online at [www.w3.org/TR/css-backgrounds-3/](https://www.w3.org/TR/css-backgrounds-3/).

By default, a `Region` defines a rectangular area.
However, it can be changed to any shape.
The drawing area of a `Region` is divided into several parts.
Depending on the property settings, a `Region` may draw outside of its layout bounds.

Parts of a Region:

- Backgrounds (fills and images)
- Content area
- Padding
- Borders (strokes and images)
- Margin
- Region insets

![](/assets/images/java/fx/different-parts-of-a-region.png)

A region may have a **background** that is drawn first.
The **content area** is the area where the content of the `Region` (e.g., controls) is drawn.

> background和content area应该是同一个区域

The **padding** is an optional space around the **content area**.
If the padding has a zero width, the padding edge and the content area edge are the same.

> content area --> padding

The **border area** is the space around the **padding**.
If the border has a zero width, the border edge and the padding edge are the same.

> padding --> border area

The **margin** is the space around the **border**.
The padding and margin are very similar.
The only difference between them is that the margin defines the space around the outside edge of the border,
whereas the padding defines the space around the inside edge of the border.
Margins are supported for controls when they are added to panes,
for example, HBox, VBox, etc. 
However, margins are not directly supported for a `Region`.

> border area --> margin

The content area, padding, and borders affect the layout bounds of the `Region`.
You can draw borders outside the layout bounds of a `Region`,
and those borders will not affect the layout bounds of the `Region`.
The margin does not affect the layout bounds of the `Region`.

> content area + padding + border --> layout bounds  
> margin -xxx-> layout bounds

The distance between the edge of the layout bounds of the `Region` and
its content area defines the insets for the `Region`.
The `Region` class computes its insets automatically based on its properties.
It has a read-only insets property that you can read to know its insets.
Note that a layout container would need to know the area in which to place its children,
and they can compute the content area knowing the layout bounds and insets.

> content area edge + inset = layout bounds edge

**Tip: The background fills, background images, border strokes, border images,
and content of a Region are drawn in order.**

## Setting Backgrounds

A `Region` can have a background that consists of fills, images, or both.

> Region --> background = fills + images

A fill consists of a color, radii for four corners, and insets on four sides.
Fills are applied in the order they are specified.
The **color** defines the color to be used for painting the background.
The **radii** define the radii to be used for corners;
set them to zero if you want rectangular corners.
The **insets** define the distance between the sides of the `Region` and the outer edges of the background fill.

> fill = color + radii + insets

For example, an inset of 10px on top means that a horizontal strip of 10px
inside the top edge of the layout bounds will not be painted by the background fill.
An inset for the fill may be negative.
A negative inset extends the painted area outside of the layout bounds of the `Region`;
and in this case, the drawn area for the `Region` extends beyond its layout bounds.

> draw area --> layout bounds

The following CSS properties define the background fill for a `Region`:

- `-fx-background-color`
- `-fx-background-radius`
- `-fx-background-insets`

The following CSS properties fill the entire layout bounds of the `Region` with a red color:

```text
-fx-background-color: red;
-fx-background-insets: 0;
-fx-background-radius: 0;
```

The following CSS properties use two fills:

```text
-fx-background-color: lightgray, red;
-fx-background-insets: 0, 4;
-fx-background-radius: 4, 2;
```

The first fill covers the entire `Region` (see `0px` insets) with a light gray color;
it uses a 4px radius for all four corners, making the `Region` look like a rounded rectangle.
The second fill covers the `Region` with a red color; it uses a 4px inset on all four sides,
which means that 4px from the edges of the Region are not painted by this fill,
and that area will still have the light gray color used by the first fill.
A 2px radius for all four corners is used by the second fill.

> 解释上面的配置

You can also set the background of a `Region` in code **using Java objects**.
An instance of the `Background` class represents the background of a `Region`.
The class defines a `Background.EMPTY` constant to represent an empty background (no fills and no images).

> 使用Java设置background

Tip: A `Background` object is immutable. it can be safely used as the background of multiple `Region`s.

> Background是immutable，它可以使用多次。

A `Background` object has zero or more fills and images.
An instance of the `BackgroundFill` class represents a fill;
an instance of the `BackgroundImage` class represents an image.

The `Region` class contains a background property of the `ObjectProperty<Background>` type.
The background of a Region is set using the `setBackground(Background bg)` method.

```java
import javafx.application.Application;
import javafx.geometry.Insets;
import javafx.scene.Scene;
import javafx.scene.layout.Background;
import javafx.scene.layout.BackgroundFill;
import javafx.scene.layout.CornerRadii;
import javafx.scene.layout.Pane;
import javafx.scene.paint.Color;
import javafx.stage.Stage;

public class BackgroundFillTest extends Application {

	public static void main(String[] args) {
		Application.launch(args);
	}

	@Override
	public void start(Stage stage) {
		Pane p1 = this.getCSSStyledPane();
		Pane p2 = this.getObjectStyledPane();

		p1.setLayoutX(10);
		p1.setLayoutY(10);

		// Place p2 20px right to p1
		p2.layoutYProperty().bind(p1.layoutYProperty());
		p2.layoutXProperty().bind(p1.layoutXProperty().add(p1.widthProperty()).add(20));

		Pane root = new Pane(p1, p2);
		root.setPrefSize(240, 70);
		Scene scene = new Scene(root);
		stage.setScene(scene);
		stage.setTitle("Setting Background Fills for a Region");
		stage.show();
		stage.sizeToScene();
	}

	public Pane getCSSStyledPane() {
		Pane p = new Pane();
		p.setPrefSize(100, 50);
		p.setStyle("-fx-background-color: lightgray, red;"
				+ "-fx-background-insets: 0, 4;"
				+ "-fx-background-radius: 4, 2;");

		return p;
	}

	public Pane getObjectStyledPane() {
		Pane p = new Pane();
		p.setPrefSize(100, 50);

		BackgroundFill lightGrayFill = 
			new BackgroundFill(Color.LIGHTGRAY, new CornerRadii(4), new Insets(0));

		BackgroundFill redFill = 
			new BackgroundFill(Color.RED, new CornerRadii(2), new Insets(4));

		// Create a Background object with two BackgroundFill objects
		Background bg = new Background(lightGrayFill, redFill);
		p.setBackground(bg);

		return p;
	}
}
```

The following CSS properties define the background image for a `Region`:

- `-fx-background-image`
- `-fx-background-repeat`
- `-fx-background-position`
- `-fx-background-size`

The `-fx-background-image` property is a CSS URL for the image.
The `-fx-background-repeat` property indicates how the image will be repeated (or not repeated)
to cover the drawing area of the Region.
The `-fx-background-position` determines how the image is positioned with the `Region`.  
The `-fx-background-size` property determines the size of the image relative to the `Region`.

The following CSS properties fill the entire layout bounds of the `Region` with a red color:

```text
-fx-background-image: URL('your_image_url_goes_here');
-fx-background-repeat: space;
-fx-background-position: center;
-fx-background-size: cover;
```

下面的代码，第一个图片没有显示出来：

```java
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.image.Image;
import javafx.scene.layout.*;
import javafx.stage.Stage;

public class BackgroundImageTest extends Application {
    public static void main(String[] args) {
        Application.launch(args);
    }

    @Override
    public void start(Stage stage) throws Exception {
        Pane p1 = this.getCSSStyledPane();
        Pane p2 = this.getObjectStyledPane();

        p1.setLayoutX(10);
        p1.setLayoutY(10);

        // Place p2 20px right to p1
        p2.layoutYProperty().bind(p1.layoutYProperty());
        p2.layoutXProperty().bind(p1.layoutXProperty().add(p1.widthProperty()).add(20));

        Pane root = new Pane(p1, p2);
        root.setPrefSize(240, 120);
        Scene scene = new Scene(root);
        stage.setScene(scene);
        stage.setTitle("Setting Background Fills for a Region");
        stage.show();
        stage.sizeToScene();
    }

    public Pane getCSSStyledPane() {
        Pane p = new Pane();
        p.setPrefSize(100, 100);
        p.setStyle(
                "-fx-background-image: URL('file://D:/workspace/git-repo/learn-java-fx/src/main/resources/images/naruto.jpg');" +
                "-fx-background-repeat: space;" +
                "-fx-background-position: center;" +
                "-fx-background-size: cover;"
        );

        return p;
    }

    public Pane getObjectStyledPane() {
        Pane p = new Pane();
        p.setPrefSize(100, 100);

        Image image = new Image("D:\\workspace\\git-repo\\learn-java-fx\\src\\main\\resources\\images\\naruto.jpg");
        BackgroundSize bgSize = new BackgroundSize(100, 100, true, true, false, true);
        BackgroundImage bgImage = new BackgroundImage(image,
                BackgroundRepeat.SPACE, BackgroundRepeat.SPACE,
                BackgroundPosition.DEFAULT, bgSize);
        // Create a Background object with an BackgroundImage object
        Background bg = new Background(bgImage);

        p.setBackground(bg);

        return p;
    }
}
```

## Setting Padding

The padding of a `Region` is the space around its content area.
The `Region` class contains a `padding` property of the `ObjectProperty<Insets>` type.
You can set separate padding widths for each of the four sides:

```text
// Create an HBox
HBox hb = new HBox();

// A uniform padding of 10px around all edges
hb.setPadding(new Insets(10));

// A non-uniform padding: 2px top, 4px right, 6px bottom, and 8px left
hb.setPadding(new Insets(2, 4, 6, 8));
```

## Setting Borders

A `Region` can have a border, which consists of strokes, images, or both.

> Region --> border = strokes + images

If strokes and images are not present, the border is considered empty.
Strokes and images are applied in the order they are specified;
all strokes are applied before images.
You can set the border by using CSS and by using the `Border` class in code.

Note: We will use the phrases, “the edges of a Region” and “the layout bounds of a Region,” in this
section, synonymously, which mean the edges of the rectangle defined by the layout bounds of the `Region`.

A stroke consists of five properties:

- A color
- A style
- A width
- Radii for four corners
- Insets on four sides

The **color** defines the color to be used for the stroke. You can specify four different colors for the four sides.

The **style** defines the style for the stroke: for example, solid, dashed, etc.
The style also defines the location of the border relative to its insets:
for example, inside, outside, or centered.
You can specify four different styles for the four sides.

The **radii** define the radii for corners; set them to zero if you want rectangular corners.

The **width** of the stroke defines its thickness. You can specify four different widths for the four sides.

The **insets** of a stroke define the distance from the sides of the layout bounds of the `Region`
where the border is drawn.
A positive value for the inset for a side is measured inward from the edge of the Region.
A negative value of the inset for a side is measured outward from the edge of the Region.
An inset of zero on a side means the edge of the layout bounds itself.
It is possible to have positive insets for some sides (e.g., top and bottom) and
negative insets for others (e.g., right and left).
Figure 10-9 shows the positions of positive and negative insets relative to the layout bounds of a `Region`.
The rectangle in solid lines is the layout bounds of a `Region`,
and the rectangles in dashed lines are the insets lines.

![](/assets/images/java/fx/positive-and-negative-insets.png)

The border stroke may be drawn inside, outside, or partially inside and partially outside the layout bounds of the Region.
To determine the exact position of a stroke relative to the layout bounds,
you need to look at its two properties, **insets** and **style**:

- If the style of the stroke is inside, the stroke is drawn inside the insets.
- If the style is outside, it is drawn outside the insets.
- If the style is centered, it is drawn half inside and half outside the insets.

The following CSS properties define border strokes for a `Region`:

- `-fx-border-color`
- `-fx-border-style`
- `-fx-border-width`
- `-fx-border-radius`
- `-fx-border-insets`

The following CSS properties draw a border with a stroke of 10px in width and red in color.
The outside edge of the border will be the same as the edges of the `Region`
as we have set insets and style as zero and inside, respectively.
The border will be rounded on the corners as we have set the radii for all corners to 5px:

```text
-fx-border-color: red;
-fx-border-style: solid inside;
-fx-border-width: 10;
-fx-border-insets: 0;
-fx-border-radius: 5;
```

The following CSS properties use two strokes for a border.
The first stroke is drawn inside the edges of the `Region` and the second one outside:

```text
-fx-border-color: red, green;
-fx-border-style: solid inside, solid outside;
-fx-border-width: 5, 2 ;
-fx-border-insets: 0, 0;
-fx-border-radius: 0, 0;
```



