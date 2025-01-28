---
title: "HPA"
sequence: "hpa"
---

通过观察 pod 的 cpu、内存使用率或自定义 metrics 指标进行自动的扩容和缩容 pod 的数量。

通常用于 Deployment，不适用于无法扩/缩容的对象，如 DaemonSet

控制管理器每隔 30 秒（可以通过 -horizontal-pod-autoscaler-sync-period 修改）查询 metrics 的资源使用情况

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deploy
  namespace: default
  labels:
    app: nginx-deploy
spec:
  replicas: 1
  revisionHistoryLimit: 10
  selector:
    matchLabels:
      app: nginx-deploy
  strategy:
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 25%
    type: RollingUpdate
  template:
    metadata:
      labels:
        app: nginx-deploy
    spec:
      containers:
        - name: nginx
          image: nginx:1.25.0-bullseye
          imagePullPolicy: IfNotPresent
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 200m
              memory: 128Mi
      restartPolicy: Always
      terminationGracePeriodSeconds: 30
```

```yaml
kubectl replace -f nginx-deploy.yaml
```

创建一个 HPA：

- 第 1 步，先准备好一个有做资源限制的 Deployment
- 第 2 步，执行命令 `kubectl autoscale deployments <deploy name> --cpu-percent=20 --min=2 --max=5`
- 第 3 步，通过 `kubectl get hpa` 可以获取 HPA 信息

测试：找到对应的服务的 service，编写循环测试脚本提升内存与 CPU 负载：


```text
$ kubectl autoscale deployments nginx-deploy --cpu-percent=20 --min=2 --max=5
```

```text
while true; do wget -q -O- http://<ip:port> > /dev/null; done
```

下载 metrics-server 组件配置文件：

```text
wget https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml -O metrics-server-components.yaml
```

```text
$ sed -i 's/registry.k8s.io\/metrics-server/registry.aliyuncs.com\/google_containers/g' metrics-server-components.yaml
```

修改容器的 tls 设置，不验证 tls，在 containers 的 args 参数中增加 `--kubelet-insecure-tls` 参数

```text
$ vi metrics-server-components.yaml
```

```yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    k8s-app: metrics-server
  name: metrics-server
  namespace: kube-system
spec:
  selector:
    matchLabels:
      k8s-app: metrics-server
  strategy:
    rollingUpdate:
      maxUnavailable: 0
  template:
    metadata:
      labels:
        k8s-app: metrics-server
    spec:
      containers:
      - args:
        - --cert-dir=/tmp
        - --secure-port=4443
        - --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname
        - --kubelet-use-node-status-port
        - --metric-resolution=15s
        - --kubelet-insecure-tls      # 注意：这里添加了参数
        image: registry.aliyuncs.com/google_containers/metrics-server:v0.6.3
        imagePullPolicy: IfNotPresent
```

```text
kubectl apply -f metrics-server-components.yaml
```

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-svc
  labels:
    app: nginx
spec:
  selector:
    app: nginx-deploy
  ports:
    - name: web
      port: 80
      targetPort: 80
  type: NodePort
```
