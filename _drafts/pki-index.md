---
title: "PKI"
image: /assets/images/pki/pki-cover.jpg
permalink: /pki.html
---

A Public Key Infrastructure (PKI) is a combination of policies, procedures and technology
needed to manage digital certificates in a public key cryptography scheme.

要进行 public encryption，首先要生成 private key。那么，生成 private key 要考虑三个问题：

- Key algorithm （使用哪个算法）
- Key size （使用的 key 有多少 bit，例如 2048、4086）
- Passphrase （是否使用密码保护）



## Basic

{%
assign filtered_posts = site.pki |
where_exp: "item", "item.url contains '/pki/basic/'" |
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

## OpenSSL

{%
assign filtered_posts = site.pki |
where_exp: "item", "item.url contains '/pki/openssl/'" |
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

## Import

{%
assign filtered_posts = site.pki |
where_exp: "item", "item.url contains '/pki/import/'" |
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

- [lsieun/learn-java-keystore](https://github.com/lsieun/learn-java-keystore)

- [Baeldung Tag: SSL](https://www.baeldung.com/tag/ssl)
- [Baeldung Tag: openssl](https://www.baeldung.com/linux/tag/openssl)
- [Creating a Self-Signed Certificate With OpenSSL](https://www.baeldung.com/openssl-self-signed-cert)
- [Converting a PEM File to Java KeyStore Format](https://www.baeldung.com/convert-pem-to-jks)
- [Converting a Java Keystore Into PEM Format](https://www.baeldung.com/java-keystore-convert-to-pem-format)
- [alvarow/openssl-cheat.sh](https://gist.github.com/alvarow/1a42e608d74474ac39aa)
- [Difference between OpenSSL and keytool](https://security.stackexchange.com/questions/98282/difference-between-openssl-and-keytool)
- [Cheat Sheet - OpenSSL](https://megamorf.gitlab.io/cheat-sheets/openssl/)
