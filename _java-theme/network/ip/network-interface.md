---
title: "NetworkInterface"
sequence: "102"
---

## Using the `NetworkInterface` class

The `NetworkInterface` class represents an IP address and provides information about this IP address.
A **network interface** is the point of connection between a computer and a network.

The `NetworkInterface` class does not have any public constructors. Three static methods are provided to return an instance of the NetworkInterface class:

- `getByInetAddress`: This is used if the IP address is known
- `getByName`: This is used if the interface name is known
- `getNetworkInterfaces`: This provides an enumeration of available interfaces

The following code illustrates how to use the `getNetworkInterfaces` method to obtain and display an enumeration of the network interfaces for the current computer:

```java

```

**Each network interface** will have **one or more IP addresses** associated with it. The `getInetAddresses` method will return **an Enumeration of these addresses**.


## Getting a MAC address

Theoretically, all NICs, regardless of their
location, will have a unique MAC address. A MAC address consists of 48 bits that are
usually written in groups of six pairs of hexadecimal digits. These groups are separated by
either a dash or a colon.



