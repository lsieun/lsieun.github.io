---
layout: post
title: English
permalink: /english/
---

Importance of Vocabulary

- communicate
- navigate the social environment
- read effectively

The whole purpose of reading is to **understand** and **learn**!

{% assign filtered_posts = site.english | sort: "sequence" %}
<ol>
    {% for post in filtered_posts %}
    <li>
        <a href="{{ post.url }}" target="_blank">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>

## References

- [wisc.edu: UW-Madison Writer’s Handbook](https://writing.wisc.edu/handbook/)
