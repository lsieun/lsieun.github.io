---
title: "DaVinci Resolve"
image: /assets/images/davinci-resolve/davinci-resolve-cover.png
---

DaVinci Resolve is a color correction and non-linear video editing application for macOS, Windows, and Linux, originally developed by da Vinci Systems, and now developed by Blackmagic Design following its acquisition in 2009.

{%
assign filtered_posts = site.davinci-resolve |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    <li>
        <a href="{{ post.url }}" target="_blank">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
