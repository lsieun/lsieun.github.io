---
title: "TCP + UDP"
sequence: "105"
---

`UDP` and `TCP` are used by many applications. IP supports both of these protocols. The IP protocol transfers packets of information between nodes on a network. Java supports both the IPv4 and IPv6 protocol versions.


Both `UDP` and `TCP` are layered on top of `IP`. Several other protocols are layered on top of TCP, such as HTTP. These relationships are shown in this following figure:


The `IP` address assigned to a device may be either **static** or **dynamic**. If it is static, it will not change each time the device is rebooted. With dynamic addresses, the address may change each time the device is rebooted or when a network connection is reset.

**Static addresses** are normally manually assigned by an administrator. **Dynamic addresses** are frequently assigned using the **Dynamic Host Configuration Protocol (DHCP)** running from a DHCP server. With IPv6, DHCP is not as useful due to the large IPv6 address space. However, DHCP is useful for tasks, such as supporting the generation of random addresses, which introduce more privacy within a network when viewed from outside of the network.
