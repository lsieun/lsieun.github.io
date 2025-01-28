---
title: "Java Cryptography"
image: /assets/images/java/crypto/java-crypto-cover.png
permalink: /java-crypto-index.html
---

Java Cryptography

密码测试：

- private key: privateKeyPass
- PKCS12 KeyStore: pkcs12StorePass
- JKS KeyStore: jksStorePass
- KeyPass: myKeyPass

## 加密和解密

### 概念

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Basic</th>
        <th style="text-align: center;">示例</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/crypto/cipher/basic/api/'" |
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
where_exp: "item", "item.path contains 'java/crypto/cipher/basic/example/'" |
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

### 对称加密

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Basic</th>
        <th style="text-align: center;">示例</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/crypto/cipher/sym/basic/'" |
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
where_exp: "item", "item.path contains 'java/crypto/cipher/sym/example/'" |
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

### 非对称加密

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Basic</th>
        <th style="text-align: center;">示例</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/crypto/cipher/asym/basic/'" |
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
where_exp: "item", "item.path contains 'java/crypto/cipher/asym/example/'" |
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

### Digest

### 签名

## KeyStore

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Basic</th>
        <th style="text-align: center;">API</th>
        <th style="text-align: center;">KeyTool</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/crypto/keystore/basic/'" |
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
where_exp: "item", "item.path contains 'java/crypto/keystore/java/'" |
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
where_exp: "item", "item.path contains 'java/crypto/keytool/'" |
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

## Bouncy Castle

- [PrimeKey](https://www.primekey.com/solutions/implementing-cryptography/)

内部可能有一些示例代码：

```text
METHOD org/bouncycastle/crypto/examples/DESExample main:([Ljava/lang/String;)V
```

## Reference

- [Baeldung Tag: Security](https://www.baeldung.com/category/security)
    - [Java KeyStore API](https://www.baeldung.com/java-keystore)
    - [Introduction to SSL in Java](https://www.baeldung.com/java-ssl)

- [Java Security Standard Algorithm Names](https://docs.oracle.com/en/java/javase/21/docs/specs/security/standard-names.html)

- [KeyStore 加载 PublicKey/PrivateKey（公/私钥）证书](https://blog.csdn.net/xuri24/article/details/84302017)
- [Cheat Sheet - Java Keystores](https://megamorf.gitlab.io/cheat-sheets/java-keystores/)
- [NICS CRYPTOGRAPHY LIBRARY](https://www.nics.uma.es/developments/nics-cryptography-library/)
- [Cryptography Architecture Extensions](https://www.cs.fsu.edu/~jtbauer/cis3931/tutorial/security1.2/overview/index.html)
  讲 JCA 和 JCE 的关系
- [Exploring Java KeyStore & Keys](https://medium.com/javarevisited/exploring-java-keystore-keys-9eb4805fa4ec)
- [What is Keystore?](https://stackoverflow.com/questions/23202046/what-is-keystore)
- [Java Keytool - Generate CSR](https://support.globalsign.com/digital-certificates/digital-certificate-installation/java-keytool-generate-csr)
- [Java KeyStore](https://jenkov.com/tutorials/java-cryptography/keystore.html)

- [KeyStore Explorer](https://keystore-explorer.org/)

- Book
    - [Cryptography and Cryptanalysis in Java: Creating and Programming Advanced Algorithms with Java SE 17 LTS and Jakarta EE 10](https://www.oreilly.com/library/view/cryptography-and-cryptanalysis/9781484281055/)

