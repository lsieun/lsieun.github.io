---
title: "Future Intro"
sequence: "101"
---

[UP](/netty.html)


在异步处理时，经常用到这两个接口

首先要说明 netty 中的 Future 与 jdk 中的 Future 同名，但是是两个接口，
netty 的 Future 继承自 jdk 的 Future，而 Promise 又对 netty Future 进行了扩展

- jdk Future 只能同步等待任务结束（或成功、或失败）才能得到结果
- netty Future 可以同步等待任务结束得到结果，也可以异步方式得到结果，但都是要等任务结束
- netty Promise 不仅有 netty Future 的功能，而且脱离了任务独立存在，只作为两个线程间传递结果的容器


## JDK Future

`Future`，就是线程之间传递数据的『容器』。

```java
import lombok.extern.slf4j.Slf4j;

import java.util.concurrent.*;

import static lsieun.utils.ConsoleColors.color;

@Slf4j
public class HelloWorld {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        // 1. 线程池
        ExecutorService pool = Executors.newFixedThreadPool(2);

        // 2. 提交任务
        Future<Integer> future = pool.submit(new Callable<Integer>() {
            @Override
            public Integer call() throws Exception {
                log.info(color("执行计算"));
                Thread.sleep(1000);
                return 50;
            }
        });

        // 3. 主线程通过 future 来获取结果
        log.info(color("等待结果"));
        log.info(color("结果是 {}"), future.get());
        
        // 4. 关闭线程池
        pool.shutdown();
    }
}
```

## Netty Future

### 阻塞

```java
import io.netty.channel.EventLoop;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.util.concurrent.Future;
import lombok.extern.slf4j.Slf4j;

import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;

import static lsieun.utils.ConsoleColors.color;

@Slf4j
public class HelloWorld {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        // 1. 线程池
        EventLoopGroup group = new NioEventLoopGroup(1);
        EventLoop eventLoop = group.next();

        // 2. 提交任务
        Future<Integer> future = eventLoop.submit(new Callable<Integer>() {
            @Override
            public Integer call() throws Exception {
                log.info(color("执行计算"));
                Thread.sleep(1000);
                return 50;
            }
        });

        // 3. 主线程通过 future 来获取结果
        log.info(color("等待结果"));
        log.info(color("结果是 {}"), future.get());

        // 4. 关闭线程池
        group.shutdownGracefully();
    }
}
```

### 非阻塞 - 回调

```java
import io.netty.channel.EventLoop;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.util.concurrent.Future;
import io.netty.util.concurrent.GenericFutureListener;
import lombok.extern.slf4j.Slf4j;

import java.util.concurrent.Callable;

import static lsieun.utils.ConsoleColors.color;

@Slf4j
public class HelloWorld {
    public static void main(String[] args) {
        // 1. 线程池
        EventLoopGroup group = new NioEventLoopGroup(3);
        EventLoop eventLoop = group.next();

        // 2. 提交任务
        Future<Integer> future = eventLoop.submit(new Callable<Integer>() {
            @Override
            public Integer call() throws Exception {
                log.info(color("执行计算"));
                Thread.sleep(1000);
                return 50;
            }
        });

        // 3. 通过回调方式来获取结果
        future.addListener(new GenericFutureListener<Future<? super Integer>>() {
            @Override
            public void operationComplete(Future<? super Integer> future) throws Exception {
                log.info(color("等待结果"));
                log.info(color("结果是 {}"), future.get());

                group.shutdownGracefully();
            }
        });
    }
}
```

## Netty Promise

```java
import io.netty.channel.EventLoop;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.util.concurrent.DefaultPromise;
import lombok.extern.slf4j.Slf4j;

import static lsieun.utils.ConsoleColors.color;

@Slf4j
public class HelloWorld {
    public static void main(String[] args) throws Exception {
        // 1. 准备 EventLoop 对象
        EventLoop eventLoop = new NioEventLoopGroup().next();

        // 2. 可以主动创建 promise （结果容器）
        DefaultPromise<Integer> promise = new DefaultPromise<>(eventLoop);

        // 3. 任意一个线程执行计算，计算完毕后向 promise 填充结果
        new Thread(() -> {
            log.info(color("开始计算..."));
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            log.info(color("设置结果..."));
            promise.setSuccess(80);
        }).start();

        // 4. 接收结果的线程
        log.info(color("等待结果..."));
        log.info(color("结果是：{}"), promise.get());
    }
}
```
