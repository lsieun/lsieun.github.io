---
title: "JMXServiceURL"
sequence: "301"
---

[UP]({% link _java-theme/java-jmx-index.md %})

An example of a connector server address is this:

```text
service:jmx:rmi://127.0.0.1:9876/stub/rO0AB
```

All `JMXServiceURL` addresses begin with service: `jmx:`.
The appended `rmi` indicates the connector to use, in this case the RMI connector.
`127.0.0.1` and `9876` are respectively the `host` and the `port` on which the connector server is listening.

The immutable class `javax.management.remote.JMXServiceURL` extends `java.lang.Object`
and implements the `java.io.Serializable` interface to represent the address of a JMX connector server.

```java
public class JMXServiceURL implements Serializable {
}
```

The address is an Abstract Service URL for SLP, as defined in RFC 2609 and
amended by RFC 3111. It must look like this:

```text
service:jmx:protocol:address
```

Here, `protocol` is the transport protocol to be used to connect to the connector server.
It is a string of one or more ASCII characters, each of which is a letter, a digit, or one of the characters `+` or `-`.
The first character must be a letter.

The `address` is the address at which the connector server is found. Its supported syntax is

```text
//host[:port][url-path]
```

The `host` is a host name, an IPv4 numeric host address, or an IPv6 numeric address enclosed in square brackets.

The `port`, if any, is a decimal port number. `0` means a default or anonymous port, depending on the protocol.

The `url-path`, if any, begins with a slash (`/`) or a semicolon (`;`) and continues to the end of the address.
It can contain attributes using the semicolon syntax specified in RFC 2609.

Those attributes are not parsed by the `JMXServiceURL` class, and incorrect attribute syntax is not detected.
Although it is legal according to RFC 2609 to have a `url-path` that begins with a semicolon,
not all implementations of SLP allow it, so it is recommended to avoid that syntax.

```text
service:jmx:rmi://127.0.0.1/stub/rO0A...
```

Case is not significant in the initial `service:jmx:protocol` string or in the `host` part of the `address`.
Depending on the protocol, case can be significant in the `url-path`.
