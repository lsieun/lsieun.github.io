---
title:  "Java ASM系列四：代码模板"
categories: java asm
image: /assets/images/manga/pig-fly.jpg
tags: java asm
published: true
---

ASM is an open-source java library for manipulating bytecode.（不断更新中。。。）

---

- 《[Java ASM系列一：Core API]({% link _posts/2021-04-22-java-asm-season-01.md %})》主要是针对ASM当中Core API的内容进行展开。
- 《[Java ASM系列二：OPCODE]({% link _posts/2021-04-29-java-asm-season-02.md %})》主要是针对`MethodVisitor.visitXxxInsn()`方法与200个opcode之间的关系展开，同时也会涉及到opcode对于Stack Frame的影响。
- 《[Java ASM系列三：Tree API]({% link _posts/2021-05-01-java-asm-season-03.md %})》主要是针对ASM当中Tree API的内容进行展开。
- 《[Java ASM系列四：代码模板]({% link _posts/2021-06-01-java-asm-season-04.md %})》主要是整理ASM代码，将常用的功能编写成“模板”，在使用时进行必要的修改，才能使用。
- 《[Java ASM系列五：源码分析]({% link _posts/2021-07-01-java-asm-season-05.md %})》主要是对ASM源代码进行介绍。

---

适合人群：对Java ASM知识有一定了解的开发者，不适合刚刚接触ASM的初学者（beginner）。

---

在编写ASM代码时，本文遵循的编码命名规则如下：

- 如果一个类继承自`ClassVisitor`，我们将其命名为`XxxVisitor`。
- 如果一个类继承自`MethodVisitor`，我们将其命名为`XxxAdapter`。

通过类的名字，我们可以很容易地区分出哪些类是继承自`ClassVisitor`，哪些类是继承自`MethodVisitor`。

---

## 类层面

{% assign filtered_posts = site.java-asm-04 | sort: "sequence" %}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    {% if num > 100 and num < 200 %}
    <li>
        <a href="{{ post.url }}" target="_blank">{{ post.title }}</a>
    </li>
    {% endif %}

    {% endfor %}
</ol>

## 方法层面

{% assign filtered_posts = site.java-asm-04 | sort: "sequence" %}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    {% if num > 200 and num < 300 %}
    <li>
        <a href="{{ post.url }}" target="_blank">{{ post.title }}</a>
    </li>
    {% endif %}

    {% endfor %}
</ol>

TODO: 查看方法的调用链

{:refdef: style="text-align: center;"}
![QQ Group](/assets/images/contact/qq-group.jpg)
{: refdef}
