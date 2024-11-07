---
title: "MQTT QoS (0, 1, 2)"
sequence: "105"
---

## What is QoS

In unstable network environments, MQTT devices may struggle to ensure reliable communication
using only the TCP transport protocol.

> 场景是 unstable network environments，需要实现的是 reliable communication，怎么样实现呢？

To address this issue, MQTT includes a **Quality of Service (QoS)** mechanism
that offers various message interaction options to provide different levels of service,
catering to the user's specific requirements for reliable message delivery in different scenarios.

> 为了解决这个问题，MQTT 包含了 QoS 机制。

There are 3 QoS levels in MQTT:

- QoS `0`, at most once.
- QoS `1`, at least once.
- QoS `2`, exactly once.

> QoS 包含 3 个等级。

These levels correspond to increasing levels of reliability for message delivery.

> QoS 的等级对应着 reliability for message delivery

QoS `0` may lose messages, QoS `1` guarantees the message delivery but potentially exists duplicate messages,
and QoS `2` ensures that messages are delivered exactly once without duplication.

> 概览理解三个等级都是什么

As the QoS level increases, the reliability of message delivery also increases,
but so does the complexity of the transmission process.

> 随着 level 增加，reliability 会增加，complexity 也会增加。

In the publisher-to-subscriber delivery process,
the publisher specifies the QoS level of a message in the `PUBLISH` packet.
The broker typically forwards the message to the subscriber with the same QoS level.
However, in some cases,
the subscriber's requirements may necessitate a reduction in the QoS level of the forwarded message.

> publisher、broker 和 subscriber 三者分别与 QoS level 的关系

For example, if a subscriber specifies that they only want to receive messages with a QoS level of 1 or lower,
the broker will downgrade any QoS 2 messages to QoS 1 before forwarding them to this subscriber.
Messages with QoS 0 and QoS 1 will be transmitted to the subscriber with their original QoS levels unchanged.

![](/assets/images/mqtt/mqtt-qos-level-downgrade-example.webp)

## QoS 0 - at most once

QoS 0 is the lowest level of service and is also known as "fire and forget".

In this mode, the sender does not wait for acknowledgement or store and retransmit the message,
so the receiver does not need to worry about receiving duplicate messages.

![](/assets/images/mqtt/mqtt-qos-level-0-example.webp)

### Why are QoS 0 messages lost?

The reliability of QoS 0 message transmission depends on the stability of the TCP connection.
If the connection is stable, TCP can ensure the successful delivery of messages.
However, if the connection is closed or reset,
there is a risk that messages in transit or messages in the operating system buffer may be lost,
resulting in the unsuccessful delivery of QoS 0 messages.

## QoS 1 - at least once

To ensure message delivery, QoS 1 introduces an **acknowledgement and retransmission** mechanism.
When the sender receives a `PUBACK` packet from the receiver, it considers the message delivered successfully.
Until then, the sender must store the `PUBLISH` packet for potential retransmission.

The sender uses the Packet ID in each packet to match the `PUBLISH` packet with the corresponding `PUBACK` packet.
This allows the sender to identify and delete the correct `PUBLISH` packet from its cache.

![](/assets/images/mqtt/mqtt-qos-level-1-example.webp)

### Why are QoS 1 messages duplicated?

#### sender 没有收到 PUBACK 的两种情况

There are two cases in which the sender will not receive a `PUBACK` packet.

- The `PUBLISH` packet did not reach the receiver.
- The `PUBLISH` packet reached the receiver but the receiver's `PUBACK` packet has not yet been received by the sender.

In the first case, the sender will retransmit the `PUBLISH` packet, but the receiver will only receive the message once.

In the second case, the sender will retransmit the `PUBLISH` packet and the receiver will receive it again, resulting in a duplicate message.

![](/assets/images/mqtt/mqtt-qos-level-1-sender-retransmit-packet.webp)

#### receiver 收到 DUP 的两种情况

Even though the `DUP` flag in the retransmitted `PUBLISH` packet is set to 1 to indicate that it is a duplicate message,
the receiver cannot assume that it has already received the message and must still treat it as a new message.

It is because that there are two possible scenarios when the receiver receives a `PUBLISH` packet with a `DUP` flag of 1:

![](/assets/images/mqtt/mqtt-qos-level-1-receiver-publish-packet-with-dup.webp)

In the first case, the sender retransmits the `PUBLISH` packet because it did not receive a `PUBACK` packet.
The receiver receives two `PUBLISH` packets with the same Packet ID and the second `PUBLISH` packet has a DUP flag of 1.
The second packet is indeed a duplicate message.

In the second case, the original `PUBLISH` packet was delivered successfully.
Then, this Packet ID is used for a new, unrelated message.
But this new message was not successfully delivered to the peer the first time it was sent, so it was retransmitted.
Finally, the retransmitted `PUBLISH` packet will have the same Packet ID and a `DUP` flag of 1, but it is a new message.

Since it is not possible to distinguish between these two cases,
the receiver must treat all `PUBLISH` packets with a DUP flag of 1 as **new messages**.
This means that it is inevitable for there to be duplicate messages at the protocol level when using QoS 1.

#### rare cases

In rare cases, the broker may receive duplicate `PUBLISH` packets from the publisher and,
during the process of forwarding them to the subscriber, retransmit them again.
This can result in the subscriber receiving additional duplicate messages.

For example, although the publisher only sends one message,
the receiver may eventually receive three identical messages.

