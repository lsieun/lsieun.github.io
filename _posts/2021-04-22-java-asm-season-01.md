---
title:  "Java ASM系列一：Core API"
categories: java asm
image: /assets/images/java/asm/brew_your_own_bytecode_with_asm.jpg
tags: java asm
---

ASM is an open source java library for manipulating java byte code.


## Content

{% assign filtered_posts = site.java-asm-01 | sort: "sequence" %}
<ol>
    {% for post in filtered_posts %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>

## References

- [ASM](https://asm.ow2.io/)
- [GitLab: asm source code](https://gitlab.ow2.org/asm/asm)
- [Oracle: The Java Virtual Machine Specification, Java SE 8 Edition](https://docs.oracle.com/javase/specs/jvms/se8/html/index.html)

