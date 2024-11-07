---
title: "Java ClassLoader"
image: /assets/images/java/classloader/java-classloader-cover.jpg
permalink: /java/java-classloader-index.html
---

Java ClassLoader

- [ ] 有哪些方式，可以加载 Class<?>
    - [ ] `MethodHandles.Lookup.defineClass(byte[])`
    - [ ] `MethodHandles.Lookup.defineHiddenClass()`
    - [ ] `jdk.internal.misc.Unsafe.defineClass()`
- [ ] 有哪些方式，可以创建对象
  - [ ] new 创建
  - [ ] 反序列化
  - [ ] 在 ByteBuddy 中，MethodDelegation 为 `@Super` 注解生成对象时，会使用 `ReflectionFactory.getReflectionFactory().newConstructorForSerialization()` 方法

## ClassLoader

<table>
    <thead>
    <tr>
        <th>Basic</th>
        <th>ClassLoader</th>
        <th>Resource</th>
        <th>FAQ</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'classloader/basic/'" |
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
where_exp: "item", "item.path contains 'classloader/classloader/'" |
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
where_exp: "item", "item.path contains 'classloader/resource/'" |
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
where_exp: "item", "item.path contains 'classloader/faq/'" |
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

## Reference

- [Diagrams, diagrams, diagrams: Classloaders and the Java Developer Roadmap - JVM Weekly vol. 99](https://www.jvm-weekly.com/p/diagrams-diagrams-diagrams-classloaders)
