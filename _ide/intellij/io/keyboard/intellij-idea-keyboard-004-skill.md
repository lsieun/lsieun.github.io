---
title: "技巧"
sequence: "104"
---

[UP](/ide/intellij-idea-index.html)


## 表达式估算

Advanced expression type feature: `Ctrl + Shift + P` several time

```java
public class HelloWorld {
    public int getSeconds(int hour, int minutes) {
        assert hour >= 0 && hour < 24;
        assert minutes >= 0 && minutes < 60;
        return hour * 3600 + minutes * 60;
    }
}
```

如果我们选中 `hour * 3600 + minutes * 60` 部分，然后按下两次 `Ctrl + Shift + P`，就可以看到这个表达式的取值范围（`{0..86340}`）。

![](/assets/images/intellij/keyboard/ctrl-shift-p-twice.png)
