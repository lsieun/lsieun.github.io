---
title: "Secret 使用：环境变量"
sequence: "104"
---

```text
USERNAME=admin
PASSWORD=zo23@abc.c0m  --> Base64: em8yM0BhYmMuYzBt
```

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
stringData:
  USERNAME: admin
data:
  PASSWORD: em8yM0BhYmMuYzBt
```

```text
kubectl apply -f secret.yaml
```

```text
$ kubectl get secrets 
NAME       TYPE     DATA   AGE
mysecret   Opaque   2      8s

$ kubectl describe secrets mysecret 
Name:         mysecret
Namespace:    default
Labels:       <none>
Annotations:  <none>

Type:  Opaque

Data
====
USERNAME:  5 bytes
PASSWORD:  12 bytes
```

环境变量方式

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secret-test-pod
spec:
  containers:
    - name: test-container
      image: busybox:latest
      command: [ "/bin/sh", "-c", "env" ]
      envFrom:
        - secretRef:
            name: mysecret
  restartPolicy: Never
```

```text
kubectl apply -f secret-test-pod.yaml
```

```text
$ kubectl get pods
NAME              READY   STATUS      RESTARTS   AGE
secret-test-pod   0/1     Completed   0          5s

$ kubectl logs pods/secret-test-pod 
KUBERNETES_SERVICE_PORT=443
KUBERNETES_PORT=tcp://10.96.0.1:443
HOSTNAME=secret-test-pod
SHLVL=1
HOME=/root
USERNAME=admin    # A
KUBERNETES_PORT_443_TCP_ADDR=10.96.0.1
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
KUBERNETES_PORT_443_TCP_PORT=443
KUBERNETES_PORT_443_TCP_PROTO=tcp
KUBERNETES_SERVICE_PORT_HTTPS=443
KUBERNETES_PORT_443_TCP=tcp://10.96.0.1:443
KUBERNETES_SERVICE_HOST=10.96.0.1
PWD=/
PASSWORD=zo23@abc.c0m    # B
```

Secret 并不安全

```text
$ kubectl get secrets mysecret -o yaml
apiVersion: v1
data:
  PASSWORD: em8yM0BhYmMuYzBt
  USERNAME: YWRtaW4=
kind: Secret
metadata:
  annotations:
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"v1","data":{"PASSWORD":"em8yM0BhYmMuYzBt"},"kind":"Secret","metadata":{"annotations":{},"name":"mysecret","namespace":"default"},"stringData":{"USERNAME":"admin"},"type":"Opaque"}
  creationTimestamp: "2023-08-22T12:01:04Z"
  name: mysecret
  namespace: default
  resourceVersion: "29802"
  uid: 1cffd104-f595-487f-a2aa-bc6b96d400cd
type: Opaque
```
