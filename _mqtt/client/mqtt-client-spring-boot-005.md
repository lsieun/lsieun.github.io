---
title: "Spring Boot + MQTT：实现四"
sequence: "305"
---

## pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>lsieun</groupId>
    <artifactId>learn-java-mqtt-spring-boot</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <!-- resource -->
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>

        <!-- JDK -->
        <java.version>17</java.version>
        <maven.compiler.source>${java.version}</maven.compiler.source>
        <maven.compiler.target>${java.version}</maven.compiler.target>

        <!-- Spring Boot -->
        <spring-boot.version>2.7.8</spring-boot.version>
    </properties>

    <dependencyManagement>
        <dependencies>
            <!-- Spring Boot -->
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-dependencies</artifactId>
                <version>${spring-boot.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <dependencies>
        <!-- starter -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter</artifactId>
        </dependency>

        <!-- web -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- configuration -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-configuration-processor</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- test -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>

        <!-- mqtt -->
        <dependency>
            <groupId>org.springframework.integration</groupId>
            <artifactId>spring-integration-mqtt</artifactId>
        </dependency>

        <dependency>
            <groupId>org.apache.commons</groupId>
            <artifactId>commons-lang3</artifactId>
        </dependency>

        <!-- lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.18.24</version>
        </dependency>
    </dependencies>

</project>
```

## application.yml

```yaml
server:
  port: 1317
spring:
  application:
    name: spring-boot-mqtt

# MQTT配置信息
lsieun:
  mqtt:
    serverUris:
      - tcp://localhost:1883
      - tcp://192.168.80.130:1883
    username: admin
    password: 123456
    timeout: 10
    keepalive: 20
    clientId: client-from-spring-boot-${random.uuid}
    topics:
      - /iot/#
      - /home/#
```

## Java

### Application

```java
package lsieun.mqtt;

import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;

@SpringBootApplication
public class MqttJavaApplication {
    public static void main(String[] args) {
        new SpringApplicationBuilder(MqttJavaApplication.class)
                .web(WebApplicationType.SERVLET)
                .run(args);
    }
}
```

### MqttProperties

```java
package lsieun.mqtt.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "lsieun.mqtt")
public class MqttProperties {
    private String[] serverUris;
    private String username;
    private String password;
    private String timeout;
    private String keepalive;
    private String clientId;
    private String[] topics;
}
```

### MqttInboundConfigration

```java
package lsieun.mqtt.config;

import lombok.extern.slf4j.Slf4j;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.integration.annotation.IntegrationComponentScan;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.integration.channel.DirectChannel;
import org.springframework.integration.core.MessageProducer;
import org.springframework.integration.mqtt.core.DefaultMqttPahoClientFactory;
import org.springframework.integration.mqtt.core.MqttPahoClientFactory;
import org.springframework.integration.mqtt.inbound.MqttPahoMessageDrivenChannelAdapter;
import org.springframework.integration.mqtt.support.DefaultPahoMessageConverter;
import org.springframework.integration.mqtt.support.MqttHeaders;
import org.springframework.messaging.*;

import java.util.UUID;

@Slf4j
@Configuration
@IntegrationComponentScan
public class MqttInboundConfigration {

    private final MqttProperties mqttProperties;

    @Autowired
    public MqttInboundConfigration(MqttProperties mqttProperties) {
        this.mqttProperties = mqttProperties;
    }

    @Bean
    public MessageChannel mqttInputChannel() {
        return new DirectChannel();
    }

    @Bean
    public MqttPahoClientFactory mqttInClient() {
        // 第一步，获取配置信息
        String[] serverURIs = mqttProperties.getServerUris();
        String username = mqttProperties.getUsername();
        String password = mqttProperties.getPassword();

        // 第二步，构建 options
        MqttConnectOptions options = new MqttConnectOptions();
        options.setServerURIs(serverURIs);
        options.setUserName(username);
        options.setPassword(password.toCharArray());
        options.setKeepAliveInterval(2);
        // 接收离线消息
        options.setCleanSession(false);

        // 第三步，配置 factory
        DefaultMqttPahoClientFactory factory = new DefaultMqttPahoClientFactory();
        factory.setConnectionOptions(options);
        return factory;
    }

    @Bean
    public MessageProducer inbound() {
        String clientId = mqttProperties.getClientId();
        String[] topics = mqttProperties.getTopics();
        MqttPahoMessageDrivenChannelAdapter adapter = new MqttPahoMessageDrivenChannelAdapter(
                clientId, mqttInClient(), topics
        );

        adapter.setCompletionTimeout(1000 * 5);
        adapter.setQos(0);
        adapter.setConverter(new DefaultPahoMessageConverter());
        adapter.setOutputChannel(mqttInputChannel());
        return adapter;
    }

