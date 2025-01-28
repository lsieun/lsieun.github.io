---
title: "资源关闭：@Cleanup"
sequence: "101"
---

[UP](/lombok.html)

```java
import lombok.Cleanup;

import javax.swing.*;
import java.io.IOException;
import java.io.InputStream;

public class ResourceReleased {

    void cleanUp() throws IOException {
        @Cleanup
        InputStream is = this.getClass().getResourceAsStream("res.txt");
    }

    void dispose() {
        @Cleanup("dispose")
        JFrame mainFrame = new JFrame("Main Window");
    }
}
```

```java
import java.io.IOException;
import java.io.InputStream;
import java.util.Collections;
import javax.swing.JFrame;

public class ResourceReleased {
    public ResourceReleased() {
    }

    void cleanUp() throws IOException {
        InputStream is = this.getClass().getResourceAsStream("res.txt");
        if (Collections.singletonList(is).get(0) != null) {
            is.close();
        }

    }

    void dispose() {
        JFrame mainFrame = new JFrame("Main Window");
        if (Collections.singletonList(mainFrame).get(0) != null) {
            mainFrame.dispose();
        }

    }
}
```
