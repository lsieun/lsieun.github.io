---
title: "Pod From Commandline"
sequence: "101"
---

## dry-run

```text
$ kubectl run kiada --image=lsieun/kiada:0.1 --dry-run=client -o yaml > mypod.yaml
```

The `--dry-run=client` flag tells kubectl to output the definition instead of actually creating the object via the API.

```text
$ cat mypod.yaml 
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    run: kiada
  name: kiada
spec:
  containers:
  - image: lsieun/kiada:0.1
    name: kiada
    resources: {}
  dnsPolicy: ClusterFirst
  restartPolicy: Always
status: {}
```
