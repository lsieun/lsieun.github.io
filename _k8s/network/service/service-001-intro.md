---
title: "Service Intro"
sequence: "101"
---

## 关系

Service、EndPoint 与 Pod 之间的关系：（它们是如何通信的）

```text
Service --> Endpoint --> iptables --> kube-proxy --> pause (Pod)
```

- Service: `10.96.0.0/16`
- EndPoint: `10.96.0.0/16` --> `10.244.0.0/16`
- Pod: `10.244.0.0/16`

在默认情况下，iptables 模式下的负载均衡策略为**随机选择**。

## Label 与松耦合

Service 与 Pod 之间是通过 Label 和 Label 筛选器（Selector） 松耦合在一起的。
Deployment 和 Pod 之间也是通过这种方式进行关联的。
这种松耦合方式是 Kubernetes 灵活性的关键。

## 配置

File: `svc-nginx.yaml`

```yaml
apiVersion: v1
kind: Service
metadata:
  name: svc-nginx
  labels:
    app: nginx
spec:
  type: NodePort
  selector:
    app: nginx-deploy
  ports:
    - name: web
      port: 80         # Service Port
      targetPort: 80   # Container Port

```

```text
$ kubectl get services nginx-svc
NAME        TYPE       CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE
nginx-svc   NodePort   10.102.250.218   <none>        80:30550/TCP   12m
```

```text
$ kubectl describe services nginx-svc
Name:                     nginx-svc
Namespace:                default
Labels:                   app=nginx
Annotations:              <none>
Selector:                 app=nginx-deploy
Type:                     NodePort
IP Family Policy:         SingleStack
IP Families:              IPv4
IP:                       10.102.250.218
IPs:                      10.102.250.218
Port:                     web  80/TCP                           # 这里是 Service 的端口
TargetPort:               80/TCP                                # 这里是 Pod 上的端口
NodePort:                 web  30550/TCP                        # 这里是 Node 上的端口
Endpoints:                10.244.167.211:80,10.244.203.37:80    # 注意：这里是 EndPoints
Session Affinity:         None
External Traffic Policy:  Cluster
Events:                   <none>
```

```text
$ kubectl get endpoints
NAME         ENDPOINTS                            AGE
kubernetes   192.168.80.131:6443                  3d19h
nginx-svc    10.244.167.211:80,10.244.203.37:80   10m
```

```text
$ kubectl describe endpoints nginx-svc
Name:         nginx-svc
Namespace:    default
Labels:       app=nginx
Annotations:  endpoints.kubernetes.io/last-change-trigger-time: 2023-07-04T07:52:23Z
Subsets:
  Addresses:          10.244.167.211,10.244.203.37
  NotReadyAddresses:  <none>
  Ports:
    Name  Port  Protocol
    ----  ----  --------
    web   80    TCP

Events:  <none>
```

```text
kubectl create -f nginx-svc.yaml
```

创建其他 Pod，通过 service name 进行访问（推荐）：



```text
$ kubectl run -it --image busybox dns-test --restart=Never --rm /bin/sh
```

```text
kubectl exec -it dns-test --sh
```

默认情况下，在当前 namespace 中访问。
如果需要跨 namespace 访问 pod，则在 serivce name 后面加上 `<namespace>` 即可：

```text
curl http://nginx-svc.default
```

## 常用类型

### NodePort

会在所有安装了 kube-proxy 的节点都绑定一个端口，此端口可以代理至对应的 Pod。

集群外部，可以使用任意节点 IP + NodePort 的端口号访问集中对应 Pod 中的服务。

端口范围：`30000`~`32767`

端口范围配置文件：（这一点，没有验证成功）

```text
/usr/lib/systemd/system/kube-apiserver.service
```

## 基于 Service 访问外部服务

代理 K8s 外部服务

- 各环境访问名称统一
- 访问 K8s 集群外的其他服务
- 项目迁移

实现方式：

- 编写 service 配置文件时，不指定 selector 属性
- 自己创建 endpoint

File: `nginx-svc-external.yaml`

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-svc-external
  labels:
    app: nginx
spec:
  ports:
    - name: web
      port: 80
      targetPort: 8001
  type: ClusterIP
```

endpoint 配置：

```yaml
apiVersion: v1
kind: Endpoints
metadata:
  name: nginx-svc-external
  namespace: default
  labels:
    app: nginx
subsets:
  - addresses:
      - ip: 192.168.80.1
    ports:
      - name: web
        port: 8081
        protocol: TCP
```

## 反向代理外部域名

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-external-domain
  labels:
    app: my-external-domain
spec:
  type: ExternalName
  externalName: www.baidu.com
```

```text
$ kubectl run mybox --image busybox --rm -it /bin/sh
```

## Reference

- [Service](https://kubernetes.io/docs/concepts/services-networking/service/)
