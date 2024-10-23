---
title: "License: NoPopup"
sequence: "104"
---

[UP](/ide/intellij-idea-index.html)

## 前提

给 Verify 方法加上 Stack Trace

## product.jar

清空方法：

```text
com.intellij.ide.b.m.M::b:(Ljava/lang/String;Z)V
```


```text
[METHOD  ENTER] com/jetbrains/b/Q/B::b:(Ljava/lang/String;JLjava/lang/String;[Lcom/jetbrains/b/Q/a;)V >>>>>>>>>>>>>>>>>>>>>>>>>>>
Thread: ApplicationImpl pooled thread 2@64(false)
    com.jetbrains.b.Q.B::b:(Ljava/lang/String;JLjava/lang/String;[Lcom/jetbrains/b/Q/a;)V:bci=64:Thread@64   <--------- 这个方法是验证方法
    com.jetbrains.b.Q.B::b:(Ljava/lang/String;JB[Lcom/jetbrains/b/Q/a;)Lcom/jetbrains/b/Q/bY;:bci=66:Thread@64
    com.intellij.ide.Q.c::b:(Ljava/nio/file/Path;)Ljava/util/Map$Entry;:bci=164:Thread@64   <--------- 这个应该是读取本地文件
    com.intellij.ide.Q.c::b:()Ljava/lang/Object;:bci=44:Thread@64
    com.intellij.ide.b.m.M::b:(JLjava/lang/String;)V:bci=105:Thread@64
    com.intellij.ide.b.m.I::b:(JLcom/intellij/ide/b/m/b4;)Lcom/intellij/ide/b/m/s;:bci=74:Thread@64
    com.intellij.ide.b.m.t::p:(J)V:bci=85:Thread@64
    com.intellij.ide.b.m.t::Q:()V:bci=437:Thread@64
    com.intellij.util.concurrency.ContextRunnable::run:()V:bci=24:Thread@64
    java.util.concurrent.ThreadPoolExecutor::runWorker:(Ljava/util/concurrent/ThreadPoolExecutor$Worker;)V:bci=92:Thread@64
    java.util.concurrent.ThreadPoolExecutor$Worker::run:()V:bci=5:Thread@64
    java.util.concurrent.Executors$PrivilegedThreadFactory$1$1::run:()Ljava/lang/Void;:bci=23:Thread@64
    java.util.concurrent.Executors$PrivilegedThreadFactory$1$1::run:()Ljava/lang/Object;:bci=1:Thread@64
    java.security.AccessController::doPrivileged:(Ljava/security/PrivilegedAction;Ljava/security/AccessControlContext;)Ljava/lang/Object;:bci=13:Thread@64
    java.util.concurrent.Executors$PrivilegedThreadFactory$1::run:()V:bci=15:Thread@64
    java.lang.Thread::run:()V:bci=19:Thread@64
[METHOD RETURN] com/jetbrains/b/Q/B::b:(Ljava/lang/String;JLjava/lang/String;[Lcom/jetbrains/b/Q/a;)V <<<<<<<<<<<<<<<<<<<<<<<<<<<
[METHOD  ENTER] com/jetbrains/b/Q/B::b:(Ljava/lang/String;JLjava/lang/String;[Lcom/jetbrains/b/Q/a;)V >>>>>>>>>>>>>>>>>>>>>>>>>>>
Thread: ApplicationImpl pooled thread 8@145(false)
    com.jetbrains.b.Q.B::b:(Ljava/lang/String;JLjava/lang/String;[Lcom/jetbrains/b/Q/a;)V:bci=64:Thread@145   <--------- 这个方法是验证方法
    com.intellij.ide.b.m.I::b:(Ljava/lang/String;Ljava/util/function/Consumer;JB)Lcom/intellij/ide/b/m/b4;:bci=281:Thread@145
    com.intellij.ide.b.m.M::b:(Ljava/lang/String;Z)V:bci=67:Thread@145   <--------- 清空这个方法
    java.util.concurrent.Executors$RunnableAdapter::call:()Ljava/lang/Object;:bci=4:Thread@145
    com.intellij.util.concurrency.ContextCallable::call:()Ljava/lang/Object;:bci=24:Thread@145
    java.util.concurrent.FutureTask::run:()V:bci=39:Thread@145
    com.intellij.util.concurrency.SchedulingWrapper$MyScheduledFutureTask::run:()V:bci=8:Thread@145
    java.util.concurrent.ThreadPoolExecutor::runWorker:(Ljava/util/concurrent/ThreadPoolExecutor$Worker;)V:bci=92:Thread@145
    java.util.concurrent.ThreadPoolExecutor$Worker::run:()V:bci=5:Thread@145
    java.util.concurrent.Executors$PrivilegedThreadFactory$1$1::run:()Ljava/lang/Void;:bci=23:Thread@145
    java.util.concurrent.Executors$PrivilegedThreadFactory$1$1::run:()Ljava/lang/Object;:bci=1:Thread@145
    java.security.AccessController::doPrivileged:(Ljava/security/PrivilegedAction;Ljava/security/AccessControlContext;)Ljava/lang/Object;:bci=13:Thread@145
    java.util.concurrent.Executors$PrivilegedThreadFactory$1::run:()V:bci=15:Thread@145
    java.lang.Thread::run:()V:bci=19:Thread@145
[METHOD RETURN] com/jetbrains/b/Q/B::b:(Ljava/lang/String;JLjava/lang/String;[Lcom/jetbrains/b/Q/a;)V <<<<<<<<<<<<<<<<<<<<<<<<<<<
```






