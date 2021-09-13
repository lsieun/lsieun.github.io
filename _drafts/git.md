---
title:  "Git"
categories: vcs
image: /assets/images/git/git-cover.jpg
tags: git
published: false
---

Git is software for tracking changes in any set of files, usually used for coordinating work among programmers collaboratively developing source code during software development.

## Local Git

{% assign filtered_posts = site.git | sort: "sequence" %}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    {% if num > 100 and num < 200 %}
    <li>
        <a href="{{ post.url }}" target="_blank">{{ post.title }}</a>
    </li>
    {% endif %}
    {% endfor %}
</ol>

## Remote Git

{% assign filtered_posts = site.git | sort: "sequence" %}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    {% if num > 200 and num < 300 %}
    <li>
        <a href="{{ post.url }}" target="_blank">{{ post.title }}</a>
    </li>
    {% endif %}
    {% endfor %}
</ol>

## Teamwork

{% assign filtered_posts = site.git | sort: "sequence" %}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    {% if num > 300 and num < 400 %}
    <li>
        <a href="{{ post.url }}" target="_blank">{{ post.title }}</a>
    </li>
    {% endif %}
    {% endfor %}
</ol>

## References

- [Git Magic](http://www-cs-students.stanford.edu/~blynn/gitmagic/pr01.html)
