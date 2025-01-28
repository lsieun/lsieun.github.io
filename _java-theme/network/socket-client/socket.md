---
title: "Socket"
sequence: "101"
---

The `java.net.Socket` class is Java's fundamental class for performing client-side TCP operations.
Other client-oriented classes that make TCP network connections such as `URL`, `URLConnection`, `Applet`,
and `JEditorPane` all ultimately end up invoking the methods of this class.
This class itself uses **native code** to communicate with the local TCP stack of the host operating system.

## Using Sockets

A socket is a connection between two hosts. It can perform seven basic operations:

- Connect to a remote machine (client + server)
- Send data (client + server)
- Receive data (client + server)
- Close a connection (client + server)
- Bind to a port (server)
- Listen for incoming data (server)
- Accept connections from remote machines on the bound port (server)

Java's `Socket` class, which is used by both **clients** and **servers**,
has methods that correspond to the first four of these operations.
The last three operations are needed only by servers,
which wait for clients to connect to them.
They are implemented by the `ServerSocket` class.

Java programs normally use **client sockets** in the following fashion:

- The program creates a new socket with a constructor.
- The socket attempts to connect to the remote host.

**Once the connection is established**,
the local and remote hosts **get input and output streams** from the socket and
**use those streams to send data to each other**.
This connection is **full-duplex**. **Both hosts can send and receive data simultaneously**.
What the data means depends on the protocol; different commands are sent to an FTP server than to an HTTP server.
There will normally be some agreed-upon handshaking followed by the transmission of data from one to the other.

**When the transmission of data is complete**, one or both sides **close the connection**.
Some protocols, such as HTTP 1.0, require the connection to be closed after each request is serviced.
Others, such as FTP and HTTP 1.1, allow multiple requests to be processed in a single connection.

## Constructing and Connecting Sockets

### Basic Constructors

Each `Socket` constructor specifies the **host** and the **port** to connect to.
Hosts may be specified as an `InetAddress` or a `String`.
Remote ports are specified as `int` values from `1` to `65535`:

```text
public Socket(String host, int port) throws UnknownHostException, IOException
public Socket(InetAddress host, int port) throws IOException
```

```java
import java.io.IOException;
import java.net.Socket;

public class SocketRun {
    public static void main(String[] args) {
        try {
            Socket toOReilly = new Socket("www.oreilly.com", 80);
            // send and receive data...
        } catch (IOException ex) {
            System.err.println(ex);
        }
    }
}
```

These constructors connect the socket
(i.e., before the constructor returns, an active network connection is established to the remote host).
If the connection can't be opened for some reason, the constructor throws an `IOException` or an `UnknownHostException`.

Because this constructor doesn't just create a `Socket` object but also tries to connect the socket to the remote host,
you can use the object to determine whether connections to a particular port are allowed.

```java
import java.io.IOException;
import java.net.Socket;
import java.net.UnknownHostException;

public class LowPortScanner {
    public static void main(String[] args) {
        String host = args.length > 0 ? args[0] : "localhost";
        for (int i = 1; i < 1024; i++) {
            try {
                Socket s = new Socket(host, i);
                System.out.println("There is a server on port " + i + " of " + host);
                s.close();
            } catch (UnknownHostException ex) {
                System.err.println(ex);
                break;
            } catch (IOException ex) {
                // must not be a server on this port
            }
        }
    }
}
```

If you're curious about what servers are running on these ports, try experimenting with Telnet.
On a Unix system, you may be able to find out which services reside on which ports by looking in the file `/etc/services`.

Three constructors create **unconnected sockets**.
These provide more control over exactly how the underlying socket behaves,
for instance by choosing a different proxy server or an encryption scheme:

```text
public Socket()
public Socket(Proxy proxy)
protected Socket(SocketImpl impl)
```

### Picking a Local Interface to Connect From

Two constructors specify both the **host** and **port** to connect to and the **interface** and **port** to connect from:

```text
public Socket(String host, int port, InetAddress interface, int localPort)
    throws IOException, UnknownHostException
public Socket(InetAddress host, int port, InetAddress interface, int localPort)
    throws IOException
```

If `0` is passed for the `localPort` argument, Java chooses a random available port between `1024` and `65535`.

```text
try {
    InetAddress inward = InetAddress.getByName("router");
    Socket socket = new Socket("mail", 25, inward, 0);
    // work with the sockets...
} catch (IOException ex) {
    System.err.println(ex);
}
```

```java
import java.io.IOException;
import java.net.InetAddress;
import java.net.Socket;

public class SocketRun {
    public static void main(String[] args) {
        try {
            InetAddress inward = InetAddress.getByName("router");
            Socket socket = new Socket("mail", 25, inward, 0);
            // work with the sockets...
        } catch (IOException ex) {
            System.err.println(ex);
        }
    }
}
```

### Constructing Without Connecting

All the constructors we've talked about so far
both **create the socket object** and **open a network connection to a remote host**.
Sometimes you want to split those operations.
If you give no arguments to the `Socket` constructor, it has nowhere to connect to:

```text
public Socket()
```

