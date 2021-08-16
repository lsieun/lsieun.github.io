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

它是什么，而不是什么

- We **spend time and effort focused on** specifying boundary conditions, argument ranges and corner cases **rather than** defining common programming terms, writing conceptual overviews, and including examples for developers. [Link](https://www.oracle.com/de/technical-resources/articles/java/javadoc-tool.html)

- commonly用的好

Thus, there are **commonly** two different ways to write doc comments -- as API specifications, or as programming guide documentation.

**There is sometimes a discrepancy between** how code should work **and** how it actually works.

## References

- [wisc.edu: UW-Madison Writer’s Handbook](https://writing.wisc.edu/handbook/)
