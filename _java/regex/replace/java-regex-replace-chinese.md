---
title: "中文内容替换"
sequence: "101"
---

[UP](/java/java-text-index.html)


## 贪婪模式

```java
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class TextReplacer {

    public static void main(String[] args) {
        // 测试用例
        String[] testCases = {
            "把告知和未理踩一圈",
            "把告知和未理踩圈上",
            "把租赁一圈",
            "把租赁圈上",
            "我们把告知和未理踩一圈他们把租赁圈上你好"
        };

        for (String testCase : testCases) {
            System.out.println("Original: " + testCase);
            System.out.println("Replaced: " + replaceText(testCase));
            System.out.println();
        }
    }

    private static String replaceText(String text) {
        // 正则表达式匹配需要被替换的内容
        // 这个正则表达式将匹配“把”字后面跟任意数量非空格字符直到遇到“和”或者“圈”
        // 注意：这里的正则表达式假设要替换的词不会包含特殊字符，如括号、方括号等。
        Pattern pattern = Pattern.compile("把([^\\s]+)(?:和([^\\s]+))?(一圈 | 圈上)");
        Matcher matcher = pattern.matcher(text);

        StringBuffer replacedText = new StringBuffer();
        while (matcher.find()) {
            String replacement = "把「" + matcher.group(1) + "」";
            if (matcher.group(2) != null) {
                replacement += "和「" + matcher.group(2) + "」";
            }
            replacement += matcher.group(3);
            matcher.appendReplacement(replacedText, Matcher.quoteReplacement(replacement));
        }
        matcher.appendTail(replacedText);

        return replacedText.toString();
    }
}
```

```text
Original: 把告知和未理踩一圈
Replaced: 把「告知和未理踩」一圈

Original: 把告知和未理踩圈上
Replaced: 把「告知和未理踩」圈上

Original: 把租赁一圈
Replaced: 把「租赁」一圈

Original: 把租赁圈上
Replaced: 把「租赁」圈上

Original: 我们把告知和未理踩一圈他们把租赁圈上你好
Replaced: 我们把「告知和未理踩一圈他们把租赁」圈上你好
```

## 非贪婪模式

```java
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class NonGreedyTextReplacer {

    public static void main(String[] args) {
        // 测试用例
        String[] testCases = {
            "把告知和未理踩一圈",
            "把告知和未理踩圈上",
            "把租赁一圈",
            "把租赁圈上",
            "我们把告知和未理踩一圈他们把租赁圈上你好"
        };

        for (String testCase : testCases) {
            System.out.println("Original: " + testCase);
            System.out.println("Replaced: " + replaceText(testCase));
            System.out.println();
        }
    }

    private static String replaceText(String text) {
        // 正则表达式匹配需要被替换的内容，使用非贪婪模式
        Pattern pattern = Pattern.compile("把([^\\s]+?)(?:和([^\\s]+?))?(一圈 | 圈上)", Pattern.DOTALL);
        Matcher matcher = pattern.matcher(text);

        StringBuilder replacedText = new StringBuilder();
        while (matcher.find()) {
            String replacement = "把「" + matcher.group(1) + "」";
            if (matcher.group(2) != null) {
                replacement += "和「" + matcher.group(2) + "」";
            }
            replacement += matcher.group(3);
            matcher.appendReplacement(replacedText, Matcher.quoteReplacement(replacement));
        }
        matcher.appendTail(replacedText);

        return replacedText.toString();
    }
}
```

```text
Original: 把告知和未理踩一圈
Replaced: 把「告知」和「未理踩」一圈

Original: 把告知和未理踩圈上
Replaced: 把「告知」和「未理踩」圈上

Original: 把租赁一圈
Replaced: 把「租赁」一圈

Original: 把租赁圈上
Replaced: 把「租赁」圈上

Original: 我们把告知和未理踩一圈他们把租赁圈上你好
Replaced: 我们把「告知」和「未理踩」一圈他们把「租赁」圈上你好
```

这个正则表达式 `"把([^\\s]+?)(?:和([^\\s]+?))?(一圈 | 圈上)"` 用于匹配特定模式的字符串，并且是非贪婪模式。
下面是对这个正则表达式的详细解释：

1. ` 把 `: 直接匹配字符“把”。

2. `([^\\s]+?)`:
    - `(` 开始一个捕获组。
    - `[^\\s]` 匹配任何非空白字符（即除了空格、制表符、换行符等之外的所有字符）。
    - `+?` 是一个量词，表示前面的元素（非空白字符）可以出现一次或多次，但尽可能少地匹配（非贪婪模式）。这意味着它会停止在第一个可能的位置，不会继续匹配更多字符。
    - `)` 结束捕获组。

3. `(?:...)`:
    - `(` 开始一个非捕获组（使用 `?:` 来标识该组不会被记住以供后续引用）。
    - 内部的内容是 ` 和([^\\s]+?)`，这是为了匹配“和”后面跟着的另一个词语。
        - ` 和 ` 直接匹配字符“和”。
        - `([^\\s]+?)` 与上面的相同，匹配一个非空白字符序列，尽可能短。
    - `)?` 结束非捕获组，并指定这个组是可选的（`?` 意味着这个组可以出现 0 次或 1 次）。

4. `(一圈 | 圈上)`:
    - `(` 开始一个捕获组。
    - ` 一圈 | 圈上 ` 使用竖线 `|` 作为逻辑或操作符，表示要么匹配“一圈”，要么匹配“圈上”。
    - `)` 结束捕获组。

综上所述，这个正则表达式试图匹配这样的模式：以“把”开头，后跟一个词语（由非空白字符组成），接着是一个可选的部分（“和”加上另一个词语），最后以“一圈”或“圈上”结尾。由于使用了非贪婪模式（`+?`），它将确保匹配尽可能少的字符，从而正确处理句子中的多个类似结构。例如，“我们把告知和未理踩一圈他们把租赁圈上你好”将会被解析为两个独立的匹配项：“把告知和未理踩一圈” 和 “把租赁圈上”。
