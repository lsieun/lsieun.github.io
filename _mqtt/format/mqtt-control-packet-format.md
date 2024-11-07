---
title: "MQTT Control Packet format"
sequence: "106"
---

## Structure of an MQTT Control Packet

The MQTT protocol works by exchanging a series of **MQTT Control Packets** in a defined way.

An MQTT Control Packet consists of up to three parts:

![](/assets/images/mqtt/structure-of-an-mqtt-control-packet.png)

```text
                                               ┌─── MQTT Control Packet type
                                               │
                       ┌─── Fixed header ──────┼─── Flags
                       │                       │
                       │                       └─── Remaining Length
MQTT Control Packet ───┤
                       ├─── Variable header ───┼─── Packet Identifier
                       │
                       └─── Payload
```

### Fixed header

Each MQTT Control Packet contains a fixed header.

![](/assets/images/mqtt/fixed-header-format.png)

#### MQTT Control Packet type

**Position**: byte 1, bits 7-4. Represented as a 4-bit unsigned value.

![](/assets/images/mqtt/control-packet-types.png)

#### Flags

The remaining bits `[3-0]` of **byte 1** in the fixed header contain flags specific to each MQTT Control Packet type.

Where a flag bit is marked as “Reserved”,
it is reserved for future use and MUST be set to the value listed in that table.
If invalid flags are received, the receiver MUST close the Network Connection.

![](/assets/images/mqtt/flag-bits.png)

#### Remaining Length

**Position**: starts at byte 2.

The Remaining Length is the number of bytes remaining within the current packet,
including data in the **variable header** and the **payload**.
The Remaining Length does not include the bytes used to encode the Remaining Length.

The Remaining Length is encoded using a **variable length encoding scheme**
which uses a single byte for values up to 127.
Larger values are handled as follows.
The least significant seven bits of each byte encode the data,
and the most significant bit is used to indicate that there are following bytes in the representation.
Thus each byte encodes 128 values and a "continuation bit".

**The maximum number of bytes in the Remaining Length field is four.**

![](/assets/images/mqtt/size-of-remaining-length-field.png)

For example, the number 64 decimal is encoded as a single byte, decimal value 64, hexadecimal `0x40`.
The number `321` decimal (`= 65 + 2*128`) is encoded as two bytes, least significant first.
The first byte is `65+128 = 193`.
Note that the top bit is set to indicate at least one following byte.
The second byte is `2`.

This allows applications to send Control Packets of size up to `268,435,455` (256 MB).
The representation of this number on the wire is: `0xFF, 0xFF, 0xFF, 0x7F`.

### Variable header

Some types of MQTT Control Packets contain a variable header component.
It resides between the **fixed header** and the **payload**.
The content of the variable header varies depending on the Packet type.
The Packet Identifier field of variable header is common in several packet types.

Control Packets that require a Packet Identifier are listed in Table:

![](/assets/images/mqtt/control-packets-that-contain-a-packet-identifier.png)


#### Packet Identifier

![](/assets/images/mqtt/packet-identifier-bytes.png)

The variable header component of many of the Control Packet types includes a 2 byte Packet Identifier field.
These Control Packets are `PUBLISH` (where `QoS > 0`), `PUBACK`, `PUBREC`, `PUBREL`, `PUBCOMP`,
`SUBSCRIBE`, `SUBACK`, `UNSUBSCRIBE`, `UNSUBACK`.

`SUBSCRIBE`, `UNSUBSCRIBE`, and `PUBLISH` (in cases where QoS > 0) Control Packets
MUST contain a non-zero 16-bit Packet Identifier.
Each time a Client sends a new packet of one of these types it MUST assign it a currently unused Packet Identifier.
If a Client re-sends a particular Control Packet,
then it MUST use the same Packet Identifier in subsequent re-sends of that packet.
The Packet Identifier becomes available for reuse
after the Client has processed the corresponding acknowledgement packet.
In the case of a QoS 1 `PUBLISH` this is the corresponding `PUBACK`;
in the case of QoS 2 it is `PUBCOMP`.
For `SUBSCRIBE` or `UNSUBSCRIBE` it is the corresponding `SUBACK` or `UNSUBACK`.
The same conditions apply to a Server when it sends a `PUBLISH` with `QoS > 0`.

A `PUBLISH` Packet MUST NOT contain a Packet Identifier if its QoS value is set to `0`.

A `PUBACK`, `PUBREC` or `PUBREL` Packet MUST contain the same Packet Identifier as the `PUBLISH` Packet
that was originally sent.
Similarly `SUBACK` and `UNSUBACK` MUST contain the Packet Identifier
that was used in the corresponding `SUBSCRIBE` and `UNSUBSCRIBE` Packet respectively.

The Client and Server assign Packet Identifiers independently of each other.
As a result, Client Server pairs can participate in concurrent message exchanges using the same Packet Identifiers.

It is possible for a Client to send a `PUBLISH` Packet with Packet Identifier `0x1234` and
then receive a different `PUBLISH` with Packet Identifier `0x1234` from its Server
before it receives a `PUBACK` for the `PUBLISH` that it sent.

```text
   Client                     Server
   PUBLISH Packet Identifier=0x1234--->
   <--PUBLISH Packet Identifier=0x1234
   PUBACK Packet Identifier=0x1234--->
   <--PUBACK Packet Identifier=0x1234
```

### Payload

Some MQTT Control Packets contain a payload as the final part of the packet.
In the case of the `PUBLISH` packet this is the Application Message.

The following table lists the Control Packets that require a Payload.

![](/assets/images/mqtt/control-packets-that-contain-a-payload.png)

## MQTT Control Packets

### CONNECT – Client requests a connection to a Server

After a Network Connection is established by a Client to a Server,
the first Packet sent from the Client to the Server MUST be a `CONNECT` Packet.

A Client can only send the `CONNECT` Packet once over a Network Connection.
The Server MUST process a second `CONNECT` Packet sent from a Client
as a protocol violation and disconnect the Client.

The payload contains one or more encoded fields.
They specify a unique Client identifier for the Client, a Will topic, Will Message, User Name and Password.
All but the Client identifier are optional and their presence is determined based on flags in the **variable header**.

#### Fixed header

![](/assets/images/mqtt/connect-packet-fixed-header.png)

Remaining Length is the length of the variable header (10 bytes) plus the length of the Payload.

```text
Remaining Length = length of the variable header + length of the Payload
```

## Reference

- [MQTT Specifications](https://mqtt.org/mqtt-specification/)
    - [MQTT Version 5.0](https://docs.oasis-open.org/mqtt/mqtt/v5.0/mqtt-v5.0.html)
    - [MQTT Version 3.1.1](http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html)
    - [MQTT V3.1 Protocol Specification](https://public.dhe.ibm.com/software/dw/webservices/ws-mqtt/mqtt-v3r1.html)
- [Understanding the MQTT Protocol Packet Structure](http://www.steves-internet-guide.com/mqtt-protocol-messages-overview/)
