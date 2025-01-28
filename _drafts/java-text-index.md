---
title: "Java Text"
image: /assets/images/java/text/java-text-cover.webp
permalink: /java/java-text-index.html
---

Unicode/Charset/UTF8/Regex

## API

<table>
    <thead>
    <tr>
        <th style="text-align: center;">API</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/text/api/'" |
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

## Unicode

- [jenkov.com: Unicode](https://jenkov.com/tutorials/unicode/index.html)
- [EmojiAll](https://www.emojiall.com/zh-hans)

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Concept</th>
        <th style="text-align: center;">Block</th>
        <th style="text-align: center;">Theme</th>
        <th style="text-align: center;">Font</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/text/unicode/concept/'" |
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
where_exp: "item", "item.path contains 'java/text/unicode/character/'" |
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
where_exp: "item", "item.path contains 'java/text/unicode/theme/'" |
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
where_exp: "item", "item.path contains 'java/text/unicode/font/'" |
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

## Charset

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Basic</th>
        <th style="text-align: center;">UTF8</th>
        <th style="text-align: center;">UTF16</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/text/charset/basic/'" |
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
where_exp: "item", "item.path contains 'java/text/charset/utf08/'" |
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
where_exp: "item", "item.path contains 'java/text/charset/utf16/'" |
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

## Text

<table>
<tr>
    <th>Format</th>
    <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/text/op/format/'" |
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
<tr>
    <th>合并</th>
    <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/text/op/concat/'" |
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
<tr>
    <th>拆分</th>
    <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/text/op/split/'" |
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

<tr>
    <th>排序</th>
    <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/text/op/sort/'" |
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
<tr>
    <th>移除</th>
    <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/text/op/remove/'" |
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
</table>

## Regex

<table>
    <thead>
    <tr>
        <th style="text-align: center;">API</th>
        <th style="text-align: center;">Syntax</th>
        <th style="text-align: center;">Check</th>
        <th style="text-align: center;">Replace</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/regex/api/'" |
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
where_exp: "item", "item.path contains 'java/regex/syntax/'" |
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
where_exp: "item", "item.path contains 'java/regex/check/'" |
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
where_exp: "item", "item.path contains 'java/regex/replace/'" |
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



- [Baeldung Tag: Regex](https://www.baeldung.com/tag/regex)
    - [Regular Expressions](https://www.baeldung.com/cs/regular-expressions)
    - [A Guide To Java Regular Expressions API](https://www.baeldung.com/regular-expressions-java)
    - [Lookahead and Lookbehind in Java Regex](https://www.baeldung.com/java-regex-lookahead-lookbehind)
    - [Regular Expressions \s and \s+ in Java](https://www.baeldung.com/java-regex-s-splus)
    - [How to Use Regular Expressions to Replace Tokens in Strings in Java](https://www.baeldung.com/java-regex-token-replacement)
    - [Case-Insensitive String Matching in Java](https://www.baeldung.com/java-case-insensitive-string-matching)
    - [Difference Between Java Matcher find() and matches()](https://www.baeldung.com/java-matcher-find-vs-matches)
    - [Pre-compile Regex Patterns Into Pattern Objects](https://www.baeldung.com/java-regex-pre-compile)
    - [An Overview of Regular Expressions Performance in Java](https://www.baeldung.com/java-regex-performance)
    - [Replacing Strings in Java Using Regex: Back Reference vs. Lookaround](https://www.baeldung.com/java-regex-replace-strings-back-reference-vs-lookaround)

- [Java Regex - Java Regular Expressions](https://jenkov.com/tutorials/java-regex/index.html)

- [Introduction to regular expressions in Java](https://www.javamex.com/tutorials/regular_expressions/index.shtml)

## 中文

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Basic</th>
        <th style="text-align: center;">转换</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/text/chinese/basic/'" |
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
where_exp: "item", "item.path contains 'java/text/chinese/transformation/'" |
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

- [lsieun/learn-java-unicode](https://github.com/lsieun/learn-java-unicode)
- [lsieun/learn-java-text](https://github.com/lsieun/learn-java-text)
- [lsieun/learn-java-text-chinese](https://github.com/lsieun/learn-java-text-chinese)
- [lsieun/learn-java-regex](https://github.com/lsieun/learn-java-regex)

书籍

- [ ] [Java I/O, NIO and NIO.2]() Jeff Friesen
    - [ ] Chapter 09. Regular Expressions
    - [ ] Chapter 10. Charsets

- [Introduction to HexFormat in Java](https://www.baeldung.com/java-hexformat)


- HTML
    - [Remove HTML Tags Using Java](https://www.baeldung.com/java-remove-html-tags)
