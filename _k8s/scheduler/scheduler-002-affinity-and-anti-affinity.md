---
title: "Affinity and Anti-Affinity"
sequence: "102"
---

Affinity 就是亲和性，这个部分分为 Node Affinity 和 Pod Affinity，下面给几个例子：

## Node Selector

还记得前面提过的 Label 吗？我们其实可以透过设置 `nodeSelector` 来达成 Node Affinity 的需求

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-nginx
spec:
  containers:
    - name: container-nginx
      image: nginx:latest
      ports:
        - containerPort: 80
  nodeSelector:
    disk: ssd
```

```text
kubectl apply -f pod-nginx.yaml
```

检查集群的 Node 状态，包含 Labels，处于 Pending 状态，describe 也提示无法匹配

```text
$ kubectl get pods
NAME        READY   STATUS    RESTARTS   AGE
pod-nginx   0/1     Pending   0          17s

$ kubectl describe pods pod-nginx 
Name:             pod-nginx
Namespace:        default
Priority:         0
Service Account:  default
Node:             <none>
Labels:           <none>
...
Node-Selectors:              disk=ssd    # A. 
Tolerations:                 node.kubernetes.io/not-ready:NoExecute op=Exists for 300s
                             node.kubernetes.io/unreachable:NoExecute op=Exists for 300s
Events:
  Type     Reason            Age   From               Message
  ----     ------            ----  ----               -------
  Warning  FailedScheduling  46s   default-scheduler  0/3 nodes are available:
           # B                                        1 node(s) had untolerated taint {node-role.kubernetes.io/control-plane: },
                                                      2 node(s) didn't match Pod's node affinity/selector. preemption:
                                                      0/3 nodes are available: 3 Preemption is not helpful for scheduling..
```

```text
$ kubectl get nodes --show-labels
```

这时我们新增一个 `disk=ssd` 的 `Label` 并检查

```text
$ kubectl label nodes worker01.k8s.lab disk=ssd
```

```text
$ kubectl get pods
NAME        READY   STATUS    RESTARTS   AGE
pod-nginx   1/1     Running   0          6m42s

$ kubectl get pods -o wide
NAME        READY   STATUS    RESTARTS   AGE     IP              NODE               NOMINATED NODE   READINESS GATES
pod-nginx   1/1     Running   0          7m55s   10.244.203.25   worker01.k8s.lab   <none>           <none>

$ kubectl get nodes --show-labels
```

又开始跑了，如果再度检查 describe 的讯息中的 Event 会发现：

```text

```

要删除标签，需要的 key 后面增加减号即可

```text
$ kubectl label node worker01.k8s.lab disk-
node/worker01.k8s.lab unlabeled
```

Pod 仍然在运行：

```text
$ kubectl get pods -o wide
NAME        READY   STATUS    RESTARTS   AGE   IP              NODE               NOMINATED NODE   READINESS GATES
pod-nginx   1/1     Running   0          12m   10.244.203.25   worker01.k8s.lab   <none>           <none>
```

## Node Affinity

这个部分我们就要把前一段的 Node Selector 抽换掉，把它改成 Node Affinity。

Node Affinity 和 Node Selector 不同的是，
它会有更多细緻的操作，你可以把 Node Selector 看成是简易版的 Node Affinity，
K8s 最早只有 Node Selector，Affinity 是后面的版本才加进来的。

nodeAffinity 有两种策略：
- preferredDuringSchedulingIgnoredDuringExecution：软策略，可以不满足，不会怎样
- requiredDuringSchedulingIgnoredDuringExecution：硬策略，一定要满足，不然就翻脸

新的 Pod 不允许部署在 Node0 上，在剩余节点中优先部署在 disk=ssd 的 Node 上

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-nginx
spec:
  containers:
    - name: container-nginx
      image: nginx:latest
      ports:
        - containerPort: 80
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
          - matchExpressions:
              - key: kubernetes.io/hostname
                operator: NotIn
                values:
                  - worker01.k8s.lab
      preferredDuringSchedulingIgnoredDuringExecution:
        - weight: 1
          preference:
            matchExpressions:
              - key: disk
                operator: In
                values:
                  - ssd
```

```text
kubectl apply -f pod-nginx.yaml
```

```text
$ kubectl get pods -o wide
NAME        READY   STATUS    RESTARTS   AGE   IP               NODE               NOMINATED NODE   READINESS GATES
pod-nginx   1/1     Running   0          9s    10.244.167.238   worker02.k8s.lab   <none>           <none>
```

关于 matchExpressions 的 key 有些系统本身自带的可以选择自行套用，可以参考下：

- kubernetes.io/hostname
- failure-domain.beta.kubernetes.io/zone
- failure-domain.beta.kubernetes.io/region
- beta.kubernetes.io/instance-type
- beta.kubernetes.io/os
- beta.kubernetes.io/arch

这些具体的值，可以查看 Node 的 Labels：

```text
$ kubectl get nodes --show-labels
```

接著我们看到了 operator，这个是操作符，一般会有这几种：
- In：Label 的值在某个列表中
- NotIn：Label 的值不在某个列表中
- Gt：Label 的值大于某个值
- Lt：Label 的值小于某个值
- Exists：某个 Label 存在
- DoesNotExist：某个 Label 不存在

再来是 `preferredDuringSchedulingIgnoredDuringExecution` 的部分，软性要求，
可以看到这裡有个 `weight`，那是权重的意思，1~100，越高代表越优先考虑这个条件，
最后是 `matchExpressions`，这边规定了要调度 Pod 到 node label 为 `disk=ssd` 的 Node 上。

## Pod Affinity

与节点亲和性类似，Pod 的亲和性与反亲和性也有两种类型：

- requiredDuringSchedulingIgnoredDuringExecution
- preferredDuringSchedulingIgnoredDuringExecution

例如，你可以使用 `requiredDuringSchedulingIgnoredDuringExecution` 亲和性来告诉调度器，
将两个服务的 Pod 放到同一个云提供商可用区内，因为它们彼此之间通信非常频繁。
类似地，你可以使用 `preferredDuringSchedulingIgnoredDuringExecution` 反亲和性来将同一服务的多个 Pod 分布到多个云提供商可用区中。

要使用 Pod 间亲和性，可以使用 Pod 规约中的 `.affinity.podAffinity` 字段。
对于 Pod 间反亲和性，可以使用 Pod 规约中的 `.affinity.podAntiAffinity` 字段。

这边我们新增一个 YAML

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: with-pod-affinity
spec:
  affinity:
    podAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        - labelSelector:
            matchExpressions:
              - key: security
                operator: In
                values:
                  - S1
          topologyKey: topology.kubernetes.io/zone
    podAntiAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
        - weight: 100
          podAffinityTerm:
            labelSelector:
              matchExpressions:
                - key: security
                  operator: In
                  values:
                    - S2
            topologyKey: topology.kubernetes.io/zone
  containers:
    - name: with-pod-affinity
      image: registry.k8s.io/pause:2.0
```






