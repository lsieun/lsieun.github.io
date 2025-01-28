---
title: "Kafka Topic"
sequence: "102"
---

## Topic 列表

### 名称

```java
import org.apache.kafka.clients.admin.Admin;
import org.apache.kafka.clients.admin.AdminClientConfig;
import org.apache.kafka.clients.admin.ListTopicsResult;
import org.apache.kafka.common.KafkaFuture;

import java.util.Properties;
import java.util.Set;

public class KafkaTopic_001_List {
    public static void main(String[] args) throws Exception {
        Properties props = new Properties();
        props.put(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, KafkaConst.BOOTSTRAP_SERVER_URL);

        // 第 1 步，创建 Admin
        Admin admin = Admin.create(props);

        // 第 2 步，使用 Admin 操作
        ListTopicsResult result = admin.listTopics();

        // 第 3 步，解析 Result
        KafkaFuture<Set<String>> future = result.names();
        Set<String> topicNames = future.get();
        for (String name : topicNames) {
            LogUtils.log(name);
        }

        // 第 4 步，关闭 Admin
        admin.close();
    }
}
```

### ID + 名称

```java
import org.apache.kafka.clients.admin.Admin;
import org.apache.kafka.clients.admin.AdminClientConfig;
import org.apache.kafka.clients.admin.ListTopicsResult;
import org.apache.kafka.clients.admin.TopicListing;
import org.apache.kafka.common.KafkaFuture;

import java.util.Collection;
import java.util.Properties;

public class KafkaTopic_001_List {
    public static void main(String[] args) throws Exception {
        Properties props = new Properties();
        props.put(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, KafkaConst.BOOTSTRAP_SERVER_URL);

        // 第 1 步，创建 Admin
        Admin admin = Admin.create(props);

        // 第 2 步，使用 Admin 操作
        ListTopicsResult result = admin.listTopics();

        // 第 3 步，解析 Result
        KafkaFuture<Collection<TopicListing>> future = result.listings();
        Collection<TopicListing> coll = future.get();
        for (TopicListing item : coll) {
            LogUtils.log(
                    "topicId = {}, internal = {}, name = {}",
                    item.topicId(), item.isInternal(), item.name()
            );
        }

        // 第 4 步，关闭 Admin
        admin.close();
    }
}
```

## Topic 创建

### 简单

```java
import org.apache.kafka.clients.admin.Admin;
import org.apache.kafka.clients.admin.AdminClientConfig;
import org.apache.kafka.clients.admin.CreateTopicsResult;
import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.common.KafkaFuture;

import java.util.Collections;
import java.util.Properties;

public class KafkaTopic_002_Create {
    public static void main(String[] args) throws Exception {
        Properties props = new Properties();
        props.put(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, KafkaConst.BOOTSTRAP_SERVER_URL);

        // 第 1 步，创建 Admin
        Admin admin = Admin.create(props);

        // 第 2 步，创建 Topic
        String topicName = KafkaConst.TOPIC_NAME;
        int partitions = 1;
        short replicationFactor = 1;
        NewTopic newTopic = new NewTopic(topicName, partitions, replicationFactor);

        // 第 3 步，使用 Admin 操作
        CreateTopicsResult result = admin.createTopics(
                Collections.singleton(newTopic)
        );

        // 第 4 步，解析 Result
        KafkaFuture<Void> future = result.values().get(topicName);
        future.get();

        // 第 5 步，关闭 Admin
        admin.close();
    }
}
```

### Options

```java
import org.apache.kafka.clients.admin.*;
import org.apache.kafka.common.KafkaFuture;

import java.util.Collections;
import java.util.Properties;

public class KafkaTopic_002_Create {
    public static void main(String[] args) throws Exception {
        Properties props = new Properties();
        props.put(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, KafkaConst.BOOTSTRAP_SERVER_URL);

        // 第 1 步，创建 Admin
        Admin admin = Admin.create(props);

        // 第 2 步，创建 Topic
        String topicName = KafkaConst.TOPIC_NAME;
        int partitions = 1;
        short replicationFactor = 1;
        NewTopic newTopic = new NewTopic(topicName, partitions, replicationFactor);

        CreateTopicsOptions topicOptions = new CreateTopicsOptions()
                .validateOnly(true)
                .retryOnQuotaViolation(false);

        // 第 3 步，使用 Admin 操作
        CreateTopicsResult result = admin.createTopics(
                Collections.singleton(newTopic), topicOptions
        );

        // 第 4 步，解析 Result
        KafkaFuture<Void> future = result.values().get(topicName);
        future.get();

        // 第 5 步，关闭 Admin
        admin.close();
    }
}
```

