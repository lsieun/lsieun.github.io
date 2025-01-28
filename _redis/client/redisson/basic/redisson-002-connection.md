---
title: "Redisson 配置"
sequence: "102"
---

Redisson supports connections to the following Redis configurations:

- Single node
- Master with slave nodes
- Sentinel nodes
- Clustered nodes
- Replicated nodes

## Configuration

Let's connect to a single node instance of Redis. This instance is running locally on the default port, 6379:

```text
RedissonClient client = Redisson.create();
```

You can pass different configurations to the `Redisson` object's `create` method.
This could be configurations to have it connect to a different port, or maybe, to connect to a Redis cluster.
This configuration could be in Java code or loaded from an external configuration file.

## Java Configuration

Let's configure Redisson in Java code:

```text
Config config = new Config();
config.useSingleServer()
  .setAddress("redis://127.0.0.1:6379");

RedissonClient client = Redisson.create(config);
```

We specify Redisson configurations in an instance of a `Config` object and then pass it to the `create` method.
Above, we specified to Redisson that we want to connect to a single node instance of Redis.
To do this we used the `Config` object's `useSingleServer` method.
This returns a reference to a `SingleServerConfig` object.

The `SingleServerConfig` object has settings that Redisson uses to connect to a single node instance of Redis.
Here, we use its `setAddress` method to configure the address setting.
This sets the address of the node we're connecting to.
Some other settings include `retryAttempts`, `connectionTimeout` and `clientName`.
These settings are configured using their corresponding setter methods.

We can configure Redisson for different Redis configurations in a similar way
using the `Config` object's following methods:

- `useSingleServer` – for single node instance. Get single node settings here
- `useMasterSlaveServers` – for master with slave nodes. Get master-slave node settings [here](https://github.com/redisson/redisson/wiki/2.-Configuration#28-master-slave-mode)
- `useSentinelServers` – for sentinel nodes. Get sentinel node settings [here](https://github.com/redisson/redisson/wiki/2.-Configuration#27-sentinel-mode)
- `useClusterServers` – for clustered nodes. Get clustered node settings [here](https://github.com/redisson/redisson/wiki/2.-Configuration#24-cluster-mode)
- `useReplicatedServers` – for replicated nodes. Get replicated node settings here

### Single

```java
import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;

public class RedissonBasic_001_Connection_A_Single {
    public static void main(String[] args) {
        Config config = new Config();
        config.useSingleServer().setAddress("redis://192.168.80.130:6379");

        // 第 1 步，创建 Redisson
        RedissonClient redisson = Redisson.create(config);

        // 第 2 步，操作
        String id = redisson.getId();
        System.out.println("id = " + id);

        // 第 3 步，关闭 Redisson
        redisson.shutdown();
    }
}
```

### Master + Slave

```java
import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;

public class RedissonBasic_001_Connection_B_MasterSlave {
    public static void main(String[] args) {
        Config config = new Config();
        config.useMasterSlaveServers()
                // use "rediss://" for SSL connection
                .setMasterAddress("redis://192.168.80.131:6379")
                .addSlaveAddress(
                        "redis://192.168.80.231:6379",
                        "redis://192.168.80.232:6379",
                        "redis://192.168.80.233:6379"
                );

        // 第 1 步，创建 Redisson
        RedissonClient redisson = Redisson.create(config);

        // 第 2 步，操作
        String id = redisson.getId();
        System.out.println("id = " + id);

        // 第 3 步，关闭 Redisson
        redisson.shutdown();
    }
}
```

### Sentinel

```java
import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;

public class RedissonBasic_001_Connection_C_Sentinel {
    public static void main(String[] args) {
        Config config = new Config();
        config.useSentinelServers()
                .setMasterName("mymaster")
                // use "rediss://" for SSL connection
                .addSentinelAddress("redis://192.168.80.231:26379", "redis://192.168.80.232:26379")
                .addSentinelAddress("redis://192.168.80.233:26379")
                .setPassword("str0ng_passw0rd");

        // 第 1 步，创建 Redisson
        RedissonClient redisson = Redisson.create(config);

        // 第 2 步，操作
        String id = redisson.getId();
        System.out.println("id = " + id);

        // 第 3 步，关闭 Redisson
        redisson.shutdown();
    }
}
```

### Cluster

- [Link](https://github.com/redisson/redisson/wiki/2.-Configuration)

```java
import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;

public class RedissonBasic_001_Connection_D_Cluster {
    public static void main(String[] args) {
        Config config = new Config();
        config.useClusterServers()
                .setScanInterval(2000) // cluster state scan interval in milliseconds
                // use "rediss://" for SSL connection
                .addNodeAddress(
                        "redis://192.168.80.131:6379",
                        "redis://192.168.80.132:6379",
                        "redis://192.168.80.132:6379"
                )
                .addNodeAddress(
                        "redis://192.168.80.231:6379",
                        "redis://192.168.80.232:6379",
                        "redis://192.168.80.232:6379"
                )
                .setPassword("str0ng_passw0rd");

        RedissonClient redisson = Redisson.create(config);

        String id = redisson.getId();
        System.out.println("id = " + id);

        redisson.shutdown();
    }
}
```

## File Configuration

Redisson can load configurations from external JSON or YAML files:

```text
Config config = Config.fromJSON(new File("singleNodeConfig.json"));  
RedissonClient client = Redisson.create(config);
```

The `Config` object's `fromJSON` method can load configurations from a string, file, input stream or URL.

Here is the sample configuration in the `singleNodeConfig.json` file:

```json
{
    "singleServerConfig": {
        "idleConnectionTimeout": 10000,
        "connectTimeout": 10000,
        "timeout": 3000,
        "retryAttempts": 3,
        "retryInterval": 1500,
        "password": null,
        "subscriptionsPerConnection": 5,
        "clientName": null,
        "address": "redis://127.0.0.1:6379",
        "subscriptionConnectionMinimumIdleSize": 1,
        "subscriptionConnectionPoolSize": 50,
        "connectionMinimumIdleSize": 10,
        "connectionPoolSize": 64,
        "database": 0,
        "dnsMonitoringInterval": 5000
    },
    "threads": 0,
    "nettyThreads": 0,
    "codec": null
}
```

Here is a corresponding YAML configuration file:

```yaml
singleServerConfig:
  idleConnectionTimeout: 10000
  connectTimeout: 10000
  timeout: 3000
  retryAttempts: 3
  retryInterval: 1500
  password: null
  subscriptionsPerConnection: 5
  clientName: null
  address: "redis://127.0.0.1:6379"
  subscriptionConnectionMinimumIdleSize: 1
  subscriptionConnectionPoolSize: 50
  connectionMinimumIdleSize: 10
  connectionPoolSize: 64
  database: 0
  dnsMonitoringInterval: 5000
threads: 0
nettyThreads: 0
codec: !<org.redisson.codec.JsonJacksonCodec> { }
```

We can configure other Redis configurations from a file in a similar manner
using settings peculiar to that configuration.
For your reference, here are their JSON and YAML file formats:

- Single-node – format
- Master with slave nodes – format
- Sentinel nodes – format
- Clustered nodes – format
- Replicated nodes – format

To save a Java configuration to JSON or YAML format, we can use the `toJSON` or `toYAML` methods of the `Config` object:

```text
Config config = new Config();
// ... we configure multiple settings here in Java
String jsonFormat = config.toJSON();
String yamlFormat = config.toYAML();
```
