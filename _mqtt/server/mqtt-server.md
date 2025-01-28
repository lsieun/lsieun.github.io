---
title: "MQTT Server"
sequence: "101"
---

## mqtt.eclipseprojects.io

This is a public test MQTT broker service. It currently listens on the following ports:

- Broker: mqtt.eclipseprojects.io
- `1883`: MQTT over unencrypted TCP
- `8883`: MQTT over encrypted TCP
- `80`: MQTT over unencrypted WebSockets (note: URL must be `/mqtt`)
- `443`: MQTT over encrypted WebSockets (note: URL must be `/mqtt`)

## broker.emqx.io

MQTT Broker Info:

- Broker: broker.emqx.io
- TCP Port: 1883
- SSL/TLS Port: 8883
- WebSocket Port: 8083
- WebSocket Secure Port: 8084
- Certificate Authority: [broker.emqx.io-ca.crt](https://assets.emqx.com/data/broker.emqx.io-ca.crt)

## Reference

- [Public MQTT Broker for IoT Testing](https://www.emqx.com/en/mqtt/public-mqtt5-broker)
