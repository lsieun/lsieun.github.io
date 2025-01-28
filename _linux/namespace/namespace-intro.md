---
title: "Namespace"
sequence: "101"
---

[UP](/linux.html)


## Intro

Initially, all the system resources available in a Linux OS,
such as filesystems, process IDs, user IDs, network interfaces, and others,
are all in the same bucket that all processes see and use.
But the Kernel allows you to create additional buckets known as **namespaces** and
move resources into them so that they are organized in smaller sets.
This allows you to make each set visible only to one process or a group of processes.
When you create a new process, you can specify which namespace it should use.
The process only sees resources that are in this namespace and none in the other namespaces.

## Namespace Types

More specifically, there isn't just a single type of namespace.
There are in fact several types – one for each resource type.
A process thus uses not only one namespace, but one namespace for each type.

The following types of namespaces exist:

- The Mount namespace (mnt) isolates mount points (file systems).
- The Process ID namespace (pid) isolates process IDs.
- The Network namespace (net) isolates network devices, stacks, ports, etc.
- The Inter-process communication namespace (ipc) isolates the communication between processes
  (this includes isolating message queues, shared memory, and others).
- The UNIX Time-sharing System (UTS) namespace isolates
  the system hostname and the Network Information Service (NIS) domain name.
- The User ID namespace (user) isolates user and group IDs.
- The Time namespace allows each container to have its own offset to the system clocks.
- The Cgroup namespace isolates the Control Groups root directory.

### network namespaces

Using network namespaces to give a process a dedicated set of network interfaces

The network namespace in which a process runs determines what network interfaces the process can see.
Each network interface belongs to exactly one namespace
but can be moved from one namespace to another.
If each container uses its own network namespace,
each container sees its own set of network interfaces.

### UTS namespace

Using the UTS namespace to give a process a dedicated hostname
