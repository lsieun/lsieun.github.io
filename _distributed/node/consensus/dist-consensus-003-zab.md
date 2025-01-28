---
title: "ZAB"
sequence: "103"
---

ZooKeeper's Atomic Broadcast (ZAB) is integral to the operation of Apache Zookeeper,
a service offering distributed synchronization.
ZAB makes sure that all changes (writes) to the system state
get reliably disseminated to all nodes in the order they were received,
ensuring system-wide consistency.

ZAB operates in two primary modes: recovery and broadcast.
The recovery mode deals with leader election and syncing replicas,
while the broadcast mode handles state updates.


