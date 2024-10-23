---
title: "Java Native"
tags: java jni jna
image: /assets/images/java/native/java-native-cover.jpg
permalink: /java-native.html
---

Java Native Interface (JNI) is a foreign function interface programming framework
that enables Java code running in a Java virtual machine (JVM) to call and be called by native applications
(programs specific to a hardware and operating system platform)
and libraries written in other languages such as C, C++ and assembly.

## Basic

{%
assign filtered_posts = site.java-native |
where_exp: "item", "item.url contains '/java-native/basic/'" |
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

## JNI

Java Native Interface

{%
assign filtered_posts = site.java-native |
where_exp: "item", "item.url contains '/java-native/jni/'" |
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

## JNA

{%
assign filtered_posts = site.java-native |
where_exp: "item", "item.url contains '/java-native/jna/'" |
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

## DLL

- [Create C/C++ DLLs in Visual Studio](https://docs.microsoft.com/en-us/cpp/build/dlls-in-visual-cpp?view=msvc-170)
- [Building and Using DLLs](https://www.cygwin.com/cygwin-ug-net/dll.html)

{%
assign filtered_posts = site.java-native |
where_exp: "item", "item.url contains '/java-native/dll/'" |
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

## SO

{%
assign filtered_posts = site.java-native |
where_exp: "item", "item.url contains '/java-native/so/'" |
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

- [Java Native Interface Specification Contents](https://docs.oracle.com/javase/8/docs/technotes/guides/jni/spec/jniTOC.html)

- [How to call a C program from Java?](https://javapapers.com/core-java/how-to-call-a-c-program-from-java/)
- [Java Native Interface (JNI)](https://www3.ntu.edu.sg/home/ehchua/programming/java/javanativeinterface.html)
- [The Java Native Interface (JNI)](https://www.ibm.com/docs/en/sdk-java-technology/7?topic=components-java-native-interface-jni)
- [Wiki: Java Native Interface](https://en.wikipedia.org/wiki/Java_Native_Interface)
- [Program Library HOWTO](https://tldp.org/HOWTO/Program-Library-HOWTO/index.html)

Baeldung

- [Guide to JNI (Java Native Interface)](https://www.baeldung.com/jni)
- [Using JNA to Access Native Dynamic Libraries](https://www.baeldung.com/java-jna-dynamic-libraries)

Github:

- [java-native-access/jna](https://github.com/java-native-access/jna)

Shared Libraries

- [Understanding Shared Libraries in Linux](https://www.tecmint.com/understanding-shared-libraries-in-linux/)
- [Shared Libraries: Understanding Dynamic Loading](https://amir.rachum.com/shared-libraries/) 我觉得，写的不错，但是看不懂。

书籍

- 《Advanced Java Programming》第 8 章
- 《Java Native Interface Programmers Guide and Specification》(Sheng Liang)
