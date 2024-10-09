---
title: "Quick Example"
sequence: "102"
---

## Basic

```java
import javax.swing.*;

public class Java2D {
    public static void main(String[] args) {
        JFrame frame = new JFrame();
        frame.setSize(300, 400); // Change width and height as needed
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        MyComponent component = new MyComponent();
        frame.add(component);
        frame.setVisible(true);
    }
}
```

```java
import javax.swing.*;
import java.awt.*;

public class MyComponent extends JComponent {
    @Override
    public void paintComponent(Graphics g) {
        Graphics2D g2 = (Graphics2D) g;
        // Your drawing instructions go here
    }
}
```

## Line

```java
import javax.swing.*;
import java.awt.*;
import java.awt.geom.Line2D;

public class MyComponent extends JComponent {
    @Override
    public void paintComponent(Graphics g) {
        Graphics2D g2 = (Graphics2D) g;

        // draw Line2D.Double
        g2.draw(new Line2D.Double(20, 50, 100, 200));
    }
}
```

## Curves

Quadratic Curve Segment

```java
import javax.swing.*;
import java.awt.*;
import java.awt.geom.QuadCurve2D;

public class MyComponent extends JComponent {
    @Override
    public void paintComponent(Graphics g) {
        Graphics2D g2 = (Graphics2D) g;

        // create new QuadCurve2D.Float
        QuadCurve2D q = new QuadCurve2D.Float();
        // draw QuadCurve2D.Float with set coordinates
        q.setCurve(10, 10, 50, 150, 110, 20);
        g2.draw(q);
    }
}
```

Cubic Curve Segment

```java
import javax.swing.*;
import java.awt.*;
import java.awt.geom.CubicCurve2D;

public class MyComponent extends JComponent {
    @Override
    public void paintComponent(Graphics g) {
        Graphics2D g2 = (Graphics2D) g;

        // create new CubicCurve2D.Double
        CubicCurve2D c = new CubicCurve2D.Double();
        // draw CubicCurve2D.Double with set coordinates
        c.setCurve(10, 100,
                50, 10,
                100, 200,
                150, 30);
        g2.draw(c);
    }
}
```

## Rectangle

```java
import javax.swing.*;
import java.awt.*;
import java.awt.geom.Rectangle2D;

public class MyComponent extends JComponent {
    @Override
    public void paintComponent(Graphics g) {
        Graphics2D g2 = (Graphics2D) g;

        // draw Rectangle2D.Double
        g2.draw(new Rectangle2D.Double(20, 30, 200, 100));
    }
}
```

```java
import javax.swing.*;
import java.awt.*;
import java.awt.geom.RoundRectangle2D;

public class MyComponent extends JComponent {
    @Override
    public void paintComponent(Graphics g) {
        Graphics2D g2 = (Graphics2D) g;

        // draw RoundRectangle2D.Double
        g2.draw(new RoundRectangle2D.Double(20, 30,
                200, 100,
                20, 20));
    }
}
```

## Ellipse

```java
import javax.swing.*;
import java.awt.*;
import java.awt.geom.Ellipse2D;

public class MyComponent extends JComponent {
    @Override
    public void paintComponent(Graphics g) {
        Graphics2D g2 = (Graphics2D) g;

        // draw Ellipse2D.Double
        g2.draw(new Ellipse2D.Double(20, 20,
                200, 100));
    }
}
```

## Arc

```java
import javax.swing.*;
import java.awt.*;
import java.awt.geom.Arc2D;

public class MyComponent extends JComponent {
    @Override
    public void paintComponent(Graphics g) {
        Graphics2D g2 = (Graphics2D) g;

        g2.drawRect(20, 20, 200, 100);

        // draw Arc2D.Double
        g2.draw(new Arc2D.Double(20, 20,
                200, 100,
                30, 30,
                Arc2D.PIE));

        g2.draw(new Arc2D.Double(20, 20,
                200, 100,
                90, 135,
                Arc2D.OPEN));

        g2.draw(new Arc2D.Double(20, 20,
                200, 100,
                270, 90,
                Arc2D.CHORD));
    }
}
```

