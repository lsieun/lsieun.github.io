---
title: "Vim"
image: /assets/images/vim/vim-editor-cover.webp
permalink: /vim.html
---

Vim - the ubiquitous text editor.
Vim is a highly configurable text editor built to make creating and changing any kind of text very efficient.

## Basic

{%
assign filtered_posts = site.vim |
where_exp: "item", "item.url contains '/vim/basic/'" |
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

## Content

{%
assign filtered_posts = site.vim |
where_exp: "item", "item.url contains '/vim/content/'" |
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

## ex Editor

{%
assign filtered_posts = site.vim |
where_exp: "item", "item.url contains '/vim/ex/'" |
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

## Advanced

{%
assign filtered_posts = site.vim |
where_exp: "item", "item.url contains '/vim/advanced/'" |
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

## Practice

{%
assign filtered_posts = site.vim |
where_exp: "item", "item.url contains '/vim/practice/'" |
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

- [Learn Vim Progressively](https://yannesposito.com/Scratch/en/blog/Learn-Vim-Progressively/)
- [Learning Vim in 2014: Vim as Language](https://benmccormick.org/2014/07/02/062700.html)
- [How To Learn Vim: A Four Week Plan](https://medium.com/actualize-network/how-to-learn-vim-a-four-week-plan-cd8b376a9b85)
