---
title: "ConfigMap 使用：环境变量"
sequence: "104"
---

## 示例一：环境变量

```text
$ kubectl create configmap my-config-env --from-literal=JAVA_OPTS_IN_CONFIG_MAP='-Xms512m -Xmx512m' --from-literal=APP_NAME=my-spring-app
```

File: `my-alpine-env-pod.yaml`

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-alpine-env-pod
spec:
  restartPolicy: Never
  containers:
    - name: my-alpine-container
      image: alpine:3.18.0
      imagePullPolicy: IfNotPresent
      env:
        - name: JAVA_OPTS_IN_POD
          valueFrom:
            configMapKeyRef:
              name: my-config-env
              key: JAVA_OPTS_IN_CONFIG_MAP
        - name: APP
          valueFrom:
            configMapKeyRef:
              name: my-config-env
              key: APP_NAME
      command: [ "/bin/sh", "-c", "env; sleep 3600" ]
```

```text
$ kubectl create -f my-alpine-pod.yaml
```

```text
$ kubectl logs -f my-alpine-pod
...
JAVA_OPTS_IN_POD=-Xms512m -Xmx512m
APP=my-spring-app
...
```

## 示例二

```text
$ kubectl create cm cm-mysql --from-literal=RANDOM_PASSWORD=yes
```

```text
$ kubectl describe cm cm-mysql 
Name:         cm-mysql
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
RANDOM_PASSWORD:
----
yes

BinaryData
====

Events:  <none>
```

部署 MySQL 节点，利用 `valueFrom.configMapKeyRef` 完成 `cm-mysql.RANDOM_PASSWORD` 与 
`mysql` 容器 `MYSQL_RANDOM_ROOT_PASSWORD` 环境变量的绑定

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: deploy-mysql
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mysql
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
        - name: mysql
          image: mysql:8.0.33
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 3306
          env:
            - name: MYSQL_RANDOM_ROOT_PASSWORD
              valueFrom:
                configMapKeyRef:
                  name: cm-mysql
                  key: RANDOM_PASSWORD
```

```text
$ kubectl apply -f deploy-mysql.yml
```

验证是否随机生成了 ROOT 密码

```text
$ kubectl get pods
NAME                            READY   STATUS    RESTARTS   AGE
deploy-mysql-5c6759c5bd-wcsnj   1/1     Running   0          39s

$ kubectl logs pods/deploy-mysql-5c6759c5bd-wcsnj | grep GENERATED
2023-08-22 00:52:23+00:00 [Note] [Entrypoint]: GENERATED ROOT PASSWORD: FMknuuTvG7bUMZjpw9+7ebR2HkYToMV8
```

