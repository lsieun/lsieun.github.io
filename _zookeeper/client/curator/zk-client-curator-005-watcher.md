---
title: "Watcher"
sequence: "105"
---

本版本中 `PathChildrenCache`、`NodeCache`、`TreeCache` 都已经是过期的了，官方推荐使用 `CuratorCache`。

`CuratorCacheListener` 提供了多种监听器，比如 `forInitialized`，`forCreates` 等。

## 初始化

```java
import org.apache.curator.RetryPolicy;
import org.apache.curator.framework.CuratorFramework;
import org.apache.curator.framework.CuratorFrameworkFactory;
import org.apache.curator.framework.recipes.cache.CuratorCache;
import org.apache.curator.framework.recipes.cache.CuratorCacheListener;
import org.apache.curator.retry.RetryNTimes;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.TimeUnit;

public class ZK_Curator_ZNode_Watcher_001_Initialized {
    private static final Logger LOGGER = LoggerFactory.getLogger(ZK_Curator_ZNode_Watcher_001_Initialized.class);

    public static void main(String[] args) throws Exception {
        // 第 1 步，创建 Client
        RetryPolicy retryPolicy = new RetryNTimes(3, 100);
        CuratorFramework client = CuratorFrameworkFactory.newClient(Const.ZK_CONNECTITON_STRING, retryPolicy);

        // 第 2 步，启动 Client
        client.start();

        // 第 3 步，操作
        CuratorCacheListener listener = CuratorCacheListener.builder()
                .forInitialized(() -> {
                    LOGGER.warn("========= forInitialized =========");
                })
                .build();

        // 第 3.1 步，创建 CuratorCache
        CuratorCache curatorCache = CuratorCache.builder(client, "/test-parent").build();

        // 第 3.2 步，添加监听器
        curatorCache.listenable().addListener(listener);

        // 第 3.3 步，启动 CuratorCache
        curatorCache.start();

        // 第 3.4 步，做一些事情（保证连接不关闭）
        LOGGER.warn("Sleep 3 seconds - start!");
        TimeUnit.SECONDS.sleep(3);
        LOGGER.warn("Sleep 3 seconds - stop!");

        // 第 3.5 步，关闭 CuratorCache
        curatorCache.close();

        // 第 4 步，关闭 Client
        client.close();
    }
}
```

## 节点：创建、更新和删除

```java
import org.apache.curator.RetryPolicy;
import org.apache.curator.framework.CuratorFramework;
import org.apache.curator.framework.CuratorFrameworkFactory;
import org.apache.curator.framework.recipes.cache.CuratorCache;
import org.apache.curator.framework.recipes.cache.CuratorCacheListener;
import org.apache.curator.retry.RetryNTimes;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.nio.charset.StandardCharsets;
import java.util.concurrent.TimeUnit;

public class ZK_Curator_ZNode_Watcher_002_Create_Update_Delete {
    private static final Logger LOGGER = LoggerFactory.getLogger(ZK_Curator_ZNode_Watcher_002_Create_Update_Delete.class);

    public static void main(String[] args) throws Exception {
        // 第 1 步，创建 Client
        RetryPolicy retryPolicy = new RetryNTimes(3, 100);
        CuratorFramework client = CuratorFrameworkFactory.newClient(Const.ZK_CONNECTITON_STRING, retryPolicy);

        // 第 2 步，启动 Client
        client.start();

        // 第 3 步，操作
        CuratorCacheListener listener = CuratorCacheListener.builder()
                .forCreates(childData -> {
                    String path = childData.getPath();
                    byte[] bytes = childData.getData();
                    String data = bytes == null ? "" : new String(bytes, StandardCharsets.UTF_8);

                    LOGGER.warn("forCreates: path=[{}], data=[{}]", path, data);
                })
                .forChanges((oldNode, node) -> {

                    String oldPath = oldNode.getPath();
                    byte[] oldBytes = oldNode.getData();
                    String oldData = oldBytes == null ? "" : new String(oldBytes, StandardCharsets.UTF_8);

                    String newPath = node.getPath();
                    byte[] newBytes = node.getData();
                    String newData = newBytes == null ? "" : new String(newBytes, StandardCharsets.UTF_8);

                    LOGGER.warn("forChanges: oldNode.path=[{}], oldNode.data=[{}], node.path=[{}], node.data=[{}]",
                            oldPath, oldData, newPath, newData
                    );
                })
                .forDeletes(childData -> {
                    String path = childData.getPath();
                    byte[] bytes = childData.getData();
                    String data = bytes == null ? "" : new String(bytes, StandardCharsets.UTF_8);

                    LOGGER.warn("forDeletes: path=[{}], data=[{}]", path, data);
                })
                .build();

        // 第 3.1 步，创建 CuratorCache
        CuratorCache curatorCache = CuratorCache.builder(client, "/test-parent").build();

        // 第 3.2 步，添加监听器
        curatorCache.listenable().addListener(listener);

        // 第 3.3 步，启动 CuratorCache
        curatorCache.start();

        // 第 3.4 步，做一些事情（保证连接不关闭）
        TimeUnit.MINUTES.sleep(3);

        // 第 3.5 步，关闭 CuratorCache
        curatorCache.close();

        // 第 4 步，关闭 Client
        client.close();
    }
}
```

## CuratorCache 配置选项

### 监控范围

CuratorCache.Options.SINGLE_NODE_CACHE：单节点缓存

CuratorCache.Options.COMPRESSED_DATA：通过以下方式解压缩数据 org.apache.curator.framework.api.GetDataBuilder.decompressed()

CuratorCache.Options.DO_NOT_CLEAR_ON_CLOSE：通常，当缓存通过 关闭 close()时，存储将通过 清除 CuratorCacheStorage.clear()。此选项可防止清除存储。
