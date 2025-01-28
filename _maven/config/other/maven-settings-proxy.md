---
title: "Proxy"
sequence: "101"
---

The `<proxies>` element allows us to configure proxies used to connect to the network.

```xml
<proxies>
    <!-- proxy
     | Specification for one proxy, to be used in connecting to the network.
    -->
    <proxy>
        <id>optional</id>
        <active>true</active>
        <protocol>http</protocol>
        <username>proxyuser</username>
        <password>proxypass</password>
        <host>proxy.host.net</host>
        <port>80</port>
        <nonProxyHosts>local.net|some.host.com</nonProxyHosts>
    </proxy>
</proxies>
```
