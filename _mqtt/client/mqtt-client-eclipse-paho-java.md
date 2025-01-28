---
title: "Eclipse Paho MQTT"
sequence: "201"
---

```text
                             ┌─── connect()
                             │
                             ├─── disconnect()
               ┌─── conn ────┤
               │             ├─── isConnected()
               │             │
               │             └─── reconnect()
               │
               │             ┌─── subscribe(topicFilter)
               │             │
               │             ├─── unsubscribe(topicFilter)
               │             │
IMqttClient ───┼─── topic ───┼─── publish(topic, message)
               │             │
               │             ├─── getTopic(topic)
               │             │
               │             └─── setCallback(callback)
               │
               │             ┌─── getClientId()
               │             │
               │             ├─── getServerURI()
               └─── other ───┤
                             ├─── setManualAcks(manualAcks)
                             │
                             └─── close()
```

## pom.xml

```xml
<dependency>
    <groupId>org.eclipse.paho</groupId>
    <artifactId>org.eclipse.paho.client.mqttv3</artifactId>
    <version>1.2.5</version>
</dependency>
```

## Publish Example

```java
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;

import java.util.UUID;

public class HelloWorld {
    public static void main(String[] args) {
        String broker      = "tcp://mqtt.eclipseprojects.io:1883";
        String topic       = "mqtt/test";
        String username    = "root";
        String password    = "123456";
        String content     = "Hello MQTT";
        int qos            = 0;
        String publisherId = UUID.randomUUID().toString();

        try {
            MqttClient client = new MqttClient(broker, publisherId);

            // options
            MqttConnectOptions options = new MqttConnectOptions();
            options.setUserName(username);
            options.setPassword(password.toCharArray());
            options.setAutomaticReconnect(true);
            options.setCleanSession(true);
            options.setConnectionTimeout(30);
            options.setKeepAliveInterval(40);

            // connect
            client.connect(options);

            // create message and setup QoS
            MqttMessage message = new MqttMessage(content.getBytes());
            message.setQos(qos);

            // publish message
            client.publish(topic, message);
            System.out.println("Message published");
            System.out.println("topic: " + topic);
            System.out.println("message content: " + content);

            // disconnect
            client.disconnect();

            // close client
            client.close();
        } catch (MqttException e) {
            throw new RuntimeException(e);
        }
    }
}
```

## Subscribe Example

```java
import org.eclipse.paho.client.mqttv3.*;

import java.util.UUID;

public class HelloSubscribe {
    public static void main(String[] args) {
        String broker      = "tcp://mqtt.eclipseprojects.io:1883";
        String topic       = "mqtt/test";
        String username    = "root";
        String password    = "123456";
        int qos            = 0;
        String clientId = UUID.randomUUID().toString();

        try (
                MqttClient client = new MqttClient(broker, clientId)
                ){
            // options
            MqttConnectOptions options = new MqttConnectOptions();
            options.setUserName(username);
            options.setPassword(password.toCharArray());
            options.setAutomaticReconnect(true);
            options.setCleanSession(true);
            options.setConnectionTimeout(30);
            options.setKeepAliveInterval(40);

            // setup callback
            client.setCallback(new MqttCallback() {

                public void connectionLost(Throwable cause) {
                    System.out.println("connectionLost: " + cause.getMessage());
                }

                public void messageArrived(String topic, MqttMessage message) {
                    System.out.println("topic: " + topic);
                    System.out.println("Qos: " + message.getQos());
                    System.out.println("message content: " + new String(message.getPayload()));

                }

                public void deliveryComplete(IMqttDeliveryToken token) {
                    System.out.println("deliveryComplete---------" + token.isComplete());
                }

            });

            // connect
            client.connect(options);

            // subscribe
            client.subscribe(topic, qos);
        } catch (MqttException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }
}
```

## Example

```java
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;

import java.util.UUID;
import java.util.concurrent.Callable;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

public class HelloWorld {
    public static void main(String[] args) throws Exception {
        String publisherId = UUID.randomUUID().toString();
        MqttClient publisher = new MqttClient("tcp://iot.eclipse.org:1883", publisherId);

        String subscriberId = UUID.randomUUID().toString();
        MqttClient subscriber = new MqttClient("tcp://iot.eclipse.org:1883", subscriberId);

        MqttConnectOptions options = new MqttConnectOptions();
        options.setAutomaticReconnect(true);
        options.setCleanSession(true);
        options.setConnectionTimeout(10);

        subscriber.connect(options);
        publisher.connect(options);

        CountDownLatch receivedSignal = new CountDownLatch(1);

        subscriber.subscribe(EngineTemperatureSensor.TOPIC, (topic, msg) -> {
            byte[] payload = msg.getPayload();
            String info = String.format("[I46] Message received: topic=%s, payload=%s", topic, new String(payload));
            System.out.println(info);

            receivedSignal.countDown();
        });

        Callable<Void> target = new EngineTemperatureSensor(publisher);
        target.call();

        receivedSignal.await(1, TimeUnit.MINUTES);
        System.out.println("[I56] Success !");
    }
}
```



## Reference

- [MQTT Java client library](https://www.emqx.io/docs/en/v5.0/development/java.html)
- [Paho-MQTT Java接入示例](https://help.aliyun.com/document_detail/146631.html)
- [How to Use MQTT in Java](https://www.emqx.com/en/blog/how-to-use-mqtt-in-java)
- [Programming lightweight IoT messaging with MQTT in Java](https://blogs.oracle.com/javamagazine/post/java-mqtt-iot-message-queuing)
- [MQTT 101 – How to Get Started with the lightweight IoT Protocol](https://www.eclipse.org/community/eclipse_newsletter/2014/october/article2.php)
- [IoT Data Pipeline with MQTT, NiFi, and InfluxDB](https://www.baeldung.com/iot-data-pipeline-mqtt-nifi)
- [MQTT Client in Java](https://www.baeldung.com/java-mqtt-client)
- [MQTT Java client library](https://www.emqx.io/docs/en/v4.4/development/java.html#paho-java-usage-example)
- [使用java 实现mqtt两种方式](https://blog.csdn.net/houxian1103/article/details/126944419)
