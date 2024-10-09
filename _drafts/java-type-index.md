---
title: "Java Type"
image: /assets/images/java/core/learn-java.jpg
permalink: /java/java-type-index.html
---

Java Type

## Interface


<table>
    <thead>
    <tr>
        <th style="text-align: center;">Basic</th>
        <th style="text-align: center;">不同类型的接口</th>
        <th style="text-align: center;">特性</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/type/interface/basic/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/type/interface/type/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/type/interface/feature/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
    </tr>
    </tbody>
</table>


## Enum

An **enumerated type** is a type whose legal values consist of a fixed set of constants,
such as the seasons of the year,
the planets in the solar system,
or the suits in a deck of playing cards.

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Basic</th>
        <th style="text-align: center;">技巧</th>
        <th style="text-align: center;">其它</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/type/enum/basic/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/type/enum/trick/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/type/enum/other/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
    </tr>
    </tbody>
</table>


## Annotation

```text
                                                 ┌─── @Target
                                                 │
                                                 ├─── @Retention
                                                 │
                   ┌─── Meta.Annotation ─────────┼─── @Inherited
                   │                             │
                   │                             ├─── @Documented
                   │                             │
                   │                             └─── @Repeatable
Java Annotation ───┤
                   ├─── Annotation.Definition
                   │
                   ├─── Annotation.Usage
                   │
                   └─── Annotation.Processing
```

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Basic</th>
        <th style="text-align: center;">元注解</th>
        <th style="text-align: center;">定义注解</th>
        <th style="text-align: center;">使用注解</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/type/annotation/basic/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/type/annotation/meta/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/type/annotation/declare/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/type/annotation/usage/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
    </tr>
    </tbody>
</table>

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Advanced</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/type/annotation/advanced/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
    </tr>
    </tbody>
</table>

