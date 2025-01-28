---
title: "Spring Integration"
sequence: "102"
---

- EAI: Enterprise Application Integration
- ESB: Enterprise Service Buses
- EIP: Enterprise Integration Pattern

## 核心类

```text
message: source ---> channel ---> handler
```

### Message

The `org.springframework.integration.Message` interface defines the spring Message:
the unit of data transfer within a Spring Integration context.

It defines accessors to two key elements:

- **Message headers**, essentially a key-value container that can be used to transmit metadata,
  as defined in the `org.springframework.integration.MessageHeaders` class
- **The message payload**, which is the actual data that is of value to be transferred

```java
package org.springframework.messaging;

/**
 * A generic message representation with headers and body.
 */
public interface Message<T> {

	/**
	 * Return the message payload.
	 */
	T getPayload();

	/**
	 * Return message headers for the message (never {@code null} but may be empty).
	 */
	MessageHeaders getHeaders();

}
```

### MessageSource

```java
package org.springframework.integration.core;

/**
 * Base interface for any source of {@link Message Messages} that can be polled.
 */
@FunctionalInterface
public interface MessageSource<T> extends IntegrationPattern {

	/**
	 * Retrieve the next available message from this source.
	 * Returns {@code null} if no message is available.
	 * @return The message or null.
	 */
	@Nullable
	Message<T> receive();

	@Override
	default IntegrationPatternType getIntegrationPatternType() {
		return IntegrationPatternType.inbound_channel_adapter;
	}

}
```

### MessageChannel

```java
package org.springframework.messaging;

/**
 * Defines methods for sending messages.
 */
@FunctionalInterface
public interface MessageChannel {

	/**
	 * Constant for sending a message without a prescribed timeout.
	 */
	long INDEFINITE_TIMEOUT = -1;


	/**
	 * Send a {@link Message} to this channel. If the message is sent successfully,
	 * the method returns {@code true}. If the message cannot be sent due to a
	 * non-fatal reason, the method returns {@code false}. The method may also
	 * throw a RuntimeException in case of non-recoverable errors.
	 * <p>This method may block indefinitely, depending on the implementation.
	 * To provide a maximum wait time, use {@link #send(Message, long)}.
	 * @param message the message to send
	 * @return whether the message was sent
	 */
	default boolean send(Message<?> message) {
		return send(message, INDEFINITE_TIMEOUT);
	}

	/**
	 * Send a message, blocking until either the message is accepted or the
	 * specified timeout period elapses.
	 * @param message the message to send
	 * @param timeout the timeout in milliseconds or {@link #INDEFINITE_TIMEOUT}
	 * @return {@code true} if the message is sent, {@code false} if not
	 * including a timeout of an interrupt of the send
	 */
	boolean send(Message<?> message, long timeout);

}
```

### MessageHandler

```java
package org.springframework.messaging;

/**
 * Simple contract for handling a {@link Message}.
 */
@FunctionalInterface
public interface MessageHandler {

	/**
	 * Handle the given message.
	 * @param message the message to be handled
	 * @throws MessagingException if the handler failed to process the message
	 */
	void handleMessage(Message<?> message) throws MessagingException;

}
```

## Example

### pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>lsieun</groupId>
    <artifactId>lsieun-tmp-spring-integration</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <!-- resource -->
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>

        <!-- JDK -->
        <java.version>11</java.version>
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
        <dependency>
            <groupId>org.springframework.integration</groupId>
            <artifactId>spring-integration-core</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.integration</groupId>
            <artifactId>spring-integration-file</artifactId>
        </dependency>
    </dependencies>

</project>
```

### BasicIntegrationConfig

```java
package lsieun.tmp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.integration.annotation.InboundChannelAdapter;
import org.springframework.integration.annotation.Poller;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.integration.channel.DirectChannel;
import org.springframework.integration.config.EnableIntegration;
import org.springframework.integration.core.MessageSource;
import org.springframework.integration.file.FileReadingMessageSource;
import org.springframework.integration.file.FileWritingMessageHandler;
import org.springframework.integration.file.filters.SimplePatternFileListFilter;
import org.springframework.integration.file.support.FileExistsMode;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageHandler;

import java.io.File;

@Configuration
@EnableIntegration
public class BasicIntegrationConfig {
    public String INPUT_DIR = "D:\\tmp\\test-from";
    public String OUTPUT_DIR = "D:\\tmp\\test-to";
    public String FILE_PATTERN = "*.png";

    @Bean
    public MessageChannel fileChannel() {
        return new DirectChannel();
    }

    @Bean
    @InboundChannelAdapter(value = "fileChannel", poller = @Poller(fixedDelay = "1000"))
    public MessageSource<File> fileReadingMessageSource() {
        FileReadingMessageSource sourceReader = new FileReadingMessageSource();
        sourceReader.setDirectory(new File(INPUT_DIR));
        sourceReader.setFilter(new SimplePatternFileListFilter(FILE_PATTERN));
        return sourceReader;
    }

    @Bean
    @ServiceActivator(inputChannel = "fileChannel")
    public MessageHandler fileWritingMessageHandler() {
        FileWritingMessageHandler handler = new FileWritingMessageHandler(new File(OUTPUT_DIR));
        handler.setFileExistsMode(FileExistsMode.REPLACE);
        handler.setExpectReply(false);
        return handler;
    }
}
```

The `@EnableIntegration` annotation designates this class as a Spring Integration configuration.

### Application

```java
package lsieun.tmp;

import lsieun.tmp.config.BasicIntegrationConfig;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.support.AbstractApplicationContext;

import java.util.Scanner;

public class Application {
    public static void main(String[] args) {
        AbstractApplicationContext context = new AnnotationConfigApplicationContext(BasicIntegrationConfig.class);
        context.registerShutdownHook();

        Scanner scanner = new Scanner(System.in);
        System.out.print("Please enter q and press <enter> to exit the program: ");

        while (true) {
            String input = scanner.nextLine();
            if("q".equals(input.trim())) {
                break;
            }
        }
        System.exit(0);
    }
}
```

## Reference

- [Spring Integration Reference Guide](https://docs.spring.io/spring-integration/reference/html/)
  - [MQTT Support](https://docs.spring.io/spring-integration/reference/html/mqtt.html)
- [Baeldung Tag: Spring Integration](https://www.baeldung.com/tag/spring-integration)
  - [Introduction to Spring Integration](https://www.baeldung.com/spring-integration)
