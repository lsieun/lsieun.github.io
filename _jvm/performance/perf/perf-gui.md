---
title: "调优：GUI"
sequence: "103"
---

## 工具概述

命令行工具存在一些局限性：

- 第一，无法获取方法级别的分析数据，如方法间的调用关系、各方法的调用次数和调用时间等，这些对定位应用性能瓶颈至关重要
- 第二，要求用户登录到目标Java应用所在的宿主机上，使用起来不是很方便
- 第三，分析数据通过终端输出，结果显示不够直观

图形化综合诊断工具：

- JDK自带的工具
  - JConsole：JDK自带的可视化监控工具，可以查看Java应用程序的运行概况，监控堆信息、永久区/元空间的使用情况、类加载情况等
  - Visual VM：可用于查看Java虚拟机上运行的基于Java技术的应用程序的详细信息。
  - JMC: Java Mission Control，内置Java Flight Recorder，能够以极低的性能开销收集Java虚拟机的性能数据。
- 第三方工具
  - MAT：Memory Analyzer Tool是基于Eclipse的内存分析工具，是一个快速、功能丰富的Java Heap分析工具，
    它可以帮助我们查找内存和减少内存消耗，Eclipse插件形式
  - JProfiler：商业软件，需要付费，功能强大
  - Arthas：Alibaba开源的Java诊断工具
  - BTrace：Java运行时追踪工具，可以在不停机的情况下，跟踪指定的方法调用、构造函数调用和系统内存信息。

## JConsole

## Visual VM

## Eclipse MAT

MAT（Memory Analyzer Tool）工具是一款功能强大的Java堆分析器，可以用于查找内存泄漏以及查看内存消耗情况。

MAT是基于Eclipse开发的，不仅可以单独使用，还可以作为插件的形式嵌入到Eclipse中使用。
是一款免费的性能分析工具，使用起来非常方法。

[Memory Analyzer (MAT)](https://www.eclipse.org/mat/)


The Eclipse Memory Analyzer is a fast and feature-rich **Java heap analyzer**
that helps you find memory leaks and reduce memory consumption.

Use the Memory Analyzer to analyze productive heap dumps
with hundreds of millions of objects,
quickly calculate the retained sizes of objects,
see who is preventing the Garbage Collector from collecting objects,
run a report to automatically extract leak suspects.

MAT并不是一个万能工具，它并不能处理所有类型的堆存储文件。
但是比较主流的厂家和格式，例如Sun、HP、SAP所采用的HPROF二进制堆存储文件，
以及IBM的PHD堆存储文件等都能被很好的解析。

MAT最吸引人的是能够快速为开发人员生成**内存泄漏报表**，方便定位问题和分析问题。
虽然MAT有如此强大的功能，但是内存分析也没有简单到一键完成的程度，
很多内存问题还是需要我们从MAT展现给我们的信息当中通过经验和直接来判断才能发现。

## JProfiler

## Arthas

## Java Mission Control

## BTrace

## Flame Graphs

https://www.bilibili.com/video/BV1PJ411n7xZ?p=320