- [JEP 277: Enhanced Deprecation](https://openjdk.java.net/jeps/277)
- [Get a Field's Annotations Using Reflection](https://www.baeldung.com/java-get-field-annotations)
- [Java Annotations and Java Reflection - Tutorial](https://www.vogella.com/tutorials/JavaAnnotations/article.html)
- [Java Reflection - Annotations](https://jenkov.com/tutorials/java-reflection/annotations.html)

## Generic

```text
                                                                                      ┌─── Generic Class
                                                           ┌─── Generic Type ─────────┤
                                    ┌─── Container Type ───┤                          └─── Generic Interface
                                    │                      │
                                    │                      └─── Parameterized Type
                 ┌─── Design ───────┤
                 │                  │                                            ┌─── Unbounded Type Variable
                 │                  │                      ┌─── Type Variable ───┤
                 │                  │                      │                     └─── Bounded Type Variable
                 │                  └─── Payload Type ─────┤
                 │                                         │                     ┌─── Concrete Type Argument
                 │                                         └─── Type Argument ───┤
                 │                                                               │                              ┌─── Unbounded Wildcard
Java Generics ───┤                                                               └─── Wildcard ─────────────────┤
                 │                                                                                              └─── Bounded Wildcard
                 │
                 │                  ┌─── Diamond Syntax
                 ├─── Java File ────┤
                 │                  └─── Type Inference
                 │
                 ├─── Compiler ─────┼─── Type Erasure
                 │
                 └─── Class File ───┼─── Signature
```

Basic

{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/type/generic/basic/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>

Array

{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/type/generic/generic-and-array/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>


Annotation

{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/type/generic/generics-and-annotation/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>

JDK

{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/type/generic/jdk/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>

Subtype

{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/type/generic/subtype-relationship/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>

Theme

{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/type/generic/theme/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>

Type Parameter

{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/type/generic/type-parameter/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>

Type Argument

{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/type/generic/type-argument/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>

Type Erasure

{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/type/generic/type-erasure/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>

TODO：

- [ ] 父类是泛型，子类不是泛型

类似于：

```text
public class Child extends Parent<Integer> {

}
```



**The idea of generics represents the abstraction over types**. It is a very powerful concept that allows to develop abstract algorithms and data structures and to provide concrete types to operate on later.

> 泛型，最核心的思想就是对 type 进行抽象（abstraction），可以将 type 作为参数传递。

Interestingly, generics were not present in the early versions of Java and were added along the way only in Java 5 release.( 泛型是在 Java 5 引入的 ) And since then, it is fair to say that generics revolutionized the way Java programs are being written, delivering much stronger type guaranties and making code significantly safer.

Collections that have all elements of the same type are called **homogeneous**, while the collections that can have elements of potentially different types are called **heterogeneous** (or sometimes "mystery meat collections").



Use Case:

问题一：对于一个 `.class` 文件来说，它可以分成多个部分：Magic Number、Version、Constant Pool、Class Info、Fields、Methods 和 Attributes。那么，泛型 `<T>` 可以应用到哪些地方？

我的回答：

- Class Info，分成三个地方：this_class、super_class、interfaces
- Fields
- Methods，分成两种：一种是依赖于 Class 的，另一种是独立的

问题二：Generics 和 Collections 之间是什么样的关系呢？

我的回答：

- 从时间上来说，Collections 是在 Java 1.2 加入的，而 Generics 是在 Java 5 加入的，以前的 Collections 的代码需要经过重构才能支持泛型，而泛型在实现上也是不完全的，它采用了 Type Erase 的方式来实现对过去的代码的兼容性
- 从我现在的理解来说，Generics 是对 Type 的参数化，现在的 Collections 和 Generics 进行结合之后，就是对 Collections 内的 Class、Field 和 Methods 中的 Type 的进行一种有效的约束。

Which language features are related to Java generics?

**Features for definition and use of generic types and methods**.

Java Generics support definition and use of generic types and methods. It provides language features for the following purposes:

- definition of a generic type
- definition of a generic method

---

- type parameters
    - type parameter bounds
- type arguments
    - wildcards
    - wildcard bounds
    - wildcard capture
- instantiation of a generic type = parameterized type
    - raw type
    - concrete instantiation
    - wildcard instantiation
- instantiation of a generic method
    - automatic type inference
    - explicit type argument specification



联想

Type Erasure 让我想起了《丑八怪 - 薛之谦》中的“如果剧本写好 谁比谁高贵”

Reference

- [Oracle - Lesson: Generics](https://docs.oracle.com/javase/tutorial/java/generics/index.html)
- [Angelika Langer: Java Generics FAQs](http://www.angelikalanger.com/GenericsFAQ/JavaGenericsFAQ.html)

## Nested

The Java programming language allows you to define a class within another class.
Such a class is called a **nested class** and is illustrated here:

```text
class OuterClass {
    ...
    class NestedClass {
        ...
    }
}
```

Terminology: Nested classes are divided into two categories: non-static and static.
Non-static nested classes are called **inner classes**.
Nested classes that are declared `static` are called **static nested classes**.

```text
class OuterClass {
    ...
    class InnerClass {
        ...
    }
    static class StaticNestedClass {
        ...
    }
}
```



There are two special kinds of **inner classes**: **local classes** and **anonymous classes**.

```text
                ┌─── static    : static nested class
                │
nested class ───┤                                       ┌─── normal
                │                                       │
                └─── non-static: inner class ───────────┤
                                                        │               ┌─── local class
                                                        └─── special ───┤
                                                                        └─── anonymous class
```

access and modifier 

A nested class is a member of its enclosing class.
Non-static nested classes (inner classes) have access to other members of the enclosing class, even if they are declared `private`.
Static nested classes do not have access to other members of the enclosing class.

```text
                                                        ┌─── static nested class
                              ┌─── static member ───────┤
                              │                         └─── inner class
access ───┼─── outer class ───┤
                              │
                              └─── non-static member ───┼─── inner class
```

As a member of the `OuterClass`, a nested class can be declared `private`, `public`, `protected`, or package private.
(Recall that outer classes can only be declared `public` or package private.)

```text
                                 ┌─── public
            ┌─── outer class ────┤
            │                    └─── package private
            │
modifier ───┤                    ┌─── public
            │                    │
            │                    ├─── protected
            └─── nested class ───┤
                                 ├─── private
                                 │
                                 └─── package private
```

Why Use Nested Classes?

Compelling reasons for using nested classes include the following:

- **It is a way of logically grouping classes that are only used in one place**:
  If a class is useful to only one other class, then it is logical to embed it in that class and keep the two together.
  Nesting such "helper classes" makes their package more streamlined.

- **It increases encapsulation**:
  Consider two top-level classes, A and B, where B needs access to members of A that would otherwise be declared `private`.
  By hiding class B within class A, A's members can be declared `private` and B can access them.
  In addition, B itself can be hidden from the outside world.

- **It can lead to more readable and maintainable code**:
  Nesting small classes within top-level classes places the code closer to where it is used.

Content

{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/type/nested/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>

References

- [Nested Classes](https://docs.oracle.com/javase/tutorial/java/javaOO/nested.html)


## 参考

- 《Effective Java》 3rd
