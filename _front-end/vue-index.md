---
title: "Vue"
sequence: "201"
---

## Vue2

{%
assign filtered_posts = site.front-end |
where_exp: "item", "item.url contains '/front-end/vue2/'" |
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

## Vue3

### basic

{%
assign filtered_posts = site.front-end |
where_exp: "item", "item.url contains '/front-end/vue3/basic/'" |
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

### directives

{%
assign filtered_posts = site.front-end |
where_exp: "item", "item.url contains '/front-end/vue3/directives/'" |
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

### components

{%
assign filtered_posts = site.front-end |
where_exp: "item", "item.url contains '/front-end/vue3/components/'" |
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

### LifeCycle

{%
assign filtered_posts = site.front-end |
where_exp: "item", "item.url contains '/front-end/vue3/lifecycle/'" |
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

### env

{%
assign filtered_posts = site.front-end |
where_exp: "item", "item.url contains '/front-end/vue3/env/'" |
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

### package

{%
assign filtered_posts = site.front-end |
where_exp: "item", "item.url contains '/front-end/vue3/package/'" |
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

### deploy

{%
assign filtered_posts = site.front-end |
where_exp: "item", "item.url contains '/front-end/vue3/deploy/'" |
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

## Reference

- Vue.js: [英文](https://vuejs.org/) [中文](https://cn.vuejs.org/)
- [vuejs使用经验分享](https://space.bilibili.com/282190994/channel/collectiondetail?sid=193847)
- [后盾人: Vue](https://doc.houdunren.com/vue/1%20vue.html)


- [Vue.js官方文档](https://v3.cn.vuejs.org/guide/introduction.html)
- [尚硅谷Vue2.0+Vue3.0全套教程丨vuejs从入门到精通](https://www.bilibili.com/video/BV1Zy4y1K7SH?p=28)
- [尚硅谷Web前端axios入门与源码解析](https://www.bilibili.com/video/BV1wr4y1K7tq)


- [Vue3 + vite + Ts + pinia + 实战 + 源码 +全栈](https://www.bilibili.com/video/BV1dS4y1y7vd)

- [192.168.30.16:8889](http://192.168.30.16:8889/#/)
- [openlayers](https://openlayers.org/en/latest/examples/)
- [apifox](https://www.apifox.cn/web/user/login)
- [基于Vue实现后台系统权限控制 VUE权限管理](https://www.bilibili.com/video/BV13P4y1j7gM)
- [vue-element-admin+spring boot 前后端分离 权限管理系统](https://www.bilibili.com/video/BV1dt4y1x7rT)
- [Vue3+TS+element-plus实战后台管理系统](https://www.bilibili.com/video/BV1PZ4y1G7bu)

需要学习的内容：

- [vue3:setup语法糖](https://blog.csdn.net/weixin_44439874/article/details/122126954)

