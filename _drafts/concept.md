---
title: "concept"
categories: cognition
tags: cognition
published: false
---

cognition: the process by which knowledge and understanding is developed in the mind.

{%
assign filtered_posts = site.concept |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    <li>
        <a href="{{ post.url }}" target="_blank">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>

## Reference

- [IBM Cloud Learn Hub](https://www.ibm.com/cloud/learn/all): 这里有很多的概念，值得学习的参考
  - [Docker](https://www.ibm.com/cloud/learn/docker)
  - [What is a digital worker?](https://www.ibm.com/cloud/learn/digital-worker)
  - [What is Serverless?](https://www.ibm.com/cloud/learn/serverless)
