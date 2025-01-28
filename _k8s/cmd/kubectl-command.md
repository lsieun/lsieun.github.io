---
title: "kubectl"
sequence: "kubectl"
---


![](/assets/images/k8s/kubectl-talks-only-to-the-api-server.png)

Kubectl is a single executable file that you must download to your computer and place into your path.
It loads its configuration from a configuration file called `kubeconfig`.
To use `kubectl`, you must both install it and prepare the `kubeconfig` file
so kubectl knows what cluster to talk to.

```text
$ which kubectl
/usr/bin/kubectl
```

The kubeconfig configuration file is located at `~/.kube/config`.

```text
$ cat ~/.kube/config 
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: XXX...
    server: https://master01.k8s.lab:6443
  name: kubernetes
contexts:
- context:
    cluster: kubernetes
    user: kubernetes-admin
  name: kubernetes-admin@kubernetes
current-context: kubernetes-admin@kubernetes
kind: Config
preferences: {}
users:
- name: kubernetes-admin
  user:
    client-certificate-data: XXX...
    client-key-data: XXX...
```

## 命令

- 命令行工具 kubectl
    - 自动补全
    - 资源操作
        - 创建对象
        - 显示和查找资源
        - 更新资源
        - 修补资源
        - 编辑资源
        - scale 资源
        - 删除资源
    - Pod 与集群
        - 与运行的 Pod 交互
        - 与节点和集群交互
    - 资源类型与别名
        - pods: po
        - deployments: deploy
        - services: svc
        - namespace: ns
        - nodes: no
    - 格式化输出
        - 输出 json 格式：`-o json`
        - 仅打印资源名称：`-o name`
        - 以纯文本格式输出所有信息：`-o wide`
        - 输出 yaml 格式：`-o yaml`

### Cluster

```text
$ kubectl cluster-info
Kubernetes control plane is running at https://master01.k8s.lab:6443
CoreDNS is running at https://master01.k8s.lab:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
```

### Node

```text
$ kubectl get nodes
NAME               STATUS   ROLES           AGE     VERSION
master01.k8s.lab   Ready    control-plane   2d12h   v1.27.3
worker01.k8s.lab   Ready    <none>          2d12h   v1.27.3
worker02.k8s.lab   Ready    <none>          2d12h   v1.27.3
```

```text
$ kubectl describe nodes master01.k8s.lab
```

### get

```text
$ kubectl get all
$ kubectl get all --all-namespaces
$ kubectl get all -A
```

Deployment

```text
$ kubectl get deployments
```

StatefulSet:

```text
$ kubectl get statefulset
$ kubectl get sts
```

PersistentVolumeClaim:

```text
$ kubectl get pvc
```

Show Labels:

```text
$ kubectl get pods --show-labels=true
```

DaemonSet:

```yaml
$ kubectl get daemonset
$ kubectl get ds
```

Endpoints

```text
$ kubectl get endpoints
$ kubectl get ep
```

Ingress

```text
$ kubectl get ingress
```

ConfigMap

```text
$ kubectl get configmap
```

Storage

```text
$ kubectl get pv
$ kubectl get pvc

$ kubectl get storageclass
$ kubectl get sc
```

ServiceAccount

```text
$ kubectl get serviceaccount
$ kubectl get sa
```

### namespace

```text
kubectl get ns
kubectl get namespace
```

```text
kubectl get nodes
```

```text
kubectl scale deploy --replicas=3 nginx
kubectl scale deploy --replicas=1 nginx
kubectl get deploy nginx -o yaml
```

```text
kubectl exec -it nginx-demo -c nginx -- cat /filename
kubectl cp started.html nginx-demo:/usr/share/nginx/html
```

### yaml

```text
$ kubectl get pods
NAME                     READY   STATUS      RESTARTS      AGE
kiada-846468789c-9v5pf   1/1     Running     1 (11h ago)   11h
kiada-846468789c-hbnxt   1/1     Running     1 (11h ago)   11h
kiada-846468789c-lmsfn   1/1     Running     1 (11h ago)   12h
```

```text
$ kubectl get pods kiada-846468789c-9v5pf -o yaml
```

```text
https://github.com/mikefarah/yq
```

```text
$ tar -zxvf yq_linux_amd64.tar.gz
$ sudo mv yq_linux_amd64 /usr/bin/yq
```

```text
$ kubectl get pods kiada-846468789c-9v5pf -o yaml | yq .spec.containers
$ kubectl get pods kiada-846468789c-9v5pf -o yaml | yq .status.conditions
```

### edit

```text
$ kubectl edit pods web-0
```

### delete

```text
kubectl delete deploy nginx-deploy
```

## describe

```text
kubectl describe node <node_name>
```

## label

```yaml
kubectl label node k8s-worker01 app=logging
```

```yaml
kubectl get pods -l app=logging
```

