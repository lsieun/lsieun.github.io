---
title: "MinIO"
image: /assets/images/minio/minio-alternative-open-source-de-amazon-s3.webp
permalink: /minio.html
---

MinIO is a High-Performance Object Storage released under GNU Affero General Public License v3.0.

## Content

{%
assign filtered_posts = site.minio |
where_exp: "item", "item.url contains '/minio/basic/'" |
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

- [MinIO](https://min.io/)
