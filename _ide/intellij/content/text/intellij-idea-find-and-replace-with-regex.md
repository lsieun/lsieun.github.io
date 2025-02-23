---
title: "正则表达式：查找和替换"
sequence: "108"
---

[UP](/ide/intellij-idea-index.html)


例如：

- 查找：`(\w)Rider`
- 替换成：`$1`

如果要提取正则表达式中匹配到的内容，使用 `$1` - `$n` 按顺序取（第一个表达式 到 第 N 个表达式匹配到的数据）

## 操作步骤

### 第一步，打开搜索框

- 如果想修改当前文件，可以按 `Ctrl+R`，会出现 search and replace pane。

![search and replace pane](/assets/images/intellij/search-and-replace-pane.png)

- 如果想修改多个文件，可以按 `Ctrl+Shift+R`，会弹出 Replace in Files 对话框。

![search and replace pane](/assets/images/intellij/replace-in-files-dialog.png)

### 第二步，开启正则表达式

Click ![the Regex](/assets/images/intellij/icons.actions.regexHovered.svg) icon to enable regular expressions.

![search and replace pane](/assets/images/intellij/search-and-replace-pane.png)

If you want to check the syntax of regular expressions, hover over ![the Regex](/assets/images/intellij/icons.actions.regexSelected.svg) icon and click the **Show expressions help** link.

### 第三步，注意特殊字符

When you search for a text string that contains special regex symbols, IntelliJ IDEA automatically escapes them with backlash `\` in the search field.

However, when you specifically search for metacharacters such as `.[{()\^$|?*+`, you need to escape them with backslash `\`, so they can be recognized.

For example, if you need to find `.`, type `\.` in the search field.

特殊字符的规律总结：

- 特殊字符包括 `[{()`，有小括号、中括号、大括号；但是，没有“尖括号”`<>`。
- 特殊字符包括向右的斜线 `\`，但不包括向左的斜线 `/`。
- 特殊字符包括加号、乘号 `+*`，但不包括减号、除号 `-/`。（数学四则运算）
- 特殊字符包括句号、问号 `.?`，但不包括逗号、分号 `,;`。（英语句子的分隔符号）

## 示例

### 分组

[Use regex capturing groups and backreferences](https://www.jetbrains.com/help/idea/tutorial-finding-and-replacing-text-using-regular-expressions.html#capture_groups_and_backreference)

You can put the regular expressions inside brackets in order to group them.

- Each group has a number starting with 1, so you can refer to (backreference) them in your replace pattern.
- Note that the group 0 refers to the entire regular expression.
- However, you can refer to the captured group not only by a number `$n`, but also by a name `${name}`.

For example, for **the numbered capturing groups**, use the following syntax:

- Find Field: `<h2>(.*?)</h2>`
- Replace Field: `$1`

For **the named capturing groups**, use the following syntax:

- Find Field: `<h2>(?<title>.*?)</h2>`
- Replace Field: `${title}`

Let's consider the following code:

```text
<new product="ij" title="Multiline search and replace in the current file"/>
<new product="ij" title="Improved search and replace in the current file"/>
<new product="ij" title="Regexp shows replacement preview"/>
```

- In the **search field**, enter parentheses `()` that would indicate a capturing group, for example: `\stitle="(.*)?"\s*(/>*)`.
- In the **replace field**, backreference such groups by numbers starting with 1, for example: `$2<title>$1</title>`

![Use regex capturing groups and backreferences](/assets/images/intellij/replace-with-regex-example-capturing-group-and-back-reference.png)

### 改变字符的大小

[Switch the character case](https://www.jetbrains.com/help/idea/tutorial-finding-and-replacing-text-using-regular-expressions.html#upper_lower_case_switch)

You can use regular expressions to change the case of characters that matches some criteria.

- In the **search field** enter the search pattern.
- In the **replace field**, depending on what you want to achieve, enter one of the following syntax:
  - `\l` changes a character to lowercase until the next character in the string. For example, `Bar` becomes `bar`.
  - `\u` changes a character to uppercase until the next character in the string. For example, `bar` becomes `Bar`.
  - `\L` changes characters to lowercase until the end of the literal string `\E`. For example, `BAR` becomes `bar`.
  - `\U` changes characters to uppercase until the end of the literal string `\E`. For example, `bar` becomes `BAR`.

![Switch the character case](/assets/images/intellij/replace-with-regex-example-switch-character-case.png)

### 替换多行为一行

原内容：

```text
{:refdef: style="text-align: center;"}
![](/assets/images/java/jvm/jstat-output-reference.png)
{:refdef}
```

替换后内容：

```text
![](/assets/images/java/jvm/jstat-output-reference.png)
```

- 匹配：`\{:refdef: style="text-align: center;"\}\n(.*?)\n\{:refdef\}`
- 替换：`$1`

- `\n`：表示换行符（也就是行结束）。
- `(.*?)`：这是一个非贪婪匹配，它匹配第二行的内容，并将其捕获到一个组中。

## 正则表达式的逻辑

```text
句子：句子的开头和结尾、单词与单词之间的分隔符、单词
单词（多个字符）
单个字符：
```

## 示例

### 查询缺少盘古之白的注释

```text
//\p{Lo}
```

![](/assets/images/intellij/find-by-unicode-category.png)

进行替换：

- `//(\p{Lo}+.+)$`
- `// $1`

![](/assets/images/intellij/find-by-unicode-category-and-replace-with-space.png)

### Markdown 添加标题

- 查找：`^第([零一二三四五六七八九十]+)章`
- 替换：`## 第$1章`

```text
^[-~,.a-z A-Z]+$
```

```text
^第(.{1,3})章(.*)$
## 第$1章$2

^第(.{1,3})节(.*)$
### 第$1节$2
```

## References

- [jetbrains.com: Find and replace text using regular expressions][find-and-replac-with-regex]
- [jetbrains.com: Regular expression syntax reference][regular-expression-syntax-reference]
- [regular-expressions.info: Regular Expressions Quick Start][regular-expressions-quickstart]

[find-and-replac-with-regex]: https://www.jetbrains.com/help/idea/tutorial-finding-and-replacing-text-using-regular-expressions.html
[regular-expression-syntax-reference]: https://www.jetbrains.com/help/idea/regular-expression-syntax-reference.html
[regular-expressions-quickstart]: https://www.regular-expressions.info/quickstart.html
