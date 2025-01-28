---
title: "Ingress"
sequence: "ingress"
---

- Ingress
    - 安装 ingress-nginx
        - 添加 helm 仓库
        - 下载包
        - 配置参数
        - 创建 namespace
        - 安装 ingress
    - 基本使用
        - 创建一个 ingress
        - 多域名配置

## Ingress Controller 和 Ingress Resource

Ingress Controller 和 Ingress Resource 是 Kubernetes 中用于实现 HTTP 和 HTTPS 路由的两个关键概念和组件。

Ingress Controller 是一个 Kubernetes 的**插件或扩展**，它负责实现 Ingress Resource 的配置和处理。
Ingress Controller 可以根据 Ingress 资源的定义，将外部请求路由到集群内部的不同服务。
它通常是一个独立的 Pod 或一组 Pod，运行在 Kubernetes 集群中，监听集群外部的 HTTP/HTTPS 流量，并将其转发到合适的服务。

Ingress Resource 是一个 Kubernetes 的 **API 对象**，用于定义和配置 HTTP 和 HTTPS 路由规则。
通过创建和配置 Ingress 资源，你可以定义集群外部的访问规则，例如域名、路径和端口映射到集群中的服务。
每个 Ingress 资源都包含一个或多个规则（rules），每个规则定义了一组匹配条件和对应的后端服务。

简而言之，Ingress Controller 是实际处理 HTTP/HTTPS 流量的组件，而 Ingress Resource 是用于定义和配置路由规则的对象。
你可以创建一个 Ingress 资源，然后通过 Ingress Controller 将其解析并实现相应的路由规则，从而将外部流量正确地转发到相应的内部服务。

## 安装 ingress-nginx

添加仓库：

```text
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
```

查看仓库列表：

```text
helm repo list
```

搜索 ingress-nginx

```text
helm search repo ingress-nginx
```

下载安装包：

```text
$ helm pull ingress-nginx/ingress-nginx
```

```text
$ ls
ingress-nginx-4.7.1.tgz
```

```text
$ tar -zxvf ingress-nginx-4.7.1.tgz
$ cd ingress-nginx
$ ls
changelog  CHANGELOG.md  changelog.md.gotmpl  Chart.yaml  ci  OWNERS  README.md  README.md.gotmpl  templates  values.yaml
```

修改 `values.yaml` 文件：

- 第 1 处，镜像地址修改为国内镜像，将 `registry: registry.k8s.io` 修改为 `registry: registry.aliyuncs.com`
    - 第 21 行
    - 第 612 行
    - 第 746 行
- hostNetwork: true
- dnsPolicy: ClusterFirstWithHostNet
- 修改部署配置的 `kind`：DaemonSet
- nodeSelector:
- ingress: "true" # 增加选择器，如果 `node` 上有 ingress=true 就部署
- 将 service 的 type 由 LoadBalancer 修改为 ClusterIP；如果服务器是云平台，才用 LoadBalancer
- 将 docker.io/jettech/kube-webhook-certgen 修改为国内镜像

第 16 行

修改前：

```yaml
controller:
  name: controller
  image:
    ## Keep false as default for now!
    chroot: false
    registry: registry.k8s.io
    image: ingress-nginx/controller
    tag: "v1.8.1"
    digest: sha256:e5c4824e7375fcf2a393e1c03c293b69759af37a9ca6abdb91b13d78a93da8bd
    digestChroot: sha256:e0d4121e3c5e39de9122e55e331a32d5ebf8d4d257227cb93ab54a1b912a7627
    pullPolicy: IfNotPresent
```

修改后：

```yaml
controller:
  name: controller
  image:
    ## Keep false as default for now!
    chroot: false
    registry: registry.aliyuncs.com    # 修改这里
    image: google_containers/nginx-ingress-controller   # 修改这里
    tag: "v1.8.1"
    # digest: sha256:e5c4824e7375fcf2a393e1c03c293b69759af37a9ca6abdb91b13d78a93da8bd         # 注释掉
    # digestChroot: sha256:e0d4121e3c5e39de9122e55e331a32d5ebf8d4d257227cb93ab54a1b912a7627   # 注释掉
    pullPolicy: IfNotPresent
```

- 原镜像名： `ingress-nginx/controller:v1.8.1`
- 新镜像名： `google_containers/nginx-ingress-controller:v1.8.1`

第 609 行

修改前：

```yaml
    patch:
      enabled: true
      image:
        registry: registry.k8s.io
        image: ingress-nginx/kube-webhook-certgen
        tag: v20230407
        digest: sha256:543c40fd093964bc9ab509d3e791f9989963021f1e9e4c9c7b6700b02bfb227b
        pullPolicy: IfNotPresent
```

修改后：

```yaml
    patch:
      enabled: true
      image:
        registry: registry.aliyuncs.com    # 修改这里
        image: google_containers/kube-webhook-certgen    # 修改这里
        tag: v20230407
        # digest: sha256:543c40fd093964bc9ab509d3e791f9989963021f1e9e4c9c7b6700b02bfb227b      # 修改这里
        pullPolicy: IfNotPresent
```

