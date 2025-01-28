---
title: "计数器"
sequence: "107"
---

```java
import org.apache.curator.RetryPolicy;
import org.apache.curator.framework.CuratorFramework;
import org.apache.curator.framework.CuratorFrameworkFactory;
import org.apache.curator.framework.recipes.shared.SharedCount;
import org.apache.curator.framework.recipes.shared.SharedCountListener;
import org.apache.curator.framework.recipes.shared.SharedCountReader;
import org.apache.curator.framework.state.ConnectionState;
import org.apache.curator.retry.RetryNTimes;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class SharedCounter_A_Listen {
    private static final Logger LOGGER = LoggerFactory.getLogger(SharedCounter_A_Listen.class);

    public static void main(String[] args) throws Exception {
        // 第 1 步，创建 Client
        RetryPolicy retryPolicy = new RetryNTimes(3, 100);
        CuratorFramework client = CuratorFrameworkFactory.newClient(Const.ZK_CONNECTITON_STRING, retryPolicy);

        // 第 2 步，启动 Client
        client.start();

        // 第 3 步，操作
        ExecutorService EXECUTOR_SERVICE = Executors.newCachedThreadPool();

        // 第 3.1 步，创建 SharedCount
        SharedCount sharedCount = new SharedCount(client, "/ShareCount", 0);

        // 第 3.2 步，添加 Listener
        sharedCount.addListener(new SharedCountListener() {
            @Override
            public void countHasChanged(SharedCountReader sharedCountReader, int newCount) throws Exception {
                LOGGER.warn("countHasChanged: {}", newCount);
            }

            @Override
            public void stateChanged(CuratorFramework client, ConnectionState newState) {
                LOGGER.warn("stateChanged: {}", newState);
            }
        }, EXECUTOR_SERVICE);

        // 第 3.3 步，启动 SharedCount
        LOGGER.warn("sharedCount.start");
        sharedCount.start();

        // 第 3.4 步，做一些事情
        TimeUnit.MINUTES.sleep(1);

        // 第 3.5 步，关闭 SharedCount
        sharedCount.close();
        LOGGER.warn("sharedCount.close");

        EXECUTOR_SERVICE.shutdown();

        // 第 4 步，关闭 Client
        client.close();
    }
}
```

```java
import org.apache.curator.RetryPolicy;
import org.apache.curator.framework.CuratorFramework;
import org.apache.curator.framework.CuratorFrameworkFactory;
import org.apache.curator.framework.recipes.shared.SharedCount;
import org.apache.curator.retry.RetryNTimes;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.TimeUnit;

public class SharedCounter_B_Modify {
    private static final Logger LOGGER = LoggerFactory.getLogger(SharedCounter_B_Modify.class);

    public static void main(String[] args) throws Exception {
        // 第 1 步，创建 Client
        RetryPolicy retryPolicy = new RetryNTimes(3, 100);
        CuratorFramework client = CuratorFrameworkFactory.newClient(Const.ZK_CONNECTITON_STRING, retryPolicy);

        // 第 2 步，启动 Client
        client.start();

        // 第 3 步，操作

        // 第 3.1 步，创建 SharedCount
        SharedCount sharedCount = new SharedCount(client, "/ShareCount", 0);

        // 第 3.2 步，启动 SharedCount
        sharedCount.start();

        // 第 3.3 步，修改 SharedCount 的值
        for (int i = 0; i < 5; i++) {
            sharedCount.setCount(i);
            LOGGER.warn("setCount: {}", i);
            TimeUnit.SECONDS.sleep(1);
        }

        // 第 3.4 步，关闭 SharedCount
        sharedCount.close();


        // 第 4 步，关闭 Client
        client.close();
    }
}
```