    @Bean
    @ServiceActivator(inputChannel = "mqttInputChannel")
    public MessageHandler handler() {
        return new MessageHandler() {
            @Override
            public void handleMessage(Message<?> message) throws MessagingException {
                MessageHeaders headers = message.getHeaders();
                Object payload = message.getPayload();

                UUID packetId = headers.getId();
                Object qos = headers.get(MqttHeaders.QOS);
                Object receivedTopic = headers.get(MqttHeaders.RECEIVED_TOPIC);
                String handleMessage = String.format(
                        "MQTT Client: id = %s, receivedTopic = %s, qos = %s, payload = %s",
                        packetId,
                        receivedTopic,
                        qos,
                        payload
                );
                log.info(handleMessage);
                System.out.println(handleMessage);
            }
        };
    }

}
```

### MqttOutboundConfigration

```java
package lsieun.mqtt.config;

import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.integration.channel.DirectChannel;
import org.springframework.integration.mqtt.core.DefaultMqttPahoClientFactory;
import org.springframework.integration.mqtt.core.MqttPahoClientFactory;
import org.springframework.integration.mqtt.outbound.MqttPahoMessageHandler;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageHandler;

@Configuration
public class MqttOutboundConfigration {
    private final MqttProperties mqttProperties;

    @Autowired
    public MqttOutboundConfigration(MqttProperties mqttProperties) {
        this.mqttProperties = mqttProperties;
    }

    @Bean
    public MessageChannel mqttOutboundChannelIOT() {
        return new DirectChannel();
    }

    @Bean
    public MessageChannel mqttOutboundChannelHome() {
        return new DirectChannel();
    }

    @Bean
    public MqttPahoClientFactory mqttOutClient() {
        // TODO: 这里需要修改
        String[] serverUris = mqttProperties.getServerUris();
        String username = mqttProperties.getUsername();
        String password = mqttProperties.getPassword();

        MqttConnectOptions options = new MqttConnectOptions();
        options.setServerURIs(serverUris);
        options.setUserName(username);
        options.setPassword(password.toCharArray());
        options.setCleanSession(false);

        DefaultMqttPahoClientFactory factory = new DefaultMqttPahoClientFactory();
        factory.setConnectionOptions(options);
        return factory;
    }

    @Bean
    @ServiceActivator(inputChannel = "mqttOutboundChannelIOT")
    public MessageHandler mqttOutboundIOT() {
        String clientId = mqttProperties.getClientId() + "_outbound_iot";

        MqttPahoMessageHandler handler = new MqttPahoMessageHandler(
                clientId,
                mqttOutClient()
        );
        handler.setDefaultTopic("/iot");
        handler.setAsync(true);
        return handler;
    }

    @Bean
    @ServiceActivator(inputChannel = "mqttOutboundChannelHome")
    public MessageHandler mqttOutboundHome() {
        String clientId = mqttProperties.getClientId() + "_outbound_home";

        MqttPahoMessageHandler handler = new MqttPahoMessageHandler(
                clientId,
                mqttOutClient()
        );
        handler.setTopicExpressionString("header['home/#']");
        handler.setAsync(true);
        return handler;
    }
}
```

### MqttGatewayService

```java
package lsieun.mqtt.service;

import org.springframework.integration.annotation.MessagingGateway;
import org.springframework.integration.mqtt.support.MqttHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

@Service
@MessagingGateway(defaultRequestChannel = "mqttOutboundChannelIOT")
public interface MqttGatewayService {
    void sendMessageToMqtt(@Payload String data);

    /**
     * The topic name MUST NOT contain any wildcard character (#+).
     *
     * @param topic 主题
     * @param data  数据
     */
    void sendMessageToMqtt(
            @Header(MqttHeaders.TOPIC) String topic,
            @Payload String data
    );

    void sendMessageToMqtt(
            @Header(MqttHeaders.TOPIC) String topic,
            @Payload String data,
            @Header(MqttHeaders.QOS) int qos
    );
}
```

### MqttController

```java
package lsieun.mqtt.controller;

import lsieun.mqtt.service.MqttGatewayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/mqtt")
public class MqttController {
    private final MqttGatewayService mqttGatewayService;

    @Autowired
    public MqttController(MqttGatewayService mqttGatewayService) {
        this.mqttGatewayService = mqttGatewayService;
    }

    @GetMapping(value = "/send1")
    public String send1(@RequestParam(value = "data") String data) {
        try {
            mqttGatewayService.sendMessageToMqtt(data);
            return "OK";
        } catch (Exception ignored) {
            return "Fail";
        }
    }

    @GetMapping(value = "/send2")
    public String send2(@RequestParam(value = "topic") String topic,
                        @RequestParam(value = "data") String data) {
        try {
            mqttGatewayService.sendMessageToMqtt(topic, data);
            return "OK";
        } catch (Exception ignored) {
            return "Fail";
        }
    }

    @GetMapping(value = "/send3")
    public String send3(@RequestParam(value = "topic") String topic,
                        @RequestParam(value = "data") String data,
                        @RequestParam(value = "qos") int qos) {
        try {
            mqttGatewayService.sendMessageToMqtt(topic, data, qos);
            return "OK";
        } catch (Exception ignored) {
            return "Fail";
        }
    }
}

```
