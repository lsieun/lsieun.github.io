---
title: "keytool Intro"
sequence: "101"
---

[UP](/java-crypto.html)


## 主要作用

keytool 的主要作用是 **manage keys and certificates** and **store them in a keystore**

## 安装位置

keytool 位于 `${JDK_HOME}/bin` 目录。

## 查看帮助

```text
$ keytool --help
$ keytool -genkeypair --help
```

## 默认存储

默认情况下，keystore 存储在 `${HOME}/.keystore` 文件：

```text
$ ls -l ${HOME}/.keystore
-rw-rw-r--. 1 devops devops 2710 Jul  4 08:25 /home/devops/.keystore
```

## Reference

- [Introduction to keytool](https://www.baeldung.com/keytool-intro)
