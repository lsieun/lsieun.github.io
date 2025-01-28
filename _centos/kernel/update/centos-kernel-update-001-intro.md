---
title: "Centos7 内核升级"
sequence: "101"
---

## 背景

在 CentOS 使用过程中，高版本的应用环境可能需要更高版本的内核才能支持，所以难免需要升级内核，所以以下将介绍 yum 和 rpm 两种升级内核方式。
关于内核种类:

- `kernel-ml`，其中的 `ml` 是 mainline stable 的缩写，elrepo-kernel 中罗列出来的是最新的稳定主线版本。
- `kernel-lt`，其中的 `lt` 是 long term support 的缩写，elrepo-kernel 中罗列出来的长期支持版本。

ML 与 LT 两种内核类型版本可以共存，但每种类型内核只能存在一个版本。
