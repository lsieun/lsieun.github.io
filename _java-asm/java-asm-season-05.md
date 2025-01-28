---
title: "Java ASM 系列五：源码分析"
categories: java asm
image: /assets/images/manga/pig-work.png
tags: java asm
published: true
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

先占位置，文章还没有写。（遥遥无期）

---

这个部分有点类似于“屠龙之术”。

“屠龙之术”，意思是指极为高明的技术或本领，但是在**现实中用不到**。

![](/assets/images/chinese-culture/dragon-killing-skill.png)

---

Class modification problems

- Lots of serialization and deserialization details
- Constant pool management
  - missing or unused constants
  - constant pool indexes management
- Offsets (jump, exception table, local vars, etc)
  - become invalid if method code inserted or removed
- Computing maximum stack size and StackMap
  - require a control flow analysis

Approach:

- use the Visitor pattern without using an explicit object model
- completely hide the (de)serialization and constant pool management details
- represent jump offsets by `Label` objects
- automatic computation of the max stack size and StackMap



![QQ Group](/assets/images/contact/qq-group.jpg)
