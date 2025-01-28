---
title: "HotSpot"
image: /assets/images/hotspot/jvm-model.webp
permalink: /hotspot.html
---

HotSpot

## Content

{%
assign filtered_posts = site.hotspot |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}" target="_blank">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>

## Reference

视频

- [OpenJDK8 编译环境的搭建](https://www.bilibili.com/video/BV1A54y1k7FK)
- [搭建单步调试 openjdk 环境](https://www.bilibili.com/video/BV1934y1o7hp)

- [GitHub: JetBrains/jdk8u_hotspot](https://github.com/JetBrains/jdk8u_hotspot)
    - [objectMonitor.cpp](https://github.com/JetBrains/jdk8u_hotspot/blob/master/src/share/vm/runtime/objectMonitor.cpp)
