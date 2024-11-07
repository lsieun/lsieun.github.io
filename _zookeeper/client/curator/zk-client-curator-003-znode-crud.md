---
title: "节点管理"
sequence: "103"
---

## 基础

### 检查节点是否存在

```text
Stat stat = client.checkExists().forPath(path);
```



```java
import org.apache.curator.RetryPolicy;
import org.apache.curator.framework.CuratorFramework;
import org.apache.curator.framework.CuratorFrameworkFactory;
import org.apache.curator.retry.RetryNTimes;
import org.apache.zookeeper.data.Stat;

public class ZK_Curator_ZNode_CRUD_001_A_Exists {
    public static void main(String[] args) throws Exception {
        // 第 1 步，创建 Client
        RetryPolicy retryPolicy = new RetryNTimes(3, 100);
        CuratorFramework client = CuratorFrameworkFactory.newClient(Const.ZK_CONNECTITON_STRING, retryPolicy);

        // 第 2 步，启动 Client
        client.start();

        // 第 3 步，操作
        String path = "/";
        Stat stat = client.checkExists().forPath(path);
        System.out.println("stat = " + stat);

        // 第 4 步，关闭 Client
        client.close();
    }
}
```

```text
stat = 0,0,0,0,0,14,0,0,0,6,4294967369
```

![](/assets/images/zookeeper/client/curator/check-exists-stat-fields.png)


## 创建节点

```java
import org.apache.curator.RetryPolicy;
import org.apache.curator.framework.CuratorFramework;
import org.apache.curator.framework.CuratorFrameworkFactory;
import org.apache.curator.retry.RetryNTimes;

public class ZKC3_003_ZNode_A_Create {
    public static void main(String[] args) throws Exception {
        // 第 1 步，创建 Client
        RetryPolicy retryPolicy = new RetryNTimes(3, 100);
        CuratorFramework client = CuratorFrameworkFactory.newClient(Const.ZK_CONNECTITON_STRING, retryPolicy);

        // 第 2 步，启动 Client
        client.start();

        // 第 3 步，操作
        String path = client.create().forPath("/test");
        System.out.println("path = " + path);

        // 第 4 步，关闭 Client
        client.close();
    }
}
```

### 创建单一节点

```java
import org.apache.curator.RetryPolicy;
import org.apache.curator.framework.CuratorFramework;
import org.apache.curator.framework.CuratorFrameworkFactory;
import org.apache.curator.retry.RetryNTimes;
import org.apache.zookeeper.CreateMode;

import java.nio.charset.StandardCharsets;

public class ZKC3_003_ZNode_A_Create {
    public static void main(String[] args) throws Exception {
        // 第 1 步，创建 Client
        RetryPolicy retryPolicy = new RetryNTimes(3, 100);
        CuratorFramework client = CuratorFrameworkFactory.newClient(Const.ZK_CONNECTITON_STRING, retryPolicy);

        // 第 2 步，启动 Client
        client.start();

        // 第 3 步，操作
        String path = client.create()
                .withProtection()
                .withMode(CreateMode.EPHEMERAL_SEQUENTIAL)
                .forPath("/curator-node", "Hello ZooKeeper".getBytes(StandardCharsets.UTF_8));
        System.out.println("path = " + path);

        Thread.sleep(30000);

        // 第 4 步，关闭 Client
        client.close();
    }
}
```

### 创建层级节点

```java
import org.apache.curator.RetryPolicy;
import org.apache.curator.framework.CuratorFramework;
import org.apache.curator.framework.CuratorFrameworkFactory;
import org.apache.curator.retry.RetryNTimes;

public class ZKC3_003_ZNode_A_Create {
    public static void main(String[] args) throws Exception {
        // 第 1 步，创建 Client
        RetryPolicy retryPolicy = new RetryNTimes(3, 100);
        CuratorFramework client = CuratorFrameworkFactory.newClient(Const.ZK_CONNECTITON_STRING, retryPolicy);

        // 第 2 步，启动 Client
        client.start();

        // 第 3 步，操作
        String pathWithParent = "/node-parent/sub-node-1";
        String path = client.create()
                .creatingParentsIfNeeded()
                .forPath(pathWithParent, "Hello ZooKeeper".getBytes());
        System.out.println("path = " + path);

        Thread.sleep(30000);

        // 第 4 步，关闭 Client
        client.close();
    }
}
```

## 读取节点数据

