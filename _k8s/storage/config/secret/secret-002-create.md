---
title: "Secret 创建"
sequence: "102"
---

```text
$ kubectl create secret -h
Create a secret using specified subcommand.

Available Commands:
  docker-registry   Create a secret for use with a Docker registry
  generic           Create a secret from a local file, directory, or literal value
  tls               Create a TLS secret

Usage:
  kubectl create secret [flags] [options]
```

## 示例

### generic

```text
$ kubectl create secret generic my-secret --from-literal=username=tomcat --from-literal=password=123456
```

```text
$ kubectl get secret
NAME        TYPE     DATA   AGE
my-secret   Opaque   2      5s
```

```text
$ kubectl describe secret my-secret
Name:         my-secret
Namespace:    default
Labels:       <none>
Annotations:  <none>

Type:  Opaque

Data
====
password:  6 bytes
username:  6 bytes
```

```text
$ kubectl create secret generic my-secret-with-hyphen --from-literal=username="my-name" --from-literal=password="my-pass"
```
