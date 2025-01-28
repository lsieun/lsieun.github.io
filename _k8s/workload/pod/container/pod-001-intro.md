---
title: "Pod Intro"
sequence: "101"
---

service 是把 Pod 暴露出来提供服务，它才是抽象的服务，也是一种资源

```text
mkdir pods && cd pods
```

```text
touch nginx-demo.yaml
```

- metadata
- spec
- status

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-demo
  labels:
    type: app
    version: 2023.06.27
  namespace: 'default'
spec:
  containers:
    - name: nginx
      image: nginx:1.7.9
      imagePullPolicy: IfNotPresent
      command:
        - nginx
        - -g
        - 'daemon off;' # nginx -g 'daemon off;'
      workingDir: /usr/share/nginx/html
      ports:
        - name: http
          containerPort: 80
          protocol: TCP
      env:
        name: JVM_OPTS
        value: '-Xms128m -Xmx128m'
      resources:
        requests:
          cpu: 100m
          memory: 128Mi
        limits:
          cpu: 200m
          memory: 256Mi
  restartPolicy: OnFailure
```

```text
kubectl create -f nginx-demo.yaml
kubectl describe pods nginx-demo
```

```text
route -n
```
