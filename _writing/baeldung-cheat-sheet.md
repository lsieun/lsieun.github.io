---
title: "Baeldung-快速参考"
sequence: "210"
---

## 文章

### 关键字

- try not to overuse keywords - for example, if the article is about Spring, do not use "Spring" excessively because Google will consider that "Keyword Stuffing"

### 标题

separate heading with text, add a brief introductory text after the H2 heading to separate the headings:

```html
<h2>2. OAuth</h2>
// add text here
<h3>2.1. What is OAuth2?</h3>
```

注意：

- 标题当中的`2.1.`是正确的，而`2.1`是不正确的。

### 段落

- keep paragraphs small, simple and to the point - use clear and simple statements
- break concepts into multiple paragraphs if possible - if an idea stretches more than a few lines, I would break it into multiple paragraphs

### 内容

prefer "we" language, not "you" language
- whenever possible, it's better to say:
  We're going to implement this ...
  than:
  You're going to implement this...

### 代码/图片

引入代码或图片时，应该以"："结尾。


a code sample or diagram/image should be introduced with a sentence ending in a colon ( ":" )

- 正确的代码示例：

---
Here we're setting up a controller:
```text
{some code here}
```
---

- 错误的代码示例：

---
Here, we're setting up a controller.
```text
{some code here}
```
---
