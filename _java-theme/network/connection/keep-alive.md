---
title: "Keep-Alive"
sequence: "113"
---

The `URL` class transparently supports HTTP `Keep-Alive` unless explicitly turned off. That is, it will reuse a socket if you connect to the same server again before the server has closed the connection.

You can control Java's use of HTTP `Keep-Alive` with several system properties:

- Set `http.keepAlive` to “true or false” to enable/disable HTTP Keep-Alive. (It is enabled by default.)
- Set `http.maxConnections` to the number of sockets you're willing to hold open at one time. The default is `5`.
- Set `http.keepAlive.remainingData` to `true` to let Java clean up after abandoned connections (Java 6 or later). It is `false` by default.
- Set `sun.net.http.errorstream.enableBuffering` to `true` to attempt to buffer the relatively short error streams from 400- and 500-level responses, so the connection can be freed up for reuse sooner. It is `false` by default.
- Set `sun.net.http.errorstream.bufferSize` to the number of bytes to use for buffering error streams. The default is `4,096` bytes.
- Set `sun.net.http.errorstream.timeout` to the number of milliseconds before timing out a read from the error stream. It is `300` milliseconds by default.

The defaults are reasonable, except that you probably do want to set `sun.net.http.errorstream.enableBuffering` to `true` unless you want to read the error streams from failed requests.