### rollout

```text
$ kubectl rollout status statefulset web
```

## run

Whenever you want to create a pod manifest from scratch,
you can also use the following command to create the file and then edit it to add more fields:

```text
$ kubectl run nginx-pod --image=nginx:1.25.0-bullseye --dry-run=client -o yaml > mypod.yaml
```

The `--dry-run=client` flag tells kubectl to output the definition instead of actually creating the object via the API.

## Proxy

```text
$ kubectl proxy 
Starting to serve on 127.0.0.1:8001
```

```text
$ curl http://127.0.0.1:8001/apis/apps/v1/deployments
```

```text
$ curl http://127.0.0.1:8001/api/v1/nodes/
$ curl http://127.0.0.1:8001/api/v1/nodes/master01.k8s.lab
$ curl http://127.0.0.1:8001/api/v1/nodes/worker01.k8s.lab
```

## api-resources

您可以使用以下命令来获取所有可用的 Kubernetes 资源类型：

```
$ kubectl api-resources
NAME                              SHORTNAMES    APIVERSION   NAMESPACED   KIND
configmaps                        cm            v1           true         ConfigMap
endpoints                         ep            v1           true         Endpoints
events                            ev            v1           true         Event
namespaces                        ns            v1           false        Namespace
nodes                             no            v1           false        Node
persistentvolumeclaims            pvc           v1           true         PersistentVolumeClaim
persistentvolumes                 pv            v1           false        PersistentVolume
pods                              po            v1           true         Pod
secrets                                         v1           true         Secret
serviceaccounts                   sa            v1           true         ServiceAccount
services                          svc           v1           true         Service
```

这将列出集群中支持的所有资源类型的名称和对应的缩写。您将看到一列名为 "NAME" 的资源类型，另一列名为 "SHORTNAMES" 的缩写。
SHORTNAMES 列展示了每个资源类型的缩写形式，您可以在使用 kubectl 命令时使用这些缩写。

如果您希望查看特定资源类型的详细信息，您可以运行以下命令：

```
kubectl explain <资源类型>
```

将 `<资源类型>` 替换为您感兴趣的资源类型，例如 "pods"、"deployments" 等。执行此命令将显示有关该资源类型的详细信息，例如字段和标签的定义。

请注意，获取资源类型的可用性和缩写可能因使用的 Kubernetes 版本而有所差异。

## Explain

```text
$ kubectl explain nodes
$ kubectl explain node.spec
$ kubectl explain pod.spec.containers
$ kubectl explain pods --recursive
```

## event

```text
$ kubectl get events
$ kubectl get events -o wide
```

```text
$ kubectl get events --field-selector type=Warning
LAST SEEN   TYPE      REASON                OBJECT                  MESSAGE
8m33s       Warning   InvalidDiskCapacity   node/worker02.k8s.lab   invalid capacity 0 on image filesystem
8m33s       Warning   Rebooted              node/worker02.k8s.lab   Node worker02.k8s.lab has been rebooted, boot id: b632d6ba-53ad-4750-afcc-835b657986f6
```

## VS

### create vs apply

`kubectl create` 和 `kubectl apply` 都是用于创建和管理 Kubernetes 资源的命令，但它们之间有一些主要的区别。

1. 创建行为：

- `kubectl create`：仅在资源不存在时创建资源，如果资源已经存在，则返回错误。
- `kubectl apply`：根据提供的配置文件或参数，创建或更新资源。如果资源已经存在，则应用所提供的配置更改。

2. 更新行为：

- `kubectl create`：不能更新已经存在的资源，如果你尝试创建一个已经存在的资源，将会导致错误。
- `kubectl apply`：可以更新已经存在的资源，会根据提供的配置文件或参数，将现有资源的状态与配置文件中的状态进行合并。

3. 配置文件：

- `kubectl create`：需要通过命令行参数明确指定资源的配置，或使用一个文件包含所有 necessary 配置。
- `kubectl apply`：通常会使用 YAML 或 JSON 格式的配置文件，这些文件可以包含多个资源的定义，因此可以在一个文件中同时管理多个资源。

4. 快速创建：

- `kubectl create`：提供了一些快速创建资源的命令，例如 `kubectl create deployment` 用于创建
  Deployment，`kubectl create service` 用于创建 Service。
- `kubectl apply`：没有直接的快速创建命令，必须使用配置文件或参数来指定资源的详细配置。

总之，`kubectl create` 用于只创建资源，而 `kubectl apply` 用于创建或更新资源。
`kubectl apply` 更适合于长期管理资源，因为它可以根据配置文件的变化自动更新资源。
而 `kubectl create` 则用于一次性创建资源，不会更新已存在的资源。

## Reference

- [kubectl](https://kubernetes.io/docs/reference/kubectl/kubectl/)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [Kubectl Reference Docs](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands)


