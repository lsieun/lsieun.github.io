---
title: "Pod Cmd"
sequence: "101"
---

## apply

```text
$ kubectl apply -f nginx-pod.yaml
```

## 查看信息

### get

```text
$ kubectl get pods
$ kubectl get pods -o wide
$ kubectl get pods -A
$ kubectl get pods -A -o wide
```

```text
$ kubectl get pods -o wide --show-labels
```

Retrieving the full manifest of a running pod

```text
$ kubectl get pods kiada -o yaml
```

### describe

```text
$ kubectl describe pods nginx-pod
```

## 停止

```text
$ kubectl exec quote-001 -c nginx -- kill 1
```

## 删除

### delete

```text
$ kubectl delete -f nginx-pod.yaml
```

## explain

```text
$ kubectl explain pods
```

## exec

```text
$ kubectl exec <pod-name> -- ps x
```

## Node

```text
$ kubectl get nodes
$ kubectl get nodes -o wide
```

## Filtering Pods by Node

```text
$ kubectl get pods --field-selector spec.nodeName=node1
$ kubectl get pods --field-selector spec.nodeName=node1 -o wide
```
