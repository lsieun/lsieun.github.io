---
title: "Components"
sequence: "102"
---

![](/assets/images/k8s/components-of-kubernetes.svg)

在 production environment，为了保证稳定性，应该最少两个 master node。

- API Server: Entrypoint to K8s Cluster
- Controller Manager: keeps track of what's happing in the cluster
- Scheduler: ensure Pods placement
- etcd: Kubernetes backing store

## API Server

## Controller Manager

## Scheduler

## etcd

## Control Plane Components

The control plane's components make global decisions about the cluster (for example, scheduling),
as well as detecting and responding to cluster events
(for example, starting up a new pod when a deployment's `replicas` field is unsatisfied).

Control plane components can be run on any machine in the cluster.
However, for simplicity, set up scripts typically start all control plane components on the same machine,
and do not run user containers on this machine.

### kube-apiserver

The API server is a component of the Kubernetes control plane that exposes the Kubernetes API.
The API server is the front end for the Kubernetes control plane.

The main implementation of a Kubernetes API server is `kube-apiserver`.
`kube-apiserver` is designed to scale horizontally - that is, it scales by deploying more instances.
You can run several instances of `kube-apiserver` and balance traffic between those instances.

### etcd

Consistent and highly-available key value store used as Kubernetes' backing store for all cluster data.

### kube-scheduler

Control plane component that watches for newly created Pods with no assigned node, and selects a node for them to run on.

### kube-controller-manager

Control plane component that runs controller processes.

Logically, each controller is a separate process, but to reduce complexity,
they are all compiled into a single binary and run in a single process.

Some types of these controllers are:

- Node controller: Responsible for noticing and responding when nodes go down.
- Job controller: Watches for Job objects that represent one-off tasks, then creates Pods to run those tasks to completion.
- EndpointSlice controller: Populates EndpointSlice objects (to provide a link between Services and Pods).
- ServiceAccount controller: Create default ServiceAccounts for new namespaces.

### cloud-controller-manager

A Kubernetes control plane component that embeds cloud-specific control logic.
The cloud controller manager lets you link your cluster into your cloud provider's API,
and separates out the components that interact with that cloud platform from components
that only interact with your cluster.

The `cloud-controller-manager` only runs controllers that are specific to your cloud provider.
If you are running Kubernetes on your own premises, or in a learning environment inside your own PC,
the cluster does not have a cloud controller manager.

As with the `kube-controller-manager`,
the `cloud-controller-manager` combines several logically independent control loops into a single binary
that you run as a single process.
You can scale horizontally (run more than one copy) to improve performance or to help tolerate failures.

The following controllers can have cloud provider dependencies:

- Node controller: For checking the cloud provider to determine if a node has been deleted in the cloud after it stops responding
- Route controller: For setting up routes in the underlying cloud infrastructure
- Service controller: For creating, updating and deleting cloud provider load balancers

## Node Components

Node components run on every node, maintaining running pods and providing the Kubernetes runtime environment.

### kubelet

An agent that runs on each node in the cluster. It makes sure that containers are running in a Pod.

**The kubelet takes a set of PodSpecs**
that are provided through various mechanisms and
**ensures that
the containers described in those PodSpecs are running and healthy.**

The kubelet doesn't manage containers which were not created by Kubernetes.

### kube-proxy

kube-proxy is a network proxy that runs on each node in your cluster,
implementing part of the Kubernetes Service concept.

kube-proxy maintains network rules on nodes.
These network rules allow network communication to your Pods from network sessions inside or outside your cluster.

kube-proxy uses the operating system packet filtering layer if there is one, and it's available.
Otherwise, kube-proxy forwards the traffic itself.

### Container runtime

The container runtime is the software that is responsible for running containers.

Kubernetes supports container runtimes such as containerd, CRI-O,
and any other implementation of the Kubernetes CRI (Container Runtime Interface).

## Addons

Addons use Kubernetes resources (DaemonSet, Deployment, etc) to implement cluster features.
Because these are providing cluster-level features,
namespaced resources for addons belong within the kube-system namespace.

### DNS

While the other addons are not strictly required,
**all Kubernetes clusters should have cluster DNS, as many examples rely on it.**

Cluster DNS is a DNS server, in addition to the other DNS server(s) in your environment,
which serves DNS records for Kubernetes services.

Containers started by Kubernetes automatically include this DNS server in their DNS searches.

### Web UI (Dashboard)

Dashboard is a general purpose, web-based UI for Kubernetes clusters.
It allows users to manage and troubleshoot applications running in the cluster, as well as the cluster itself.

### Container Resource Monitoring

Container Resource Monitoring records generic time-series metrics about containers in a central database,
and provides a UI for browsing that data.

### Cluster-level Logging

A cluster-level logging mechanism is responsible for saving container logs
to a central log store with search/browsing interface.

### Network Plugins

Network plugins are software components that implement the container network interface (CNI) specification.
They are responsible for allocating IP addresses to pods and
enabling them to communicate with each other within the cluster.

## Reference

- [Kubernetes Components](https://kubernetes.io/docs/concepts/overview/components/)

