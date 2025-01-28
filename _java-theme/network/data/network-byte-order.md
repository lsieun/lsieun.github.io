---
title: "Network byte order"
sequence: "102"
---

In the open environment of TCP/IP, IP addresses must be defined in terms of the architecture of the machines.
Some machine architectures, such as IBM® mainframes, define the lowest memory address to be the high-order bit, which is called **big endian**.
However, other architectures, such as IBM PCs, define the lowest memory address to be the low-order bit, which is called **little endian**.

**Network addresses in a given network must all follow a consistent addressing convention.**
This convention, known as **network byte order**, defines the bit-order of network addresses as they pass through the network.
**The TCP/IP standard network byte order is big-endian**.
In order to participate in a TCP/IP network, little-endian systems usually bear the burden of conversion to network byte order.

Note: The socket interface does not handle application data bit-order differences. Application writers must handle these bit order differences themselves.

## References

- [Network byte order](https://www.ibm.com/docs/en/zos/2.4.0?topic=hosts-network-byte-order)
