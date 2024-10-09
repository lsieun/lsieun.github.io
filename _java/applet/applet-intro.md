---
title: "Applet Intro"
sequence: "101"
---

File: `Display_applet.java`

```java
import java.applet.Applet;
import java.awt.*;

public class Display_applet extends Applet {
    public void paint(Graphics g) {
        g.drawString("this is displayed by the paint method", 20, 20);
        g.drawLine(0,0,100, 200);
    }
}
```

File: `showapplet.html`

```html
<html lang="zh">
    <head>
        <title>Hello Applet</title>
    </head>
    <body>
    <APPLET
            CODE ="Display_applet.class"
            HEIGHT = 200
            WIDTH = 200>
    </APPLET>
    </body>
</html>
```

```text
appletviewer showapplet.html
```

书籍

- [ ] 《Java In Depth》
    - [ ] Chapter 09. Applets And Applications
