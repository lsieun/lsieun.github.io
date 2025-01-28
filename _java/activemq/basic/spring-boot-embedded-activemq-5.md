---
title: "Spring Boot + Embedded Apache ActiveMQ 5 (Classic)"
sequence: "105"
---

- Spring for Apache ActiveMQ 5 MESSAGING
    - Requires Spring Boot `>= 2.0.0.RELEASE` and `< 3.0.0-M1`.

## Embedded ActiveMQ Broker

### pom.xml

```xml

<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-activemq</artifactId>
    </dependency>
</dependencies>
```

### application.properties

```properties
activemq.broker.url=tcp://0.0.0.0:61616
```

### Config

```java
import org.apache.activemq.broker.BrokerService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JmsConfig {

    @Value("${activemq.broker.url}")
    String brokerUrl;

    @Bean
    public BrokerService broker() throws Exception {

        BrokerService broker = new BrokerService();
        broker.setPersistent(false);
        broker.setUseJmx(true);
        broker.addConnector(brokerUrl);
        return broker;
    }
}
```

### Application

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.concurrent.TimeUnit;

@SpringBootApplication
public class EmbeddedActiveMQ5ServerApplication {
    public static void main(String[] args) throws InterruptedException {
        SpringApplication.run(EmbeddedActiveMQ5ServerApplication.class);
        TimeUnit.SECONDS.sleep(600);
    }
}
```

## Consumer

### pom.xml

```xml

<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-activemq</artifactId>
    </dependency>

    <dependency>
        <groupId>org.apache.activemq</groupId>
        <artifactId>activemq-pool</artifactId>
    </dependency>
</dependencies>
```

### application.properties

```text
activemq.broker.url=tcp://0.0.0.0:61616
activemq.queue.name=my-queue-1
```

### Config

```java
import org.apache.activemq.pool.PooledConnectionFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jms.config.DefaultJmsListenerContainerFactory;

@Configuration
public class JmsConfig {
    @Value("${activemq.broker.url}")
    String brokerUrl;

    @Bean
    public DefaultJmsListenerContainerFactory jmsListenerContainerFactory() {

        DefaultJmsListenerContainerFactory factory = new DefaultJmsListenerContainerFactory();
        factory.setConnectionFactory(new PooledConnectionFactory(brokerUrl));
        return factory;
    }
}
```

### Service

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Service;

@Service
public class JmsConsumer {
    Logger log = LoggerFactory.getLogger(JmsConsumer.class);

    @JmsListener(destination = "${activemq.queue.name}")
    public void receive(String message) {
        log.info("Received message='{}'", message);
    }
}
```

### Application

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ConsumerApplication {
    public static void main(String[] args) {
        SpringApplication.run(ConsumerApplication.class);
    }
}
```

## Provider

### pom.xml

```xml

<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-activemq</artifactId>
    </dependency>

    <dependency>
        <groupId>org.apache.activemq</groupId>
        <artifactId>activemq-pool</artifactId>
    </dependency>

    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
    </dependency>
</dependencies>
```

### application.yml

```text
activemq.broker.url=tcp://0.0.0.0:61616
activemq.queue.name=my-queue-1
```

### Config

```java
import org.apache.activemq.pool.PooledConnectionFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jms.core.JmsTemplate;

@Configuration
public class JmsConfig {
    @Value("${activemq.broker.url}")
    String brokerUrl;

    @Bean
    public JmsTemplate jmsTemplate() {
        return new JmsTemplate(new PooledConnectionFactory(brokerUrl));
    }
}
```

### Service

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Service;

@Service
public class JmsProducer {
    Logger log = LoggerFactory.getLogger(JmsProducer.class);

    @Autowired
    private JmsTemplate jmsTemplate;

    @Value("${activemq.queue.name}")
    String destination;

    public void send(String message) {
        jmsTemplate.convertAndSend(destination, message);
        log.info("Sent message='{}'", message);
    }
}
```

### Controller

```java
import lombok.RequiredArgsConstructor;
import lsieun.activemq.producer.service.JmsProducer;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/msg")
@RequiredArgsConstructor
public class MsgController {

    private final JmsProducer jmsProducer;

    @GetMapping("/send")
    public void sendDataToJms(@RequestParam String message) {
        jmsProducer.send(message);
    }
}
```

### Application

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ProducerApplication {
    public static void main(String[] args) {
        SpringApplication.run(ProducerApplication.class);
    }
}
```

## Reference

- [Integrate embedded Apache ActiveMQ 5 (Classic) JMS Broker with Spring Boot application](https://codeaches.com/spring-boot/embedded-activemq-5-jms-broker)