```yaml
defaultBackend:
  ##
  enabled: false
  name: defaultbackend
  image:
    registry: registry.k8s.io
    image: defaultbackend-amd64
    ## for backwards compatibility consider setting the full image url via the repository value below
    ## use *either* current default registry/image or repository format or installing chart by providing the values.yaml will fail
    ## repository:
    tag: "1.5"
    pullPolicy: IfNotPresent
    # nobody user -> uid 65534
    runAsUser: 65534
    runAsNonRoot: true
    readOnlyRootFilesystem: true
    allowPrivilegeEscalation: false
```

```text
$ docker pull registry.aliyuncs.com/google_containers/nginx-ingress-controller:v1.8.1
$ docker pull registry.aliyuncs.com/google_containers/kube-webhook-certgen:v20230407
$ docker pull registry.aliyuncs.com/google_container/defaultbackend-amd64:1.5
$ docker pull registry.k8s.io/defaultbackend-amd64:1.5
```

```yaml
$ docker pull registry.k8s.io/defaultbackend-amd64:1.5
```

第 56 行，将 `dnsPolicy`  修改为 `ClusterFirstWithHostNet`：

```text
  dnsPolicy: ClusterFirstWithHostNet
```

第 77 行，将 `hostNetwork` 修改为 `true`：

```text
  hostNetwork: true
```

第 169 行，将 `kind` 修改为 `DaemonSet`：

```text
  kind: DaemonSet
```

第 262 行，给 `nodeSelector` 添加 `ingress: "true"`：

```yaml
  nodeSelector:
    kubernetes.io/os: linux
    ingress: "true"
```

第 463 行，将 `type` 由 `LoadBalancer` 修改为 `ClusterIP`：

```text
    type: ClusterIP
```

> 如果服务器是云平台，才用 `LoadBalancer`

第 566 行，将 `admissionWebhooks.enabled` 设置为 `false`：

```text
  admissionWebhooks:
    annotations: { }
    enabled: false
```

为 ingress 创建一个专门的 namespace：

```text
$ kubectl create namespace ingress-nginx
```

为需要部署 ingress 的节点加入标签：

```text
$ kubectl label node worker01.k8s.lab ingress=true
```

安装 ingress-nginx：

```text
$ helm install ingress-nginx -n ingress-nginx .
```

```text
$ helm install ingress-nginx2 -n ingress-nginx .
NAME: ingress-nginx2
LAST DEPLOYED: Wed Jul  5 14:06:32 2023
NAMESPACE: ingress-nginx
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
The ingress-nginx controller has been installed.
Get the application URL by running these commands:
  export POD_NAME=$(kubectl --namespace ingress-nginx get pods -o jsonpath="{.items[0].metadata.name}" -l "app=ingress-nginx,component=controller,release=ingress-nginx2")
  kubectl --namespace ingress-nginx port-forward $POD_NAME 8080:80
  echo "Visit http://127.0.0.1:8080 to access your application."

An example Ingress that makes use of the controller:
  apiVersion: networking.k8s.io/v1
  kind: Ingress
  metadata:
    name: example
    namespace: foo
  spec:
    ingressClassName: nginx
    rules:
      - host: www.example.com
        http:
          paths:
            - pathType: Prefix
              backend:
                service:
                  name: exampleService
                  port:
                    number: 80
              path: /
    # This section is only required if TLS is to be enabled for the Ingress
    tls:
      - hosts:
        - www.example.com
        secretName: example-tls

If TLS is enabled for the Ingress, a Secret containing the certificate and key must also be provided:

  apiVersion: v1
  kind: Secret
  metadata:
    name: example-tls
    namespace: foo
  data:
    tls.crt: <base64 encoded cert>
    tls.key: <base64 encoded key>
  type: kubernetes.io/tls
```

```text
$ kubectl get pods --namespace ingress-nginx
```

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-ingress-nginx-example
  annotations:
    kubernetes.io/ingress.class: "nginx"
spec:
  ingressClassName: nginx
  rules:
    - host: www.example.com
      http:
        paths:
          - pathType: Prefix
            path: /
            backend:
              service:
                name: nginx-svc
                port:
                  number: 80

```

- pathType:
    - Prefix
    - Exact，精确匹配
    - ImplementationSpecific，需要指定 IngressClass，具体匹配规则以 IngressClass 的规则为准

```text
$ kubectl create -f my-ingress-nginx-example.yaml
```

```text
$ kubectl get ingress
NAME                       CLASS   HOSTS             ADDRESS          PORTS   AGE
my-ingress-nginx-example   nginx   www.example.com   10.100.134.199   80      30s
```

修改 hosts 信息：

```text
192.168.80.231 www.example.com
```

浏览器访问：

```text
http://www.example.com/
```

## Reference

- [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/)
- [Ingress-Nginx Controller: Installation Guide](https://kubernetes.github.io/ingress-nginx/deploy/)
- [K8s 学习笔记之四：使用 kubeadm 配置 Ingress](https://www.cnblogs.com/wuchangblog/p/13294990.html)