![](/assets/images/mqtt/mqtt-qos-level-1-additional-duplicate-messages.webp)

These are the drawbacks of using QoS 1.

## QoS 2 - exactly once

QoS 2 ensures that messages are not lost or duplicated, unlike in QoS 0 and 1.
However, it also has the most complex interactions and the highest overhead,
as it requires at least two request/response flows between the sender and receiver for each message delivery.

![](/assets/images/mqtt/mqtt-qos-level-2-example.webp)

To initiate a QoS 2 message transmission,
the sender first stores and sends a `PUBLISH` packet with QoS 2 and then waits for a `PUBREC` response packet from the receiver.
This process is similar to QoS 1, with the exception that the response packet is `PUBREC` instead of `PUBACK`.

> sender: PUBLISH --> receiver: PUBREC

Upon receiving a `PUBREC` packet,
the sender can confirm that the `PUBLISH` packet was received by the receiver and can delete its locally stored copy.
It no longer needs and cannot retransmit this packet.
The sender then sends a `PUBREL` packet to inform the receiver that it is ready to release the Packet ID.
Like the `PUBLISH` packet, the `PUBREL` packet needs to be reliably delivered to the receiver,
so it is stored for potential retransmission and a response packet is required.

> receiver: PUBREC --> sender: PUBREL

When the receiver receives the `PUBREL` packet,
it can confirm that no additional retransmitted `PUBLISH` packets will be received in this transmission flow.
As a result, the receiver responds with a `PUBCOMP` packet to signal
that it is prepared to reuse the current Packet ID for a new message.

> sender: PUBREL --> receiver: PUBCOMP

When the sender receives the `PUBCOMP` packet, the QoS 2 flow is complete.
The sender can then send a new message with the current Packet ID, which the receiver will treat as a new message.

> receiver: PUBCOMP


### Why are QoS 2 messages not duplicated?

The mechanisms used to ensure that QoS 2 messages are not lost are the same as those used for QoS 1,
so they will not be discussed again here.

Compared with QoS 1,
QoS 2 ensures that messages are not duplicated by adding a new process involving the `PUBREL` and `PUBCOMP` packets.

> QoS 1 vs. QoS 2

Before we go any further, let's quickly review the reasons why QoS 1 cannot avoid message duplication.

When we use QoS 1, for the receiver, the Packet ID becomes available again after the `PUBACK` packet is sent,
regardless of whether the response has reached the sender.
This means that the receiver cannot determine whether the `PUBLISH` packet it receives later, with the same Packet ID,
is a retransmission from the sender due to not receiving the `PUBACK` response,
or if the sender has reused the Packet ID to send a new message after receiving the `PUBACK` response.
This is why QoS 1 cannot avoid message duplication.

![](/assets/images/mqtt/mqtt-qos-level-1-cannot-avoid-message-duplication.webp)

In QoS 2, the sender and receiver use the `PUBREL` and `PUBCOMP` packets to synchronize the release of Packet IDs,
ensuring that there is a consensus on whether the sender is retransmitting a message or sending a new one.
This is the key to avoiding the issue of duplicate messages that can occur in QoS 1.

![](/assets/images/mqtt/mqtt-qos-level-2-avoid-duplicate-messages.webp)

In QoS 2, the sender is permitted to retransmit the `PUBLISH` packet
before receiving the `PUBREC` packet from the receiver.
Once the sender receives the `PUBREC` and sends a `PUBREL` packet, it enters the Packet ID release process.
The sender cannot retransmit the `PUBLISH` packet or send a new message with the current Packet ID
until it receives a `PUBCOMP` packet from the receiver.

![](/assets/images/mqtt/mqtt-qos-level-2-publish-compare.webp)

As a result, the **receiver** can use the `PUBREL` packet as a boundary and consider any `PUBLISH` packet
that arrives before it as a duplicate and any `PUBLISH` packet that arrives after it as new.
This allows us to avoid message duplication at the protocol level when using QoS 2.

## Scenarios and considerations

### QoS 0

**The main disadvantage of QoS 0 is that messages may be lost, depending on the network conditions.**
This means that you may miss messages if you are disconnected.
**However, the advantage of QoS 0 is that it is more efficient for message delivery.**

**Therefore, it is often used to send high-frequency, less important data,**
such as periodic sensor updates, **where it is acceptable to miss a few updates.**

### QoS 1

QoS 1 ensures that messages are delivered at least once, but it can result in duplicate messages.
This makes it suitable for transmitting important data such as critical instructions or real-time updates of important status.
However, it is important to consider how to handle or allow for such duplication
before deciding to use QoS 1 without de-duplication.

For instance, if the publisher sends messages in the order 1, 2,
but the subscriber receives them in the order 1, 2, 1, 2,
with 1 representing a command to turn a light on and 2 representing a command to turn it off,
it may not be desirable for the light to repeatedly turn on and off due to duplicate messages.

![](/assets/images/mqtt/mqtt-qos-level-1-duplicate-message-on-off.webp)

### QoS 2

**QoS 2 ensures that messages are not lost or duplicated. However, it also has the highest overhead.**

If users are not willing to handle message duplication by themself and can accept the additional overhead of QoS 2,
then it is a suitable choice.

QoS 2 is often used in industries such as finance and aviation
where it is critical to ensure reliable message delivery and avoid duplication.

## Reference

- [Introduction to MQTT QoS 0, 1, 2](https://www.emqx.com/en/blog/introduction-to-mqtt-qos)

