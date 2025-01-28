---
title: "Workload Intro"
sequence: "101"
---

## 概念

### workload

A workload is an application running on Kubernetes.

> workload 是什么

### pod

Whether your workload is a single component or several that work together, on Kubernetes you run it inside a set of pods.
In Kubernetes, a Pod represents a set of running containers on your cluster.

```text
workload 是一个抽象的概念，它具体是由 Pod 来实现的。
```

### workload resources

However, to make life considerably easier, you don't need to manage each Pod directly.
Instead, you can use **workload resources** that manage a set of pods on your behalf.
These resources configure controllers
that make sure the right number of the right kind of pod are running, to match the state you specified.

```text
workload resources = manage a set of pods on your behalf
```

## Workload Resources

### Built-in Workload Resources

Kubernetes provides several built-in workload resources:

- `Deployment` and `ReplicaSet` (replacing the legacy resource `ReplicationController`).
  Deployment is a good fit for managing a **stateless application workload** on your cluster,
  where any Pod in the Deployment is interchangeable and can be replaced if needed.
- `StatefulSet` lets you run one or more related Pods that do track state somehow.
  For example, if your workload records data persistently,
  you can run a `StatefulSet` that matches each Pod with a `PersistentVolume`.
  Your code, running in the Pods for that StatefulSet,
  can replicate data to other Pods in the same StatefulSet to improve overall resilience.
- `DaemonSet` defines Pods that provide facilities that are local to nodes.
  Every time you add a node to your cluster that matches the specification in a DaemonSet,
  the control plane schedules a Pod for that DaemonSet onto the new node.
  Each pod in a DaemonSet performs a job similar to a system daemon on a classic Unix/POSIX server.
  A DaemonSet might be fundamental to the operation of your cluster, such as a plugin to run cluster networking,
  it might help you to manage the node, or it could provide optional behavior
  that enhances the container platform you are running.
- `Job` and `CronJob` provide different ways to define tasks that run to completion and then stop.
  You can use a `Job` to define a task that runs to completion, just once.
  You can use a `CronJob` to run the same Job multiple times according a schedule.

### Third-party Workload Resources

In the wider Kubernetes ecosystem, you can find **third-party workload resources** that provide additional behaviors.
Using a custom resource definition,
you can add in a third-party workload resource if you want a specific behavior that's not part of Kubernetes' core.

## Reference

- [Workloads](https://kubernetes.io/docs/concepts/workloads/)
