---
title: "Network Intro"
sequence: "101"
---

A **network** is a collection of computers and other devices that can send data to and receive data from one another,
more or less in real time.

> 关键词：network

Each machine on a network is called a **node**.
Most nodes are computers,
but printers, routers, bridges, gateways, dumb terminals, and Coca-Cola machines can also be nodes.
Nodes that are fully functional computers are also called **hosts**.
I will use the word **node** to refer to any device on the network,
and the word **host** to refer to a node that is a general-purpose computer.

> node vs host

Every network node has an **address**, a sequence of bytes that uniquely identifies it.
You can think of this group of bytes as a number.
The more bytes there are in each address,
the more addresses there are available and the more devices that can be connected to the network simultaneously.

> node ---> address

All modern computer networks are **packet-switched networks**:
data traveling on the network is broken into chunks called **packets** and each packet is handled separately.
Each packet contains information about who sent it and where it's going.
**The most important advantage** of breaking data into individually addressed packets is that
packets from many ongoing exchanges can travel on one wire, which makes it much cheaper to build a network:
many computers can share the same wire without interfering.
**Another advantage of packets** is that checksums can be used to detect
whether a packet was damaged in transit.<sub>关键词：packets</sub>

> data ---> packet-switched networks

We're still missing one important piece: some notion of what computers need to say to pass data back and forth.
A **protocol** is a precise set of rules defining how computers communicate:
the format of addresses, how data is split into packets, and so on.
There are many different protocols defining different aspects of network communication.
For example, the Hypertext Transfer Protocol (HTTP) defines how web browsers and servers communicate.
A web server doesn't care whether the client is a Unix workstation, an Android phone, or an iPad,
because all clients speak the same HTTP protocol regardless of platform.

> data ---> protocol: address + packet

## The Layers of a Network

Sending data across a network is a complex operation
that must be carefully tuned to **the physical characteristics of the network** as well as
**the logical character of the data being sent**.
