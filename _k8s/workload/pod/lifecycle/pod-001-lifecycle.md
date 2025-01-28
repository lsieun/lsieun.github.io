---
title: "Pod LifeCycle"
sequence: "101"
---

- 容器环境初始化
- Pod 生命周期
    - 初始化阶段（可能有多个初始化容器 InitC）

Pods follow a defined lifecycle, starting in the `Pending` phase,
moving through `Running` if at least one of its primary containers starts OK,
and then through either the `Succeeded` or `Failed` phases
depending on whether any container in the Pod terminated in failure.

```text
Pending --> Running --> Succeeded/Failed
```

In the Kubernetes API, Pods have both a **specification** and an **actual status**.

Pods are only scheduled once in their lifetime.
Once a Pod is scheduled (assigned) to a Node,
the Pod runs on that Node until it stops or is terminated.

> Pod 与 Node 的关系

## Pod Phase

- Pending
- Running
- Succeeded
- Failed
- Unknown

File: `pod.kiada.yaml`

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: kiada
spec:
  containers:
  - name: kiada
    image: lsieun/kiada:0.1
    imagePullPolicy: Always
    ports:
    - containerPort: 8080
```

```text
$ kubectl apply -f pod.kiada.yaml
pod/kiada created
```

```text
$ kubectl get po kiada -o yaml | grep phase
  phase: Pending
$ kubectl get po kiada -o yaml | grep phase
  phase: Running
```

```text
$ kubectl get pods kiada -o yaml | yq .status.phase
Running
```

```text
$ kubectl describe pods kiada
```

```text
$ kubectl get pods kiada -o json | jq .status.conditions
$ kubectl get pods kiada -o yaml | yq .status.conditions
```

## Container Status

- Waiting
- Running
- Terminated
- Unknown

### Regular Container Status

```text
$ kubectl describe pods kiada 
...
Containers:
  kiada:
    Container ID:   docker://247fa9b86572fc2d0fc5b45b3f010174887ce5cc0de3391b36467fa480010228
    Image:          lsieun/kiada:0.1
    Image ID:       docker-pullable://lsieun/kiada@sha256:52dacfa01cf767171ea60a1eaf8664bf4572af36ccab53cb1b9ba2efbff2a652
    Port:           8080/TCP
    Host Port:      0/TCP
    State:          Running                            ---> 状态 Running
      Started:      Mon, 07 Aug 2023 08:48:46 +0800    ---> 启动时间
    Ready:          True                               ---> Ready
    Restart Count:  0                                  ---> Restart
    Environment:    <none>
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from kube-api-access-qqlbq (ro)
...
```

```text
$ kubectl get pods kiada -o json | jq .status.containerStatuses
[
  {
    "containerID": "docker://247fa9b86572fc2d0fc5b45b3f010174887ce5cc0de3391b36467fa480010228",
    "image": "lsieun/kiada:0.1",
    "imageID": "docker-pullable://lsieun/kiada@sha256:52dacfa01cf767171ea60a1eaf8664bf4572af36ccab53cb1b9ba2efbff2a652",
    "lastState": {},
    "name": "kiada",
    "ready": true,
    "restartCount": 0,
    "started": true,
    "state": {
      "running": {
        "startedAt": "2023-08-07T00:48:46Z"
      }
    }
  }
]
```

```text
$ kubectl get pods kiada -o yaml | yq .status.containerStatuses
- containerID: docker://247fa9b86572fc2d0fc5b45b3f010174887ce5cc0de3391b36467fa480010228
  image: lsieun/kiada:0.1
  imageID: docker-pullable://lsieun/kiada@sha256:52dacfa01cf767171ea60a1eaf8664bf4572af36ccab53cb1b9ba2efbff2a652
  lastState: {}
  name: kiada
  ready: true
  restartCount: 0
  started: true
  state:
    running:
      startedAt: "2023-08-07T00:48:46Z"
```

### Init Container Status

As with **regular containers**,
the status of these containers is available in the `status` section of the **pod object manifest**,
but in the `initContainerStatuses` field.

File: `pod.kiada-init.yaml`

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: kiada-init
spec:
  initContainers:
  - name: init-demo
    image: lsieun/init-demo:0.1
  - name: network-check
    image: lsieun/network-connectivity-checker:0.1
  containers:
  - name: kiada
    image: lsieun/kiada:0.2
    stdin: true
    ports:
    - name: http
      containerPort: 8080
  - name: envoy
    image: lsieun/kiada-ssl-proxy:0.1
    ports:
    - name: https
      containerPort: 8443
    - name: admin
      containerPort: 9901
```

## Reference

- [Pod Lifecycle](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/)
- [Pod 的生命周期](https://kubernetes.io/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/)
