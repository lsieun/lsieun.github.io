---
title: "连接管理"
sequence: "102"
---

## 连接管理

```java
public class Const {
    public static final String ZK_CONNECTITON_STRING = "192.168.80.131:2181,192.168.80.132:2181,192.168.80.133:2181";
}
```

### 工厂方法

```java
import org.apache.curator.RetryPolicy;
import org.apache.curator.framework.CuratorFramework;
import org.apache.curator.framework.CuratorFrameworkFactory;
import org.apache.curator.retry.RetryNTimes;
import org.apache.zookeeper.data.Stat;

public class ZKC3_001_ConnectionManagement {
    public static void main(String[] args) throws Exception {
        int maxRetries = 3;
        int sleepMsBetweenRetries = 100;
        RetryPolicy retryPolicy = new RetryNTimes(maxRetries, sleepMsBetweenRetries);

        // 第 1 步，创建 Client
        CuratorFramework client = CuratorFrameworkFactory.newClient(Const.ZK_CONNECTITON_STRING, retryPolicy);

        // 第 2 步，启动 Client
        client.start();

        // 第 3 步，操作
        Stat stat = client.checkExists().forPath("/");
        System.out.println(stat);

        // 第 4 步，关闭 Client
        client.close();
    }
}
```

### Fluent 风格

```java
import org.apache.curator.RetryPolicy;
import org.apache.curator.framework.CuratorFramework;
import org.apache.curator.framework.CuratorFrameworkFactory;
import org.apache.curator.retry.RetryNTimes;
import org.apache.zookeeper.data.Stat;

public class ZKC3_001_ConnectionManagement {
    public static void main(String[] args) throws Exception {
        int maxRetries = 3;
        int sleepMsBetweenRetries = 100;
        RetryPolicy retryPolicy = new RetryNTimes(maxRetries, sleepMsBetweenRetries);

        // 第 1 步，创建 Client
        CuratorFramework client = CuratorFrameworkFactory.builder()
                .connectString(Const.ZK_CONNECTITON_STRING)
                .retryPolicy(retryPolicy)
                .connectionTimeoutMs(5000)    // 连接超时时间
                .sessionTimeoutMs(5000)       // 会话超时时间
                .namespace("base")            // 包含隔离名称
                .build();

        // 第 2 步，启动 Client
        client.start();

        // 第 3 步，操作
        Stat stat = client.checkExists().forPath("/");
        System.out.println(stat);

        // 第 4 步，关闭 Client
        client.close();
    }
}
```

connectionString：服务器地址列表，在指定服务器地址列表的时候可以是一个地址，也可以是多个地址。
如果是多个地址，那么每个服务器地址列表用逗号分隔, 如 `host1:port1,host2:port2,host3:port3`。

retryPolicy：重试策略，当客户端异常退出或者与服务端失去连接的时候，可以通过设置客户端重新连接 ZooKeeper 服务端。
而 Curator 提供了 一次重试、多次重试等不同种类的实现方式。
在 Curator 内部，可以通过判断服务器返回的 keeperException 的状态代码来判断是否进行重试处理，如果返回的是 OK 表示一切操作都没有问题，
而 SYSTEMERROR 表示系统或服务端错误。

超时时间：Curator 客户端创建过程中，有两个超时时间的设置。
一个是 sessionTimeoutMs 会话超时时间，用来设置该条会话在 ZooKeeper 服务端的失效时间。
另一个是 connectionTimeoutMs 客户端创建会话的超时时间，用来限制客户端发起一个会话连接到接收 ZooKeeper 服务端应答的时间。
sessionTimeoutMs 作用在服务端，而 connectionTimeoutMs 作用在客户端。


## 重试策略

<table>
    <thead>
    <tr>
        <th>策略名称</th>
        <th>描述</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>ExponentialBackoffRetry</td>
        <td>重试一组次数，重试之间的睡眠时间增加</td>
    </tr>
    <tr>
        <td>RetryNTimes</td>
        <td>重试最大次数</td>
    </tr>
    <tr>
        <td>RetryOneTime</td>
        <td>只重试一次</td>
    </tr>
    <tr>
        <td>RetryUntilElapsed</td>
        <td>在给定的时间结束之前重试</td>
    </tr>
    </tbody>
</table>

```text
// 重试策略 
RetryPolicy retryPolicy = new ExponentialBackoffRetry(1000, 3);
CuratorFramework client = CuratorFrameworkFactory.newClient(zookeeperConnectionString, retryPolicy); 
```


