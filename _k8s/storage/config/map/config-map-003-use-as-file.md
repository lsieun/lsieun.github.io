---
title: "ConfigMap 使用：文件"
sequence: "103"
---

### Kubernetes ConfigMap 类型

Kubernetes ConfigMap 可以作为其中之一来考虑和使用

- FileSystem Object - 可以挂载 configmap，每个键将被创建为具有相应值作为内容的文件
- Environment variable - 要动态传递给容器的键和值对
- Commandline Argument - 您可以更改容器命令行参数的默认值

## 示例一

### 方式一：YAML 创建

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: cm-nginx
data:
  nginx.conf: |
    # lsieun
    user  nginx;
    worker_processes  1;

    error_log  /var/log/nginx/error.log warn;
    pid        /var/run/nginx.pid;


    events {
        worker_connections  1024;
    }


    http {
        include       /etc/nginx/mime.types;
        default_type  application/octet-stream;

        log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                          '$status $body_bytes_sent "$http_referer" '
                          '"$http_user_agent" "$http_x_forwarded_for"';

        access_log  /var/log/nginx/access.log  main;

        sendfile        on;
        #tcp_nopush     on;


        keepalive_timeout  65;

        #gzip  on;

        include /etc/nginx/conf.d/*.conf;
    }
```

```text
$ kubectl apply -f cm-nginx.yaml
$ kubectl get cm
$ kubectl describe cm cm-nginx
```

### 方式二：指定文件创建

```text
# lsieun
user  nginx;
worker_processes  1;

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;


    keepalive_timeout  65;

    #gzip  on;

    include /etc/nginx/conf.d/*.conf;
}
```

```text
$ kubectl create cm cm-nginx --from-file /etc/k8s/nginx/nginx.conf
```

### Pod 以文件方式挂载 ConfigMap

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: deploy-nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:1.25.0-bullseye
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 80
          volumeMounts:
            - name: vol-nginx
              mountPath: /etc/nginx/nginx.conf
              subPath: nginx.conf
      volumes:
        - name: vol-nginx
          configMap:
            name: cm-nginx
            items:
              - key: nginx.conf
                path: nginx.conf
```

```text
$ kubectl apply -f deploy-nginx.yaml
```

```text
$ kubectl get pods
NAME                            READY   STATUS    RESTARTS   AGE
deploy-nginx-7b9ff878c4-jsm5n   1/1     Running   0          6s
deploy-nginx-7b9ff878c4-nvn7s   1/1     Running   0          6s
deploy-nginx-7b9ff878c4-vqngq   1/1     Running   0          6s
```

```text
$ kubectl exec --stdin --tty deploy-nginx-7b9ff878c4-jsm5n -- /bin/bash
root@deploy-nginx-7b9ff878c4-jsm5n:/# cat /etc/nginx/nginx.conf 
# lsieun
user  nginx;
worker_processes  1;
```

## 示例二：ConfigMap 映射成 Volume

File: `my-alpine-volume-pod.yaml`

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-alpine-volume-pod
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
      volumeMounts:
        - name: db-config
          mountPath: "/usr/local/mysql/config"
          readOnly: true
  volumes:
    - name: db-config               # 数据卷的名字，任意设置
      configMap:                    # 数据卷类型为 ConfigMap
        name: my-config-from-dir    # ConfigMap 的名字
        items:
          - key: "db.properties"    # ConfigMap 中的 key
            path: "abc.properties"   # 将该 key 的值转换为文件
```

```text
$ kubectl exec -it my-alpine-volume-pod -- sh
/ # cd /usr/local/mysql/config/
/usr/local/mysql/config # ls
abc.properties
/usr/local/mysql/config # cat abc.properties 
username=tomcat
password=123456
```

File: `my-alpine-volume-2-pod.yaml`

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-alpine-volume-2-pod
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
      volumeMounts:
        - name: db-config
          mountPath: "/usr/local/mysql/config"
          readOnly: true
  volumes:
    - name: db-config               # 数据卷的名字，任意设置
      configMap:                    # 数据卷类型为 ConfigMap
        name: my-config-from-dir    # ConfigMap 的名字
```

```text
$ kubectl create -f my-alpine-volume-2-pod.yaml
```

```text
$ kubectl exec -it my-alpine-volume-2-pod -- /bin/sh
/ # cd /usr/local/mysql/config/
/usr/local/mysql/config # ls
db.properties     redis.properties
```
