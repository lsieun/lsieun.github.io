---
title: "Kafka Broker"
sequence: "101"
---

```java
import org.apache.kafka.clients.admin.Admin;
import org.apache.kafka.clients.admin.AdminClientConfig;
import org.apache.kafka.common.Node;

import java.util.Collection;
import java.util.Properties;

public class KafkaBroker_001_Node {
    public static void main(String[] args) throws Exception {
        Properties props = new Properties();
        props.put(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, KafkaConst.BOOTSTRAP_SERVER_URL);

        // 第 1 步，创建 Admin
        Admin admin = Admin.create(props);

        // 第 2 步，使用 Admin 操作
        Collection<Node> nodes = admin.describeCluster()
                .nodes()
                .get();

        // 第 3 步，解析 Result
        for (Node node : nodes) {
            LogUtils.log(
                    "id = {}, server = {}:{}",
                    node.id(), node.host(), node.port()
            );
        }

        // 第 4 步，关闭 Admin
        admin.close();
    }
}
```
