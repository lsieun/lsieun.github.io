---
title: "No Longer CPU Bound"
sequence: "101"
---

[UP](/java-nio.html)


To some extent, Java programmers can be forgiven for their preoccupation with optimizing processing efficiency and
not paying much attention to I/O considerations.
In the early days of Java, the JVMs interpreted bytecodes with little or no runtime optimization.
This meant that Java programs tended to poke along, running significantly slower than natively compiled code and
not putting much demand on the I/O subsystems of the operating system.

> poke along: 缓慢进行 to move slowly, especially when others are moving faster

But tremendous strides have been made in runtime optimization.
Current JVMs run bytecode at speeds approaching that of natively compiled code,
sometimes doing even better because of dynamic runtime optimizations.
This means that most Java applications are no longer CPU bound (spending most of their time executing code) and
are more frequently I/O bound (waiting for data transfers).

But in most cases, Java applications have not truly been I/O bound in the sense
that the operating system couldn't shuttle data fast enough to keep them busy.
Instead, the JVMs have not been doing I/O efficiently.
**There's an impedance mismatch between the operating system and the Java stream-based I/O model.**
**The operating system wants to move data in large chunks** (buffers), often with the assistance of hardware Direct Memory Access (DMA).
**The I/O classes of the JVM like to operate on small pieces** — single bytes, or lines of text.
This means that the operating system delivers buffers full of data
that the stream classes of `java.io` spend a lot of time breaking down into little pieces,
often copying each piece between several layers of objects.
The operating system wants to deliver data by the truckload.
The `java.io` classes want to process data by the shovelful.
NIO makes it easier to back the truck right up to where you can make direct use of the data (a `ByteBuffer` object).

This is not to say that it was impossible to move large amounts of data with the traditional I/O model — it certainly was (and still is).
The `RandomAccessFile` class in particular can be quite efficient if you stick to the array-based `read()` and `write()` methods.
Even those methods entail at least one buffer copy, but are pretty close to the underlying operating-system calls.
