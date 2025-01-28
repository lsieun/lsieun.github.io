---
title: "Secret 使用：Docker Registry"
sequence: "106"
---

## docker-registry

```text
$ kubectl create secret docker-registry -h
Usage:
  kubectl create secret docker-registry NAME --docker-username=user --docker-password=password --docker-email=email
[--docker-server=string] [--from-file=[key=]source] [--dry-run=server|client|none] [options]
```

```text
$ kubectl create secret docker-registry my-docker-secret --docker-username="admin" --docker-password="123456" --docker-email="admin@example"
```

```text
$ kubectl get secret
NAME                    TYPE                             DATA   AGE
my-docker-secret        kubernetes.io/dockerconfigjson   1      8s
my-secret               Opaque                           2      10m
my-secret-with-hyphen   Opaque                           2      5m28s
```

```text
$ kubectl describe secret my-docker-secret
Name:         my-docker-secret
Namespace:    default
Labels:       <none>
Annotations:  <none>

Type:  kubernetes.io/dockerconfigjson

Data
====
.dockerconfigjson:  132 bytes
```

```text
$ kubectl edit secret my-docker-secret
```

```text
apiVersion: v1
data:
  .dockerconfigjson: eyJhdXRocyI6eyJodHRwczovL2luZGV4LmRvY2tlci5pby92MS8iOnsidXNlcm5hbWUiOiJhZG1pbiIsInBhc3N3b3JkIjoiMTIzNDU2IiwiZW1haWwiOiJhZG1pbkBleGFtcGxlIiwiYXV0aCI6IllXUnRhVzQ2TVRJek5EVTIifX19
kind: Secret
metadata:
  creationTimestamp: "2023-07-05T11:31:20Z"
  name: my-docker-secret
  namespace: default
  resourceVersion: "250345"
  uid: b22dd198-a896-45a1-8969-8c242425335e
type: kubernetes.io/dockerconfigjson
```

```text
$ echo "eyJhdXRocyI6eyJodHRwczovL2luZGV4LmRvY2tlci5pby92MS8iOnsidXNlcm5hbWUiOiJhZG1pbiIsInBhc3N3b3JkIjoiMTIzNDU2IiwiZW1haWwiOiJhZG1pbkBleGFtcGxlIiwiYXV0aCI6IllXUnRhVzQ2TVRJek5EVTIifX19" | base64 --decode
```

```json
{
  "auths": {
    "https://index.docker.io/v1/": {
      "username": "admin",
      "password": "123456",
      "email": "admin@example",
      "auth": "YWRtaW46MTIzNDU2"
    }
  }
}
```

```text
$ echo "YWRtaW46MTIzNDU2" | base64 --decode
admin:123456
```

```yaml
spec:
  imagePullSecrets:
    - name: harbor-secret
```

File: `my-centos-pod.yaml`

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-centos-pod
spec:
  imagePullSecrets:
    - name: my-docker-registry-secret
  restartPolicy: Never
  containers:
    - name: my-alpine-container
      image: docker.lan.net:8083/centos:centos7.9.2009
      imagePullPolicy: IfNotPresent
      command: [ "/bin/sh", "-c", "env; sleep 3600" ]
```

```text
$ kubectl create secret docker-registry my-docker-registry-secret --docker-username="admin" --docker-password="123456" --docker-email="admin@example" --docker-server=docker.lan.net:8083
```
