---
title: "总结"
sequence: "110"
---

## Concept

| Term                    | Example                            |
|-------------------------|------------------------------------|
| Parameterized type      | `List<String>`                     |
| Actual type parameter   | `String`                           |
| Generic type            | `List<E>`                          |
| Formal type parameter   | `E`                                |
| Unbounded wildcard type | `List<?>`                          |
| Raw type                | `List`                             |
| Bounded type parameter  | `<E extends Number>`               |
| Recursive type bound    | `<T extends Comparable<T>>`        |
| Bounded wildcard type   | `List<? extends Number>`           |
| Generic method          | `static <E> list<E> asList(E[] a)` |
| Type token              | `String.class`                     |

A class or interface whose declaration has one or more **type parameters** is a **generic class or interface**. Generic classes and interfaces are collectively known as **generic types**.

Each **generic type** defines a set of **parameterized types**, which consist of the class or interface name followed by an angle-bracketed list of **actual type parameters** corresponding to the generic type's **formal type parameters**.

Finally, each **generic type** defines a **raw type**, which is the name of the generic type used without any accompanying **actual type parameters**.

概念

- generic type
    - type parameter
- parameterized type
    - type argument
        - concrete parameterized type
        - wildcard parameterized type
            - bounded wildcard parameterized type
            - unbounded wildcard parameterized type



乌鸦的故事：上帝要捡最美丽的鸟作禽类的王，乌鸦把孔雀的长毛披在身上，插在尾巴上，到上帝前面去应选，果然为上帝挑中，其它鸟类大怒，把它插上的毛羽都扯下来，依然现出乌鸦的本相。
这就是说：披着长头发的，未必就真是艺术家；反过来说，秃顶无发的人，当然未必是学者或思想家，寸草也不生的头脑，你想还会产生什麽旁的东西？
这个寓言也不就此结束，这只乌鸦借来的羽毛全给人家拔去，现了原形，老羞成怒，提议索性大家把自己天生的毛羽也拔个干净，到那时候，大家光着身子，看真正的孔雀、天鹅等跟乌鸦有何分别。
这个遮羞的方法至少人类是常用的。——钱钟书《读〈伊索寓言〉》

- 元素：`T`, `List<?>`, `List<? extends Number>`, `List<Integer>`, `List`
- class literal
- 创建对象
- 创建数组

Type System: 继承、supertype 和 subtype；（君臣、父子 = 上与下的关系）

- 三条线：Raw

Type Cast： Raw Type, Unbounded wildcard, Bounded, Concreted

做成表格：怎么会 warning，怎么样会 error
