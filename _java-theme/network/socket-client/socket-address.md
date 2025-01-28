---
title: "Socket Address"
sequence: "103"
---

The `SocketAddress` class represents a connection endpoint.
It is an empty abstract class with no methods aside from a default constructor.
At least theoretically, the `SocketAddress` class can be used for both TCP and non-TCP sockets.
In practice, only TCP/IP sockets are currently supported and
the socket addresses you actually use are all instances of `InetSocketAddress`.

The primary purpose of the `SocketAddress` class is to provide a convenient store for
transient socket connection information such as the **IP address** and **port**
that can be reused to create new sockets, even after the original socket is disconnected and garbage collected.

```txt
socket address = ip address + port
```

## From Socket

To this end, the `Socket` class offers two methods that return `SocketAddress` objects
(`getRemoteSocketAddress()` returns the address of the system being connected to and
`getLocalSocketAddress()` returns the address from which the connection is made):

```text
public SocketAddress getRemoteSocketAddress()
public SocketAddress getLocalSocketAddress()
```

Both of these methods return `null` if the socket is not yet connected.

## InetSocketAddress

### Constructor

The `InetSocketAddress` class
(which is the only subclass of `SocketAddress` in the JDK, and the only subclass I've ever encountered)
is usually created with a **host** and a **port** (for clients) or just a **port** (for servers):

```text
public InetSocketAddress(InetAddress address, int port)
public InetSocketAddress(String host, int port)
public InetSocketAddress(int port)
```

### Static Factory Method

You can also use the static factory method `InetSocketAddress.createUnresolved()` to skip looking up the host in DNS:

```text
public static InetSocketAddress createUnresolved(String host, int port)
```

### Getter Methods

`InetSocketAddress` has a few getter methods you can use to inspect the object:

```text
public final InetAddress getAddress()
public final int getPort()
public final String getHostName()
```

