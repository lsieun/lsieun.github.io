---
title: "reference vs. dereference"
sequence: "103"
---

## dereference

Exceptions due to **dereferencing a null pointer** are a very common type of error in Java programs.


首先，我们来说一下reference和dereference两个概念。在C语言当中，这两个概念的区别比较清晰：

- **Referencing** means taking the address of an existing variable (using `&`) to set a pointer variable.

```text
int  c1;
int* p1;
c1 = 5;
p1 = &c1;
//p1 references c1
```

- **Dereferencing** a pointer means using the `*` operator (asterisk character) to retrieve the value from the memory address that is pointed by the pointer.

```text
int n1;
n1 = *p1;
```

![Reference VS. Dereference](/assets/images/java/asm/reference-vs-dereference.png)
