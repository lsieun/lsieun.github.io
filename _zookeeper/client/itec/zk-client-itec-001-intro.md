---
title: "客户端（Java）"
sequence: "105"
---

## ZkClient

ZkClient 是 Github 上一个开源的 ZooKeeper 客户端，
在 ZooKeeper 原生 API 接口之上进行了包装，是一个更易用的 ZooKeeper 客户端。

```text
https://github.com/sgroschupf/zkclient
```

另外，ZKClient 在内部还实现了诸如 Session 超时重连、Watcher 反复注册等功能。

接下来，还是从创建会话、创建节点、读取数据、更新数据、删除节点等方面来介绍如何使用 ZkClient 这个 ZooKeeper 客户端。

## pom.xml

```xml
<dependency>
    <groupId>org.apache.zookeeper</groupId>
    <artifactId>zookeeper</artifactId>
    <version>3.9.1</version>
</dependency>
```

```xml
<dependency>
    <groupId>com.101tec</groupId>
    <artifactId>zkclient</artifactId>
    <version>0.11</version>
</dependency>
```

## 代码

### 创建会话

```java
import org.I0Itec.zkclient.ZkClient;

public class ZKC2_01_Session {
    public static void main(String[] args) {
        String severString = "192.168.80.131:2181,192.168.80.132:2181,192.168.80.133:2181";

        // 第 1 步，创建 Client
        ZkClient zkClient = new ZkClient(severString);

        // 第 2 步，操作
        boolean exists = zkClient.exists("/zookeeper");
        System.out.println("exists = " + exists);

        // 第 3 步，关闭 Client
        zkClient.close();
    }
}
```

### 创建节点

ZkClient 提供了递归创建节点的接口：先创建父节点，再创建子节点

```java
import org.I0Itec.zkclient.ZkClient;

public class ZKC2_02_ZNode_Create {
    public static void main(String[] args) {
        String severString = "192.168.80.131:2181,192.168.80.132:2181,192.168.80.133:2181";
        
        // 第 1 步，创建 Client
        ZkClient zkClient = new ZkClient(severString);

        // 第 2 步，操作
        zkClient.createPersistent("/test-parent/test-child", true);

        // 第 3 步，关闭 Client
        zkClient.close();
    }
}
```

### 删除节点

ZkClient 提供了递归删除节点的接口：先删除所有子节点，再删除父节点。

```java
import org.I0Itec.zkclient.ZkClient;

public class ZKC2_03_ZNode_Delete {
    public static void main(String[] args) {
        String severString = "192.168.80.131:2181,192.168.80.132:2181,192.168.80.133:2181";

        // 第 1 步，创建 Client
        ZkClient zkClient = new ZkClient(severString);

        // 第 2 步，操作
        String path = "/test-parent/test-child";
        boolean flag = zkClient.deleteRecursive(path);
        System.out.println("flag = " + flag);

        // 第 3 步，关闭 Client
        zkClient.close();
    }
}
```

### 监听节点变化

- 监听器，可以对不存在的目录进行监听
- 监听目录下，子节点发生改变，可以接收到通知
- 监听目录，自身的创建和删除，也会被监听到

```java
import org.I0Itec.zkclient.IZkChildListener;
import org.I0Itec.zkclient.ZkClient;

import java.util.List;

public class ZKC2_04_ZNode_Child_Changes {
    public static void main(String[] args) throws Exception {
        String severString = "192.168.80.131:2181,192.168.80.132:2181,192.168.80.133:2181";

        // 第 1 步，创建 Client
        ZkClient zkClient = new ZkClient(severString);

        // 第 2 步，操作
        // 注册一个监听事件
        zkClient.subscribeChildChanges("/test-parent", new IZkChildListener() {
            @Override
            public void handleChildChange(String parentPath, List<String> currentChilds) throws Exception {
                String msg = String.format("parentPath = %s, currentChilds = %s",
                        parentPath,
                        currentChilds
                );
                System.out.println(msg);
            }
        });

        // 创建父节点
        zkClient.createPersistent("/test-parent");
        Thread.sleep(1000);

        // 创建子节点
        zkClient.createPersistent("/test-parent/test-child");
        Thread.sleep(1000);

        // 删除子节点
        zkClient.delete("/test-parent/test-child");
        Thread.sleep(1000);

        // 删除父节点
        zkClient.delete("/test-parent");
        Thread.sleep(1000);

        // 第 3 步，关闭 Client
        zkClient.close();
    }
}
```

### 监听数据变化

监听数据变化：节点是否存在、更新、删除

```java
import org.I0Itec.zkclient.IZkDataListener;
import org.I0Itec.zkclient.ZkClient;

public class ZKC2_05_ZNode_Data_Change {
    public static void main(String[] args) throws Exception {
        String severString = "192.168.80.131:2181,192.168.80.132:2181,192.168.80.133:2181";

        // 第 1 步，创建 Client
        ZkClient zkClient = new ZkClient(severString);

        // 第 2 步，操作
        String path = "/test-ephemeral";
        boolean exists = zkClient.exists(path);
        if (!exists) {
            zkClient.createEphemeral(path, "Hello ZooKeeper");
        }

        // 注册监听
        zkClient.subscribeDataChanges(path, new IZkDataListener() {
            @Override
            public void handleDataChange(String dataPath, Object data) throws Exception {
                String msg = String.format("dataPath = %s, data = %s [CHANGE]",
                        dataPath, data
                );
                System.out.println(msg);
            }

            @Override
            public void handleDataDeleted(String dataPath) throws Exception {
                String msg = String.format("dataPath = %s [DELETED]",
                        dataPath
                );
                System.out.println(msg);
            }
        });

        // 获取节点内容
        Object data = zkClient.readData(path);
        System.out.println("data = " + data);
        Thread.sleep(1000);

        // 修改节点内容
        zkClient.writeData(path, "Abc");
        Thread.sleep(1000);

        // 删除节点
        zkClient.delete(path);
        Thread.sleep(1000);

        // 第 3 步，关闭 Client
        zkClient.close();
    }
}
```

## Reference

- [使用Java操作Zookeeper](https://www.cnblogs.com/-beyond/p/10993893.html)