```java
import org.apache.curator.RetryPolicy;
import org.apache.curator.framework.CuratorFramework;
import org.apache.curator.framework.CuratorFrameworkFactory;
import org.apache.curator.retry.RetryNTimes;

public class ZKC3_003_ZNode_B_Read {
    public static void main(String[] args) throws Exception {
        // 第 1 步，创建 Client
        RetryPolicy retryPolicy = new RetryNTimes(3, 100);
        CuratorFramework client = CuratorFrameworkFactory.newClient(Const.ZK_CONNECTITON_STRING, retryPolicy);

        // 第 2 步，启动 Client
        client.start();

        // 第 3 步，操作
        String pathWithParent = "/node-parent/sub-node-1";
        byte[] bytes = client.getData().forPath(pathWithParent);
        String data = new String(bytes);
        System.out.println("data = " + data);

        Thread.sleep(30000);

        // 第 4 步，关闭 Client
        client.close();
    }
}
```

## 更新节点

```java
import org.apache.curator.RetryPolicy;
import org.apache.curator.framework.CuratorFramework;
import org.apache.curator.framework.CuratorFrameworkFactory;
import org.apache.curator.retry.RetryNTimes;

public class ZKC3_003_ZNode_C_Update {
    public static void main(String[] args) throws Exception {
        // 第 1 步，创建 Client
        RetryPolicy retryPolicy = new RetryNTimes(3, 100);
        CuratorFramework client = CuratorFrameworkFactory.newClient(Const.ZK_CONNECTITON_STRING, retryPolicy);

        // 第 2 步，启动 Client
        client.start();

        // 第 3 步，操作
        String pathWithParent = "/node-parent/sub-node-1";
        client.setData().forPath(pathWithParent, "changed!".getBytes());
        byte[] bytes = client.getData().forPath(pathWithParent);
        String data = new String(bytes);
        System.out.println("data = " + data);

        // 第 4 步，关闭 Client
        client.close();
    }
}
```

### 删除节点

```java
import org.apache.curator.RetryPolicy;
import org.apache.curator.framework.CuratorFramework;
import org.apache.curator.framework.CuratorFrameworkFactory;
import org.apache.curator.retry.RetryNTimes;

public class ZKC3_003_ZNode_D_Delete {
    public static void main(String[] args) throws Exception {
        // 第 1 步，创建 Client
        RetryPolicy retryPolicy = new RetryNTimes(3, 100);
        CuratorFramework client = CuratorFrameworkFactory.newClient(Const.ZK_CONNECTITON_STRING, retryPolicy);

        // 第 2 步，启动 Client
        client.start();

        // 第 3 步，操作
        String pathWithParent = "/node-parent";
        client.delete()
                .guaranteed()
                .deletingChildrenIfNeeded()
                .forPath(pathWithParent);

        // 第 4 步，关闭 Client
        client.close();
    }
}
```

guaranteed：该函数的功能如字面意思一样，主要起到一个保障删除成功的作用。
其底层工作方式是：只要该客户端的会话有效，就会在后台持续发起删除请求，直到该数据节点在 ZooKeeper 服务端被删除。

deletingChildrenIfNeeded：指定了该函数后，系统在删除该数据节点的时候会以递归的方式直接删除其子节点，以及子节点的子节点。

## 获取孩子节点

```java
import org.apache.curator.RetryPolicy;
import org.apache.curator.framework.CuratorFramework;
import org.apache.curator.framework.CuratorFrameworkFactory;
import org.apache.curator.retry.RetryNTimes;

import java.util.List;

public class ZKC3_003_ZNode_E_Children {
    public static void main(String[] args) throws Exception {
        // 第 1 步，创建 Client
        RetryPolicy retryPolicy = new RetryNTimes(3, 100);
        CuratorFramework client = CuratorFrameworkFactory.newClient(Const.ZK_CONNECTITON_STRING, retryPolicy);

        // 第 2 步，启动 Client
        client.start();

        // 第 3 步，操作
        client.create()
                .creatingParentsIfNeeded()
                .forPath("/test-parent/test-child-1");
        client.create()
                .creatingParentsIfNeeded()
                .forPath("/test-parent/test-child-2");
        List<String> children = client.getChildren().forPath("/test-parent");
        for (String child : children) {
            System.out.println("Child: " + child);
        }

        // 第 4 步，关闭 Client
        client.close();
    }
}
```
