---
title: "Mosquitto MQTT Broker"
sequence: "201"
---

Eclipse Mosquitto is an open source (EPL/EDL licensed) message broker
that implements the MQTT protocol versions 5.0, 3.1.1 and 3.1.

It is written in C by Roger Light, and is available as a free download for Windows and Linux and is an Eclipse project.

Mosquitto is lightweight and is suitable for use on all devices from low power single board computers to full servers.

## Version

### Mosquitto v2

Mosquitto v2 introduced some important changes that affect first time users in particular.

By default, it requires **authentication** and **doesn't listen** on a network address.

The following simple configuration file will make mosquitto start like previous versions:

File: `mosquitto.conf`

```text
listener 1883
allow_anonymous true
```

运行：

```text
mosquitto -c mosquitto.conf
```

## 下载

## Installing The Broker



## 使用

### 查看帮助

```text
mosquitto -h
```

```text
>mosquitto -h
mosquitto version 2.0.15

mosquitto is an MQTT v5.0/v3.1.1/v3.1 broker.

Usage: mosquitto [-c config_file] [-d] [-h] [-p port]

 -c : specify the broker config file.
 -d : put the broker into the background after starting.
 -h : display this help.
 -p : start the broker listening on the specified port.
      Not recommended in conjunction with the -c option.
 -v : verbose mode - enable all logging types. This overrides
      any logging options given in the config file.

See https://mosquitto.org/ for more information.
```

### verbose mode

查看详细信息：

```text
#start in verbose mode
mosquitto -v
```

### 配置文件

```text
mosquitto -c <configFile>
```

```text
>mosquitto -c mosquitto.conf -v
```

```text
>mosquitto -c D:/mosquitto.conf -v
```

### 端口

By default, the broker will start listening on port `1883`.

You can change that by editing the configuration file: `mosquitto.conf`.

Alternatively you can use a command line switch to specify the port e.g.

```text
mosquitto -p 1884
```

You can run Multiple brokers on the same machine by starting them on different ports.

## Mosquitto Client Programs

The mosquitto install includes the client testing programs.

There is a simple subscriber client

```text
mosquitto_sub
```

and a publisher client

```text
mosquitto_pub
```

They are useful for some quick tests.

## The mosquitto.conf File

The configuration file (`mosquitto.conf`) that comes with the installation is completely commented out,
and the MQTT broker doesn't need it to start.

However, **when Mosquitto runs as a service it uses this configuration file.**

```text
Don't use the commented out version and edit it as it is very long and difficult to navigate.
```

Instead, create a blank file and add you entries to it using the commented out file as documentation.

## Mosquitto Logging

If you enable logging in the `mosquitto.conf` file
then when mosquitto runs it creates this file with restricted permissions,
and locks the file while the broker is running.

If you stop the broker you can change the permissions on the file to access it.

## Mosquitto 2..0.2 and above

Mosquitto v2 introduced some important changes that affect first time users in particular.

By default, it requires authentication and doesn't listen on a network address.

The following simple configuration file will make mosquitto start like previous versions:

```text
listener 1883
allow_anonymous true
```

## Reference

- [Eclipse Mosquitto](https://mosquitto.org/): An open source MQTT broker
- [Mosquitto MQTT Broker](http://www.steves-internet-guide.com/mosquitto-broker/)
  - [How to Install The Mosquitto MQTT Broker on Windows](http://www.steves-internet-guide.com/install-mosquitto-broker/)
  - [How to Install The Mosquitto MQTT Broker on Linux](http://www.steves-internet-guide.com/install-mosquitto-linux/)
