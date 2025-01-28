---
title: "读取 Nacos 配置：JDK"
sequence: "102"
---

## pom.xml

```xml
<dependencies>
    <dependency>
        <groupId>com.alibaba.nacos</groupId>
        <artifactId>nacos-client</artifactId>
        <version>2.1.2</version>
    </dependency>
    <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-api</artifactId>
        <version>2.0.3</version>
    </dependency>
    <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-simple</artifactId>
        <version>2.0.3</version>
    </dependency>
</dependencies>
```

## ConfigService

`com.alibaba.nacos.api.config.ConfigService`

```java
package com.alibaba.nacos.api.config;

public interface ConfigService {
    boolean publishConfig(String dataId, String group, String content) throws NacosException;
    boolean publishConfig(String dataId, String group, String content, String type) throws NacosException;
    String getConfig(String dataId, String group, long timeoutMs) throws NacosException;
    boolean removeConfig(String dataId, String group) throws NacosException;

    String getConfigAndSignListener(String dataId, String group, long timeoutMs, Listener listener)
            throws NacosException;
    
    boolean publishConfigCas(String dataId, String group, String content, String casMd5) throws NacosException;
    boolean publishConfigCas(String dataId, String group, String content, String casMd5, String type)
            throws NacosException;

    
    void addListener(String dataId, String group, Listener listener) throws NacosException;
    void removeListener(String dataId, String group, Listener listener);

    String getServerStatus();
    void shutDown() throws NacosException;
}
```

## 拉取配置

```java
import com.alibaba.nacos.api.NacosFactory;
import com.alibaba.nacos.api.config.ConfigService;
import com.alibaba.nacos.api.exception.NacosException;

import java.util.Properties;

public class Main {
    public static void main(String[] args) throws NacosException {
        String serverAddr = "localhost:8848";
        String group = "DEFAULT_GROUP";
        String dataId = "mytest";

        Properties properties = new Properties();
        properties.put("serverAddr", serverAddr);
        ConfigService configService = NacosFactory.createConfigService(properties);
        String content = configService.getConfig(dataId, group, 5000);
        System.out.println(content);
    }
}
```

输出：

```text
lsieun.database.username=liusen
lsieun.database.password=123456
```

## 监听配置

```java
import com.alibaba.nacos.api.NacosFactory;
import com.alibaba.nacos.api.config.ConfigService;
import com.alibaba.nacos.api.config.listener.Listener;
import com.alibaba.nacos.api.exception.NacosException;

import java.io.IOException;
import java.util.Properties;
import java.util.concurrent.Executor;

public class Main {
    public static void main(String[] args) throws NacosException, IOException {
        String serverAddr = "localhost:8848";
        String group = "DEFAULT_GROUP";
        String dataId = "mytest";

        Properties properties = new Properties();
        properties.put("serverAddr", serverAddr);
        ConfigService configService = NacosFactory.createConfigService(properties);
        String content = configService.getConfig(dataId, group, 5000);
        System.out.println(content);

        configService.addListener(dataId, group, new Listener() {
            @Override
            public Executor getExecutor() {
                return null;
            }

            @Override
            public void receiveConfigInfo(String configInfo) {
                System.out.println("receiveConfigInfo:");
                System.out.println(configInfo);
            }
        });

        System.in.read();
    }
}
```

输出：

```text
lsieun.database.username=liusen
lsieun.database.password=123456

receiveConfigInfo:
lsieun.database.username=liusen
lsieun.database.password=12345678
```

## Reference

- [Nacos: Java SDK](https://nacos.io/en-us/docs/sdk.html)