### Configuration

```java
import org.apache.kafka.clients.admin.*;
import org.apache.kafka.common.KafkaFuture;
import org.apache.kafka.common.config.TopicConfig;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

public class KafkaTopic_002_Create {
    public static void main(String[] args) throws Exception {
        Properties props = new Properties();
        props.put(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, KafkaConst.BOOTSTRAP_SERVER_URL);

        // 第 1 步，创建 Admin
        Admin admin = Admin.create(props);

        // 第 2 步，创建 Topic
        String topicName = KafkaConst.TOPIC_NAME;
        int partitions = 3;
        short replicationFactor = 3;

        Map<String, String> newTopicConfig = new HashMap<>();
        newTopicConfig.put(TopicConfig.CLEANUP_POLICY_CONFIG, TopicConfig.CLEANUP_POLICY_COMPACT);
        newTopicConfig.put(TopicConfig.COMPRESSION_TYPE_CONFIG, "lz4");

        NewTopic newTopic = new NewTopic(topicName, partitions, replicationFactor)
                .configs(newTopicConfig);

        CreateTopicsOptions topicOptions = new CreateTopicsOptions()
                .retryOnQuotaViolation(false);

        // 第 3 步，使用 Admin 操作
        CreateTopicsResult result = admin.createTopics(
                Collections.singleton(newTopic), topicOptions
        );

        // 第 4 步，解析 Result
        KafkaFuture<Void> future = result.values().get(topicName);
        future.get();

        // 第 5 步，关闭 Admin
        admin.close();
    }
}
```

## 描述

```java
import org.apache.kafka.clients.admin.*;
import org.apache.kafka.common.KafkaFuture;
import org.apache.kafka.common.TopicCollection;
import org.apache.kafka.common.TopicPartitionInfo;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Properties;

public class KafkaTopic_003_Describe {
    public static void main(String[] args) throws Exception {
        Properties props = new Properties();
        props.put(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, KafkaConst.BOOTSTRAP_SERVER_URL);

        // 第 1 步，创建 Admin
        Admin admin = Admin.create(props);

        // 第 2 步，使用 Admin 操作
        TopicCollection topicCollection = TopicCollection.ofTopicNames(
                Collections.singletonList(KafkaConst.TOPIC_NAME)
        );
        DescribeTopicsResult result = admin.describeTopics(topicCollection);

        // 第 3 步，解析 Result
        Map<String, KafkaFuture<TopicDescription>> map = result.topicNameValues();
        KafkaFuture<TopicDescription> future = map.get(KafkaConst.TOPIC_NAME);
        TopicDescription topicDescription = future.get();

        LogUtils.log("topicId = {}, name = {}", topicDescription.topicId(), topicDescription.name());
        List<TopicPartitionInfo> partitionInfoList = topicDescription.partitions();
        for (TopicPartitionInfo partitionInfo : partitionInfoList) {
            LogUtils.log(
                    "partition = {}, leader = {}, replicas = {}, isr = {}",
                    partitionInfo.partition(),
                    partitionInfo.leader(),
                    partitionInfo.replicas(),
                    partitionInfo.isr()
            );
        }

        // 第 4 步，关闭 Admin
        admin.close();
    }
}
```

## 删除

```java
import org.apache.kafka.clients.admin.Admin;
import org.apache.kafka.clients.admin.AdminClientConfig;
import org.apache.kafka.clients.admin.DeleteTopicsResult;
import org.apache.kafka.common.KafkaFuture;

import java.util.Collections;
import java.util.Properties;

public class KafkaTopic_004_Delete {
    public static void main(String[] args) throws Exception {
        Properties props = new Properties();
        props.put(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, KafkaConst.BOOTSTRAP_SERVER_URL);

        // 第 1 步，创建 Admin
        Admin admin = Admin.create(props);

        // 第 2 步，使用 Admin 操作
        DeleteTopicsResult result = admin.deleteTopics(
                Collections.singletonList(KafkaConst.TOPIC_NAME)
        );

        // 第 3 步，解析 Result
        KafkaFuture<Void> future = result.all();
        future.get();

        // 第 4 步，关闭 Admin
        admin.close();
    }
}
```

## Reference

- [Kafka Topic Creation Using Java](https://www.baeldung.com/kafka-topic-creation)
