---
title: "Java Object Layout"
image: /assets/images/java/jol/java-object-header.webp
permalink: /java-jol.html
---

JOL (Java Object Layout) is the tiny toolbox to analyze object layout schemes in JVMs.

## Basic

<table>
    <thead>
    <tr>
        <th>Basic</th>
        <th>Lock</th>
        <th>Cache</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.url contains '/java/jol/basic/'" |
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
where_exp: "item", "item.url contains '/java/jol/lock/'" |
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
where_exp: "item", "item.url contains '/java/jol/cache/'" |
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


## References

- [lsieun/learn-java-jol](https://github.com/lsieun/learn-java-jol)

- [jvm-boolean-memory-layout](https://www.baeldung.com/jvm-boolean-memory-layout)
- [Memory Layout of Objects in Java](https://www.baeldung.com/java-memory-layout)
- [Compressed OOPs in the JVM](https://www.baeldung.com/jvm-compressed-oops)
- [Java Objects Inside Out](https://shipilev.net/jvm/objects-inside-out/)
- [Monitoring the size of your Java objects with Java Object Layout](https://www.mastertheboss.com/jbossas/monitoring/monitoring-the-size-of-your-java-objects-with-java-object-layout/)
- [A First Look at Java Inline Classes](https://www.infoq.com/articles/inline-classes-java/)
- [据说看完这篇 JVM 要一小时（二）](https://developer.aliyun.com/article/888349)
- [what is object header and padding in java](https://stackoverflow.com/questions/30787814/what-is-object-header-and-padding-in-java)


- [JOL(Java Object Layout) 应用实战](https://zhuanlan.zhihu.com/p/368323278)
- [JOL(Java Object Layout) 应用实战（二）](https://zhuanlan.zhihu.com/p/368505776)
- [JOL(Java Object Layout) 应用实战（三）](https://zhuanlan.zhihu.com/p/368810595)
- [JOL(Java Object Layout) 应用实战（四）](https://zhuanlan.zhihu.com/p/385594273)

- [从计算机本源深入探寻volatile和Java内存模型](https://mp.weixin.qq.com/s?__biz=Mzg3ODgyNDgwNg==&mid=2247486127&idx=1&sn=29d6079f6f26bd82633ec611feb3da85&chksm=cf0c96a6f87b1fb006e2f108879a0066aeb14e4bf5a4a9e2a83057a084dd2dfa2c257a813399&token=302443384&lang=zh_CN#rd)
- [Save Your Memory in JVM with Atomic*FieldUpdater](https://dzone.com/articles/save-your-memory-in-jvm-with-atomicfieldupdater)
