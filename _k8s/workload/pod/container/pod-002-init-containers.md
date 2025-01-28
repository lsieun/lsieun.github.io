---
title: "Init Containers"
sequence: "102"
---

When a pod contains more than one container, all the containers are started **in parallel**.
Kubernetes doesn't yet provide a mechanism to specify
whether a container depends on another container,
which would allow you to ensure that one is started before the other.
However, Kubernetes allows you to run a sequence of containers to initialize the pod before its main containers start.

## Init Containers

A pod manifest can specify a list of containers to run when the pod starts and
before the pod's normal containers are started.
These containers are intended to initialize the pod and are appropriately called **init containers**.


**Init containers** are like the pod's **regular containers**,
but **they don't run in parallel** - **only one init container runs at a time.**

| Init Containers                        | Regular Containers |
|----------------------------------------|--------------------|
| only one init container runs at a time | in parallel        |

## Understanding what init containers can do

File: `pod.kiada-init.yaml`

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: kiada-init
spec:
  initContainers:
  - name: init-demo
    image: lsieun/init-demo:0.1
  - name: network-check
    image: lsieun/network-connectivity-checker:0.1
  containers:
  - name: kiada
    image: lsieun/kiada:0.2
    stdin: true
    ports:
    - name: http
      containerPort: 8080
  - name: envoy
    image: lsieun/kiada-ssl-proxy:0.1
    ports:
    - name: https
      containerPort: 8443
    - name: admin
      containerPort: 9901
```

## Inspecting init containers
