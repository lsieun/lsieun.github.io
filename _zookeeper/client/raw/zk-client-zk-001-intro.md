---
title: "Apache ZooKeeper"
sequence: "101"
---

## pom.xml

使用zookeeper官方api的时候，请保证jar包的版本，和zk集群中zk的版本相同

```xml
<dependency>
    <groupId>org.apache.zookeeper</groupId>
    <artifactId>zookeeper</artifactId>
    <version>3.8.3</version>
</dependency>
```

## 代码

### 连接zk集群

```java
import org.apache.zookeeper.WatchedEvent;
import org.apache.zookeeper.Watcher;
import org.apache.zookeeper.ZooKeeper;

public class ZK_01_Connection {
    public static void main(String[] args) throws Exception {
        ZooKeeper zooKeeper = new ZooKeeper(
                "192.168.80.131:2181,192.168.80.132:2181,192.168.80.133:2181",
                20000,
                new Watcher() {
                    @Override
                    public void process(WatchedEvent watchedEvent) {
                        // 发生变更的节点路径
                        String path = watchedEvent.getPath();
                        System.out.println("path:" + path);

                        // 通知状态
                        Watcher.Event.KeeperState state = watchedEvent.getState();
                        System.out.println("KeeperState:" + state);

                        // 事件类型
                        Watcher.Event.EventType type = watchedEvent.getType();
                        System.out.println("EventType:" + type);
                    }
                }
        );

        long sessionId = zooKeeper.getSessionId();
        System.out.println("sessionId = " + sessionId);

        // 关闭连接
        zooKeeper.close();
    }
}
```

## Reference

- [Getting Started with Java and Zookeeper](https://www.baeldung.com/java-zookeeper)
- [ZooKeeper Getting Started Guide](https://zookeeper.apache.org/doc/current/zookeeperStarted.html)
- [ZooKeeper Recipes and Solutions](https://zookeeper.apache.org/doc/current/recipes.html)
