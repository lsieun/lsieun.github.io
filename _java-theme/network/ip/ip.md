---
title: "IP"
sequence: "101"
---

## 0.0.0.0

The address `0.0.0.0` always refers to the originating host, but may only be used as a source address, not a destination.
Similarly, any IPv4 address that begins with `0`.
(eight zero bits) is assumed to refer to a host on the same local network.

## 255.255.255.255

The IPv4 address that uses the same number for each of the four bytes (i.e., `255.255.255.255`), is a broadcast address.
Packets sent to this address are received by all nodes on the local network,
though they are not routed beyond the local network.

This is commonly used for discovery.
For instance, when an ephemeral client such as a laptop boots up,
it will send a particular message to `255.255.255.255` to find the local DHCP server.
All nodes on the network receive the packet, but only the DHCP server responds.
In particular, it sends the laptop information about the local network configuration,
including the IP address that laptop should use for the remainder of its session and
the address of a DNS server it can use to resolve hostnames.

## Local Loopback Address

**Local Loopback Address** is used to let a system send a message to itself to make sure that
TCP/IP stack is installed correctly on the machine.

In IPv4, IP addresses that start with decimal `127` or that has `01111111` in the first octet
are loopback addresses(`127.X.X.X`).
Typically `127.0.0.1` is used as the local loopback address.
This leads to the wastage of many potential IP addresses.

But in IPv6 `::1` is used as local loopback address and therefore there isn't any wastage of addresses.
