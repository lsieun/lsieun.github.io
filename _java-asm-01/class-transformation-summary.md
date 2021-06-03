---
title:  "本章内容总结"
sequence: "313"
---

[UP]({% link _posts/2021-04-22-java-asm-season-01.md %})

- Class Info
- Field Info
- Method Info:
    - 方法体的修改

需要要注意一点：**无论是添加instruction，还是删除instruction，还是要替换instruction，都要保持operand stack修改前和修改后是一致的**。

Methods can be transformed, i.e. by using a method adapter that forwards the method calls it receives with some modifications:

- changing arguments can be used to change individual instructions,
- not forwarding a received call removes an instruction,
- and inserting calls between the received ones adds new instructions.


要修改什么？
要定位的一个点上？

这一章里讲了两个类`ClassReader`和`Type`类，是因为前面那一章内容讲了许多个类，现在我们主要就是对他们进行应用而已。
