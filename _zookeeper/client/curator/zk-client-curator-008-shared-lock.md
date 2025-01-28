---
title: "分布式锁"
sequence: "108"
---

## Shared Reentrant Lock（InterProcessMutex）

```java
import org.apache.curator.RetryPolicy;
import org.apache.curator.framework.CuratorFramework;
import org.apache.curator.framework.CuratorFrameworkFactory;
import org.apache.curator.framework.recipes.locks.InterProcessMutex;
import org.apache.curator.retry.RetryNTimes;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.TimeUnit;

public class ZK_Curator_Shared_Lock_001_Reentrant {
    private static final Logger LOGGER = LoggerFactory.getLogger(ZK_Curator_Shared_Lock_001_Reentrant.class);

    public static void main(String[] args) throws Exception {
        // 第 1 步，创建 Client
        RetryPolicy retryPolicy = new RetryNTimes(3, 100);
        CuratorFramework client = CuratorFrameworkFactory.newClient(Const.ZK_CONNECTITON_STRING, retryPolicy);

        // 第 2 步，启动 Client
        client.start();

        // 第 3 步，操作

        // 第 3.1 步，定义锁
        InterProcessMutex lock = new InterProcessMutex(client, "/shared-lock");

        // 第 3.2 步，获取锁
        lock.acquire();

        // 第 3.3 步，做一些事情：模拟业务执行30秒
        LOGGER.warn("做一些事情：start");
        TimeUnit.SECONDS.sleep(30);
        LOGGER.warn("做一些事情：stop");

        // 第 3.4 步，释放锁
        lock.release();

        // 第 4 步，关闭 Client
        client.close();
    }
}
```

```text
> ls /
[shared-lock, zookeeper]

# 获取锁之后，会添加一条记录
> ls /shared-lock 
[_c_cf1f9179-d025-44ee-970a-06a32a2a662e-lock-0000000000]

# 释放锁之后，会清理相应的信息
> ls /shared-lock 
[]
```

## 各种配置

### 多线程

```java
import org.apache.curator.RetryPolicy;
import org.apache.curator.framework.CuratorFramework;
import org.apache.curator.framework.CuratorFrameworkFactory;
import org.apache.curator.framework.recipes.locks.InterProcessMutex;
import org.apache.curator.retry.RetryNTimes;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.TimeUnit;

public class ZK_Curator_Shared_Lock_002_MultiThread {
    private static final Logger LOGGER = LoggerFactory.getLogger(ZK_Curator_Shared_Lock_002_MultiThread.class);

    public static void main(String[] args) throws Exception {
        Runnable r = () -> {
            // 第 1 步，创建 Client
            RetryPolicy retryPolicy = new RetryNTimes(3, 100);
            CuratorFramework client = CuratorFrameworkFactory.newClient(Const.ZK_CONNECTITON_STRING, retryPolicy);

            // 第 2 步，启动 Client
            client.start();

            // 第 3 步，操作

            // 第 3.1 步，定义锁
            InterProcessMutex lock = new InterProcessMutex(client, "/InterProcessMutex");
            try {
                // 第 3.2 步，获取锁
                lock.acquire();

                // 第 3.3 步，做一些事情：模拟业务执行10秒
                LOGGER.warn("做一些事情：start");
                TimeUnit.SECONDS.sleep(10);
                LOGGER.warn("做一些事情：stop");
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                try {
                    // 第 3.4 步，释放锁
                    lock.release();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            // 第 4 步，关闭 Client
            client.close();
        };

        Thread t1 = new Thread(r, "任务1");
        Thread t2 = new Thread(r, "任务2");
        t1.start();
        t2.start();
    }
}
```

### 可重入

```java
import org.apache.curator.RetryPolicy;
import org.apache.curator.framework.CuratorFramework;
import org.apache.curator.framework.CuratorFrameworkFactory;
import org.apache.curator.framework.recipes.locks.InterProcessMutex;
import org.apache.curator.retry.RetryNTimes;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.TimeUnit;

public class ZK_Curator_Shared_Lock_003_Reentrant {
    private static final Logger LOGGER = LoggerFactory.getLogger(ZK_Curator_Shared_Lock_003_Reentrant.class);

    public static void main(String[] args) throws Exception {
        // 第 1 步，创建 Client
        RetryPolicy retryPolicy = new RetryNTimes(3, 100);
        CuratorFramework client = CuratorFrameworkFactory.newClient(Const.ZK_CONNECTITON_STRING, retryPolicy);

        // 第 2 步，启动 Client
        client.start();

        // 第 3 步，操作

        // 第 3.1 步，定义锁
        InterProcessMutex lock = new InterProcessMutex(client, "/shared-lock");

        a(lock);

        // 第 4 步，关闭 Client
        client.close();
    }

    private static void a(InterProcessMutex lock) throws Exception {
        // 获取锁
        lock.acquire();

        // 做一些事情：模拟业务执行3秒
        LOGGER.warn("做一些事情：start1");

        b(lock);

        LOGGER.warn("做一些事情：stop1");

        // 释放锁
        lock.release();
    }

    private static void b(InterProcessMutex lock) throws Exception {
        // 获取锁
        lock.acquire();

        // 做一些事情：模拟业务执行3秒
        LOGGER.warn("做一些事情：start2");
        TimeUnit.SECONDS.sleep(3);
        LOGGER.warn("做一些事情：stop2");

        // 释放锁
        lock.release();
    }
}
```

## Shared Lock（InterProcessSemaphoreMutex）

`InterProcessSemaphoreMutex` 也是一个排它锁，不同于 `InterProcessMutex` 的是，`InterProcessSemaphoreMutex` 不是一个可重入锁。

```java
import org.apache.curator.RetryPolicy;
import org.apache.curator.framework.CuratorFramework;
import org.apache.curator.framework.CuratorFrameworkFactory;
import org.apache.curator.framework.recipes.locks.InterProcessLock;
import org.apache.curator.framework.recipes.locks.InterProcessSemaphoreMutex;
import org.apache.curator.retry.RetryNTimes;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.TimeUnit;

public class ZK_Curator_Shared_Lock_004_Semaphore {
    private static final Logger LOGGER = LoggerFactory.getLogger(ZK_Curator_Shared_Lock_004_Semaphore.class);

    public static void main(String[] args) throws Exception {
        // 第 1 步，创建 Client
        RetryPolicy retryPolicy = new RetryNTimes(3, 100);
        CuratorFramework client = CuratorFrameworkFactory.newClient(Const.ZK_CONNECTITON_STRING, retryPolicy);

        // 第 2 步，启动 Client
        client.start();

        // 第 3 步，操作

        // 第 3.1 步，定义锁
        InterProcessLock lock = new InterProcessSemaphoreMutex(client, "/InterProcessSemaphoreMutex");

        try {
            // 第 3.2 步，获取锁
            boolean got = lock.acquire(30, TimeUnit.SECONDS);
            if (got) {
                // 第 3.3 步，做一些事情：模拟业务执行30秒
                LOGGER.warn("做一些事情：start");
                TimeUnit.SECONDS.sleep(30);
                LOGGER.warn("做一些事情：stop");
            } else {
                LOGGER.warn("未获取到锁");
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            // 第 3.4 步，释放锁
            lock.release();
        }

        // 第 4 步，关闭 Client
        client.close();
    }
}
```

```text
> ls /
[InterProcessSemaphoreMutex, zookeeper]

> ls /InterProcessSemaphoreMutex 
[leases]

> ls /InterProcessSemaphoreMutex/leases 
[_c_f16f9a62-9e61-4b70-bf38-d21273bf0a04-lease-0000000000]
```
