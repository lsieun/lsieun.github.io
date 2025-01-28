---
layout: post
title: Resources
permalink: /resources/
published: false
---



## 潜在的课程方向

### APT

APT（Annotation Processing Tool）即注解处理器，它是一种处理注解的工具，也是javac中的一个工具。APT可以用来在编译时扫描和处理注解。

### 简单APM

简单的APM、调用链项目。

在HTTP请求入口插桩获取请求、响应相关信息，进行一些安全分析。获取SQL查询结果，脱敏处理。安全检测。使用ASM技术，动态插入检测逻辑。

- [threedr3am/gadgetinspector](https://github.com/threedr3am/gadgetinspector)
- [JackOfMostTrades/gadgetinspector](https://github.com/JackOfMostTrades/gadgetinspector)

- [btraceio/btrace](https://github.com/btraceio/btrace)

- [alibaba/arthas](https://github.com/alibaba/arthas)
- [alibaba/bytekit](https://github.com/alibaba/bytekit)

- [gmu-swe/phosphor](https://github.com/gmu-swe/phosphor): Dynamic Taint Tracking for the JVM
- [Programming-Systems-Lab/phosphor](https://github.com/Programming-Systems-Lab/phosphor)

- [SkyWalking](https://skywalking.apache.org/)
- [Github: skywalking-java](https://github.com/apache/skywalking-java)

- RASP: Runtime application self-protection
- WAF: Web Application Firewall Web应用防火墙

### 测试方向

- [精准测试：基于 asm+javaparser 调用链差异化对比实践](https://testerhome.com/topics/23819)
- [JavaParser](http://javaparser.org/)
- [Github: javaparser](https://github.com/javaparser/javaparser)

### Code Coverage

- [JaCoCo: Java Code Coverage Library](https://www.eclemma.org/jacoco/): JaCoCo is a free code coverage library for
  Java, which has been created by the EclEmma team based on the lessons learned from using and integration existing
  libraries for many years.
    - [Github: jacoco/jacoco](https://github.com/jacoco/jacoco)
- [Cobertura](http://cobertura.sourceforge.net/) is a free Java code coverage reporting tool.
    - [Github: cobertura/cobertura](https://github.com/cobertura/cobertura)

有位同学在群里提了一个问题，说JaCoCo会将`Long`类型转换成`boolean[]`类型，而且不出错。后来发现，原来是修改了`equals`
方法，在这里[Coverage Runtime Dependency](https://www.jacoco.org/jacoco/trunk/doc/implementation.html)
找到了答案。相应的`equals`
所在的类是[org.jacoco.core.runtime.RuntimeData](https://github.com/jacoco/jacoco/blob/master/org.jacoco.core/src/org/jacoco/core/runtime/RuntimeData.java)
类。

### JVM-SANDBOX

- [JVM-SANDBOX](https://github.com/alibaba/jvm-sandbox)（沙箱），JVM SandBox 是阿里实现了一种在不重启、不侵入目标JVM应用的AOP解决方案。

agent反复卸载、加载，可以参考jvm-sandbox和jvm-sandbox-repeater

### xxx

Annotation Processor, Antlr实战、IDEA plugin

Java APT(Annotation Process Tool)

- [OSHI](https://github.com/oshi/oshi) is a free JNA-based (native) **Operating System and Hardware Information**
  library for Java. It does not require the installation of any additional native libraries and aims to provide a
  cross-platform implementation to retrieve system information, such as OS version, processes, memory and CPU usage,
  disks and partitions, devices, sensors, etc.

### JMH

- [JMH](http://openjdk.java.net/projects/code-tools/jmh/) is a Java harness for building, running, and analysing
  nano/micro/milli/macro benchmarks written in Java and other languages targetting the JVM.
- [JOL](https://openjdk.java.net/projects/code-tools/jol/)  (Java Object Layout) is the tiny toolbox to analyze object
  layout schemes in JVMs. These tools are using Unsafe, JVMTI, and Serviceability Agent (SA) heavily to decoder the
  actual object layout, footprint, and references. This makes JOL much more accurate than other tools relying on heap
  dumps, specification assumptions, etc.

### FindBugs

- [FindBugs](http://findbugs.sourceforge.net/)
- [https://spotbugs.github.io/](https://spotbugs.github.io/)

- [Soot](https://github.com/soot-oss/soot): Soot is a Java optimization framework.

### Java Agent

- [alibaba/jvm-sandbox](https://github.com/alibaba/jvm-sandbox): Realtime non-invasive AOP framework container based on JVM
- [btraceio/btrace](https://github.com/btraceio/btrace): A safe, dynamic tracing tool for the Java platform
- [serkan-ozal/mysafe](https://github.com/serkan-ozal/mysafe)
- [serkan-ozal/jillegal-agent](https://github.com/serkan-ozal/jillegal-agent)

Github

- [alibaba](https://github.com/alibaba)
    - [alibaba/arthas](https://github.com/alibaba/arthas)
    - [alibaba/jvm-sandbox](https://github.com/alibaba/jvm-sandbox)
- [elastic/apm-agent-java](https://github.com/elastic/apm-agent-java)
- [google/allocation-instrumenter](https://github.com/google/allocation-instrumenter)
- [newrelic/newrelic-java-agent](https://github.com/newrelic/newrelic-java-agent)
- [reactor/BlockHound](https://github.com/reactor/BlockHound)
- [serkan-ozal/mysafe](https://github.com/serkan-ozal/mysafe)
- [serkan-ozal/jillegal-agent](https://github.com/serkan-ozal/jillegal-agent)
- [vsilaev/tascalate-instrument](https://github.com/vsilaev/tascalate-instrument)
- [nickman](https://github.com/nickman)
    - [nickman/retransformer](https://github.com/nickman/retransformer)
    - [nickman/NativeJavaAgent](https://github.com/nickman/NativeJavaAgent)
    - [nickman/jmxlocal](https://github.com/nickman/jmxlocal)
    - [nickman/JMXMPAgent](https://github.com/nickman/JMXMPAgent)
    - [nickman/JavaAgentLoader](https://github.com/nickman/JavaAgentLoader)

### ASM

- [Col-E/Recaf](https://github.com/Col-E/Recaf)

### sa-jdi.jar

sa-jdi.jar是HotSpot自带的底层调试支持,Serviceability Agent

- [VmConsole-Api](https://github.com/tzfun/VmConsole-Api)

### Mock

- [WireMock](https://www.baeldung.com/introduction-to-wiremock)

### Java安全

目前Java安全最前沿的技术之一就是RASP，而这个技术最核心的部分就是Java Agent和ASM，所以和老师技术栈很符合

- [javasec](https://javasec.org/)
- [HackJava/HackJava](https://github.com/HackJava/HackJava)
- [灵蜥安全](https://www.lingxe.com/)

嗯，确实是比较模糊的，我能想到的字节码在安全中的应用：

1. 比如我在搞的程序分析，分析字节码来找出漏洞
2. 一些攻击工具需要动态构造字节码，例如weblogic和jndi相关的漏洞
3. java安全前沿的RASP技术核心是字节码

第一点主要是蚂蚁集团有程序分析相关的安全岗，第二点是各大安全公司招聘开发攻击工具的人，第三点是阿里和安全公司都在做的，做产品卖钱

### 画图

- [jgrapht](https://jgrapht.org/)
- [nidi3/graphviz-java](https://github.com/nidi3/graphviz-java)

