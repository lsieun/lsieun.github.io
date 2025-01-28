---
title: "Service CMD"
sequence: "106"
---

The shorthand for `services` is `svc`.

```text
kubectl get services
```

```text
$ kubectl get svc -o wide
```

```text
kubectl describe svc
```

Changing the service's label selector

```text
$ kubectl set selector service quiz app=quiz
```

Changing the ports exposed by the service

```text
kubectl edit svc <service-name>
```

```text
kubectl port-forward svc/my-service
```
