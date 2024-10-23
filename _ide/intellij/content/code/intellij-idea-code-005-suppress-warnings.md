---
title: "@SuppressWarnings"
sequence: "105"
---

[UP](/ide/intellij-idea-index.html)

```text
InspectionGadgetsBundle.properties
```

有的时候，为了代码逻辑清晰，我们会引入“不必要的局部变量”，这个时候 IntelliJ IDEA 会提示“Local variable is redundant”：

```java
public class HelloWorld {
    public void test(int x, int y) {
        int a = x * y;
        int b = y; // 在这里会提示：Local variable 'b' is redundant

        int c = add(a, b);
        System.out.println(c);
    }

    public int add(int a, int b) {
        return a + b;
    }
}
```

但是，我们就是想保留这个“不必要的局部变量”，同时又不想让 IntelliJ IDEA 提示 warning 信息，那么我们可以添加一个 `@SuppressWarnings` 注解：



```text
@SuppressWarnings("all")
```

冗余的变量：

```text
@SuppressWarnings("UnnecessaryLocalVariable")
public void test(int x, int y) {
```

拼写错误：

```text
@SuppressWarnings("SpellCheckingInspection")
```

多余的分号：

```text
@SuppressWarnings("UnnecessarySemicolon")
```

使用 Javadoc 代替 `//`：

```text
@SuppressWarnings("ReplaceWithJavadoc")
```

未使用的变量：

```text
@SuppressWarnings("unused")
```

Magic：

```text
@SuppressWarnings("MagicCharacter")
@SuppressWarnings("MagicNumber")
```

```text
@SuppressWarnings("NullableProblems")
```

```text
@SuppressWarnings({ "FieldMayBeFinal", "unused" })
```

更多的内容，可以参考[@SuppressWarnings - IntelliJ modes](https://gist.github.com/vegaasen/157fbc6dce8545b7f12c)。

```text
@SuppressWarnings("AlibabaMethodTooLong")
```

```text
@SuppressWarnings({"SameParameterValue", "DuplicatedCode"})
```
