---
title: "VM vs. Container"
sequence: "112"
---


## Understanding what enables containers and what enables virtual machines

While **virtual machines** are enabled through **virtualization support in the CPU** and
by **virtualization software on the host**,
**containers** are enabled by the **Linux kernel** itself.

Docker was the first container platform to make containers mainstream.
I hope I've made it clear that **Docker itself doesn't provide process isolation.**
**The actual isolation of containers takes place at the Linux kernel level using the mechanisms it provides.
Docker just makes it easy to use these mechanisms and allows you to distribute container images to different hosts.**

