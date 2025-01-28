---
title: "Secret 使用：文件"
sequence: "105"
---

File: `config.yaml`

```text
apiUrl: "https://my.api.com/api/v1"
username: admin
password: zo23@abc.c0m
```

```text
https://tool.lu/encdec/
```

Base64

```text
YXBpVXJsOiAiaHR0cHM6Ly9teS5hcGkuY29tL2FwaS92MSINCnVzZXJuYW1lOiBhZG1pbg0KcGFzc3dvcmQ6IHpvMjNAYWJjLmMwbQ==
```

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  config.yaml: YXBpVXJsOiAiaHR0cHM6Ly9teS5hcGkuY29tL2FwaS92MSINCnVzZXJuYW1lOiBhZG1pbg0KcGFzc3dvcmQ6IHpvMjNAYWJjLmMwbQ==
```

```text
kubectl apply -f secret.yaml
```

```text
$ kubectl get secrets 
NAME       TYPE     DATA   AGE
mysecret   Opaque   1      8s

$ kubectl describe secrets mysecret 
Name:         mysecret
Namespace:    default
Labels:       <none>
Annotations:  <none>

Type:  Opaque

Data
====
config.yaml:  76 bytes
```

文件方式挂载

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secret-test-pod
spec:
  containers:
    - name: test-container
      image: nginx:1.25.0-bullseye
      volumeMounts:
        # name 必须与下面的卷名匹配
        - name: secret-volume
          mountPath: /etc/secret-volume
          readOnly: true
  # Secret 数据通过一个卷暴露给该 Pod 中的容器
  volumes:
    - name: secret-volume
      secret:
        secretName: mysecret
```

```text
kubectl apply -f secret-test-pod.yaml
```

```text
$ kubectl exec secret-test-pod -- ls /etc/secret-volume
config.yaml

$ kubectl exec secret-test-pod -- cat /etc/secret-volume/config.yaml
apiUrl: "https://my.api.com/api/v1"
username: admin
password: zo23@abc.c0m
```
