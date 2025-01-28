---
title: "daemon"
sequence: "105"
---

[UP](/java-concurrency.html)


## 应用

第 1 个，垃圾回收器线程就是一种守护线程

第 2 个，Tomcat 中的 Acceptor 和 Poller 线程都是守护线程，
所以 Tomcat 接收到 shutdown 命令后，不会等待它们处理完当前请求
