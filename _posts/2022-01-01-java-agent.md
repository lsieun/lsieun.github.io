---
title: "Java Agent in Action"
image: /assets/images/java/agent/java-agent-in-action.png
tags: java agent instrumentation
permalink: /java-agent/java-agent-index.html
---

Java agent is a powerful tool introduced with Java 5.
It has been highly useful in profiling activities where developers and application users can monitor tasks carried out within servers and applications.

![](/assets/images/java/agent/java-vs-native-agent.png)

## 主要内容

### 文章

- [Java Agent 系列一：基础篇]({% link _java-agent/java-agent-01.md %})

[//]: # (- [Java Agent系列二：进阶篇]&#40;{% link _java-agent/java-agent-02.md %}&#41;)

## 参考资料

Oracle

- java.lang.instrument API
  - [Java 8 LTS](https://docs.oracle.com/javase/8/docs/api/java/lang/instrument/package-summary.html)
  - [Java 9](https://docs.oracle.com/javase/9/docs/api/java/lang/instrument/package-summary.html)
  - [Java 11 LTS](https://docs.oracle.com/en/java/javase/11/docs/api/java.instrument/java/lang/instrument/package-summary.html)
  - [Java 17 LTS](https://docs.oracle.com/en/java/javase/17/docs/api/java.instrument/java/lang/instrument/package-summary.html)
- Attach API
  - Java 08: [Attach API](https://docs.oracle.com/javase/8/docs/jdk/api/attach/spec/overview-summary.html)
  - Java 11: [jdk.attach](https://docs.oracle.com/en/java/javase/11/docs/api/jdk.attach/module-summary.html)
  - Java 17: [jdk.attach](https://docs.oracle.com/en/java/javase/17/docs/api/jdk.attach/module-summary.html)
- JVMTI
  - Java 08: [JVM Tool Interface Version 1.2](https://docs.oracle.com/javase/8/docs/platform/jvmti/jvmti.html), [Java Virtual Machine Tool Interface (JVM TI)](https://docs.oracle.com/javase/8/docs/technotes/guides/jvmti/)
  - Java 11: [JVM Tool Interface Version 11.0](https://docs.oracle.com/en/java/javase/11/docs/specs/jvmti.html)
  - Java 17: [JVM Tool Interface Version 17.0](https://docs.oracle.com/en/java/javase/17/docs/specs/jvmti.html)

OpenJDK

- [JDK 8 Source Code](https://hg.openjdk.java.net/jdk8)
  - [Package sun](https://hg.openjdk.java.net/jdk8/jdk8/jdk/file/tip/src/share/classes/sun)
    - [com.sun.tools.attach Source Code](https://hg.openjdk.java.net/jdk8/jdk8/jdk/file/tip/src/share/classes/com/sun/tools/attach)
    - [sun.instrument Source Code](https://hg.openjdk.java.net/jdk8/jdk8/jdk/file/tip/src/share/classes/sun/instrument)

More

- [Reference Index]({% link _java-agent/java-agent-reference-index.md %})

![学习字节码技术 - lsieun.github.io](/assets/images/java/bytecode-lsieun.png)
