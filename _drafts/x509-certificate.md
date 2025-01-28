---
title: "X.509 Digital Certificate"
categories: certificate
image: /assets/images/cert/x509-digital-certificate.jpg
permalink: /x509-cert.html
---

An X.509 certificate is a digital certificate based on the widely accepted [International Telecommunications Union (ITU) X.509 standard](https://www.itu.int/rec/T-REC-X.509), which defines the format of public key infrastructure (PKI) certificates.

{%
assign filtered_posts = site.cert |
sort: "sequence"
%}
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
