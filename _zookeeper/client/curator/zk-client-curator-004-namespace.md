---
title: "名称空间（Namespace）"
sequence: "104"
---

curator中名称空间的含义，就是设置一个公共的父级path，之后的操作全部都是基于该path。

```java
import org.apache.curator.RetryPolicy;
import org.apache.curator.framework.CuratorFramework;
import org.apache.curator.framework.CuratorFrameworkFactory;
import org.apache.curator.retry.RetryNTimes;

public class ZKC3_004_ZNode_Namespace {
    public static void main(String[] args) throws Exception {
        // 第 1 步，创建 Client
        RetryPolicy retryPolicy = new RetryNTimes(3, 100);
        CuratorFramework client = CuratorFrameworkFactory.newClient(Const.ZK_CONNECTITON_STRING, retryPolicy);

        // 第 2 步，启动 Client
        client.start();

        // 第 3 步，操作
        CuratorFramework client2 = client.usingNamespace("lsieun");
        client2.create().forPath("/node1");
        client2.create().forPath("/node2");

        // 第 4 步，关闭 Client
        client.close();
    }
}
```

```text
> ls /
[lsieun, zookeeper]

> ls /lsieun 
[node1, node2]
```