You can connect later by passing a `SocketAddress` to one of the `connect()` methods.

```text
try {
    Socket socket = new Socket();
    // fill in socket options
    SocketAddress address = new InetSocketAddress("time.nist.gov", 13);
    socket.connect(address);
    // work with the sockets...
} catch (IOException ex) {
    System.err.println(ex);
}
```

```java
import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.net.SocketAddress;

public class SocketRun {
    public static void main(String[] args) {
        try {
            Socket socket = new Socket();
            // fill in socket options
            SocketAddress address = new InetSocketAddress("time.nist.gov", 13);
            socket.connect(address);
            // work with the sockets...
            socket.close();
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }
}
```

You can pass an `int` as the second argument to specify the number of milliseconds to wait before the connection times out:

```text
public void connect(SocketAddress endpoint, int timeout) throws IOException
```

The default, `0`, means wait forever.

The reason for this constructor is to enable different kinds of sockets.
You also need to use it to set a **socket option** that can **only be changed before the socket connects**.

### Proxy Servers

The last constructor creates an unconnected socket that connects through a specified proxy server:

```text
public Socket(Proxy proxy)
```

Normally, the proxy server a socket uses is controlled by the `socksProxyHost` and `socksProxyPort` system properties,
and these properties apply to **all sockets in the system**.
However, a socket created by this constructor will use the specified proxy server instead.
Most notably, you can pass `Proxy.NO_PROXY` for the argument
to bypass all proxy servers completely and connect directly to the remote host.
Of course, if a firewall prevents direct connections, there's nothing Java can do about it; and the connection will fail.

To use a particular proxy server, specify it by address.
For example, this code fragment uses the SOCKS proxy server at `myproxy.example.com`
to connect to the host `login.ibiblio.org`:

```text
SocketAddress proxyAddress = new InetSocketAddress("myproxy.example.com", 1080);
Proxy proxy = new Proxy(Proxy.Type.SOCKS, proxyAddress)

Socket s = new Socket(proxy);
SocketAddress remote = new InetSocketAddress("login.ibiblio.org", 25);
s.connect(remote);
```

`SOCKS` is the only low-level proxy type Java understands.
There's also a high-level `Proxy.Type.HTTP` that works in the application layer
rather than the transport layer and a `Proxy.Type.DIRECT` that represents proxyless connections.

## Getting Information About a Socket

### address and port

`Socket` objects have several properties that are accessible through getter methods:

- Remote address
- Remote port
- Local address
- Local port

Here are the getter methods for accessing these properties:

```text
public InetAddress getInetAddress()
public int getPort()
public InetAddress getLocalAddress()
public int getLocalPort()
```

There are no setter methods. These properties are set as soon as the socket connects, and are fixed from there on.

### Closed or Connected?

The `isClosed()` method returns `true` if the socket is closed, `false` if it isn't.
If you're uncertain about a socket's state, you can check it with this method rather than risking an `IOException`.

If the socket has never been connected in the first place,
`isClosed()` returns `false`, even though **the socket isn't exactly open**.

The `Socket` class also has an `isConnected()` method.
The name is a little misleading.
It **does not tell you if the socket is currently connected to a remote host** (like if it is unclosed).
Instead, it tells you **whether the socket has ever been connected to a remote host**.
If the socket was able to connect to the remote host at all, this method returns `true`,
even after that socket has been closed.
To tell if a socket is currently open,
you need to check that `isConnected()` returns `true` and `isClosed()` returns `false`. For example:

```text
boolean connected = socket.isConnected() && ! socket.isClosed();
```

Finally, the `isBound()` method tells you whether the socket successfully bound to the outgoing port on the local system.
Whereas `isConnected()` refers to the remote end of the socket, `isBound()` refers to the local end.

### transitory objects

Because sockets are transitory objects that typically last only as long as the connection they represent,
there's not much reason to store them in hash tables or compare them to each other.
Therefore, `Socket` does not override `equals()` or `hashCode()`,
and the semantics for these methods are those of the `Object` class.
Two `Socket` objects are equal to each other if and only if they are the same object.

## Half-closed sockets

The `close()` method shuts down both input and output from the socket.
On occasion, you may want to shut down only half of the connection, either input or output.
The `shutdownInput()` and `shutdownOutput()` methods close only half the connection:

```text
public void shutdownInput() throws IOException
public void shutdownOutput() throws IOException
```

Neither actually closes the socket.
Instead, they adjust the stream connected to the socket so that it thinks it's at the end of the stream.
Further reads from the input stream after shutting down input return `-1`.
Further writes to the socket after shutting down output throw an `IOException`.

Notice that even though you shut down half or even both halves of a connection,
you still need to close the socket when you're through with it.
The shutdown methods simply affect the socket's streams.
They don't release the resources associated with the socket, such as the port it occupies.

The `isInputShutdown()` and `isOutputShutdown()` methods
tell you whether the input and output streams are open or closed, respectively.
You can use these (rather than `isConnected()` and `isClosed()`) to more specifically ascertain
whether you can read from or write to a socket:

```text
public boolean isInputShutdown()
public boolean isOutputShutdown()
```
