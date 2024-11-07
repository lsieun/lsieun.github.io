---
title: "Font"
sequence: "101"
---

## Font Family

```java
import java.awt.*;

public class FontFamilyList {
    public static void main(String[] args) {
        GraphicsEnvironment graphicsEnvironment = GraphicsEnvironment.getLocalGraphicsEnvironment();
        String[] fontFamilyNames = graphicsEnvironment.getAvailableFontFamilyNames();
        for (String name : fontFamilyNames) {
            System.out.println(name);
        }
    }
}
```

```text
Consolas
Courier New
Microsoft YaHei
Monospaced
Times New Roman
```

## Font

```java
import java.awt.*;

public class FontList {
    public static void main(String[] args) {
        GraphicsEnvironment graphicsEnvironment = GraphicsEnvironment.getLocalGraphicsEnvironment();
        Font[] allFonts = graphicsEnvironment.getAllFonts();
        for (Font font : allFonts) {
            String family = font.getFamily();
            String fontName = font.getFontName();

            String info = String.format("%32s: %s", family, fontName);
            System.out.println(info);
        }
    }
}
```

```text
       Consolas: Consolas
       Consolas: Consolas Bold
       Consolas: Consolas Bold Italic
       Consolas: Consolas Italic
    Courier New: Courier New
    Courier New: Courier New Bold
    Courier New: Courier New Bold Italic
    Courier New: Courier New Italic
Microsoft YaHei: Microsoft YaHei
Microsoft YaHei: Microsoft YaHei Bold
     Monospaced: Monospaced.bold
     Monospaced: Monospaced.bolditalic
     Monospaced: Monospaced.italic
     Monospaced: Monospaced.plain
Times New Roman: Times New Roman
Times New Roman: Times New Roman Bold
Times New Roman: Times New Roman Bold Italic
Times New Roman: Times New Roman Italic
```

## 创建实例

```java
import java.awt.*;

public class Font_C_Create {
    public static void main(String[] args) {
        Font font = new Font("Times New Roman", Font.BOLD + Font.ITALIC, 14);
        String fontFamily = font.getFamily();
        String fontName = font.getFontName();

        System.out.println("fontFamily = " + fontFamily);
        System.out.println("fontName   = " + fontName);
    }
}
```

```text
fontFamily = Times New Roman
fontName   = Times New Roman Bold Italic
```

## 绘制文本

```java
import javax.swing.*;

public class Font_D_Draw {
    public static void main(String[] args) {
        JFrame frame = new JFrame();
        frame.setSize(600, 400);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        JComponent component = new MyComponentForText();
        frame.add(component);
        frame.setVisible(true);
    }
}
```

```java
import javax.swing.*;
import java.awt.*;

public class MyComponentForText  extends JComponent {
    @Override
    public void paintComponent(Graphics g) {
        Graphics2D g2 = (Graphics2D) g;
        // Your drawing instructions go here

        Font font = new Font("Times New Roman", Font.BOLD + Font.ITALIC, 18);
        g2.setFont(font);
        g2.drawString("Times New Roman: AbcXyz 你好啊", 20, 20);

        font = new Font("Microsoft YaHei", Font.PLAIN, 18);
        g2.setFont(font);
        g2.drawString("Microsoft YaHei: AbcXyz 你好啊", 20, 70);

        font = new Font("Monospaced", Font.PLAIN , 18);
        g2.setFont(font);
        g2.drawString("Monospaced: AbcXyz 你好啊", 20, 120);

        font = new Font("Courier New", Font.BOLD, 18);
        g2.setFont(font);
        g2.drawString("Courier New: AbcXyz 你好啊", 20, 170);

        font = new Font("Consolas", Font.BOLD, 18);
        g2.setFont(font);
        g2.drawString("Consolas: AbcXyz 你好啊", 20, 220);
    }
}
```

![My Image](/assets/images/java/graphics/java-awt-graphics-draw-string-with-font.png)

## 多行文本

```java
import javax.swing.*;
import java.awt.*;

public class Font_E_TextArea {
    public static void main(String[] args) {
        JFrame frame = new JFrame("Text Area in GridLayout");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(800, 600);
        frame.setLayout(new GridLayout(2, 2, 10, 10));

        Font[] fonts = new Font[]{
                new Font("Courier New", Font.BOLD, 18),
                new Font("Times New Roman", Font.BOLD + Font.ITALIC, 18),
                new Font("Monospaced", Font.PLAIN, 18),
                new Font("Microsoft YaHei", Font.PLAIN, 18),
        };

        for (int i = 0; i < 4; i++) {
            JTextArea textArea = new JTextArea();

            Font font = fonts[i % fonts.length];
            String str = font.getFamily() + System.lineSeparator() +
                    "AbcXyz" + System.lineSeparator() +
                    "public static void main(String[] args) {" + System.lineSeparator() +
                    "    System.out.println();" + System.lineSeparator() +
                    "}" + System.lineSeparator() +
                    "知命者不怨天，知己者不怨人。";

            textArea.setFont(font);
            textArea.setText(str);

            frame.add(textArea);
        }
        frame.setVisible(true);
    }
}
```

![My Image](/assets/images/java/graphics/java-awt-graphics-text-area-with-font.png)

