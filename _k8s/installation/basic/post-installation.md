---
title: "Post Installation"
sequence: "post-installation"
---

## Work

在任意节点使用 `kubectl`：

第 1 步，将 master 节点中 `/etc/kubernetes/admin.conf` 拷贝到需要运行的服务器的 `/etc/kubernetes/` 目录中。

```text
scp /etc/kubernetes/admin.conf root@k8s-node1:/etc/kubernetes/
```

第 2 步，在对应的服务器上配置环境变量

```text
echo "export KUBECONFIG=/etc/kubernetes/admin.conf" >> ~/.bash_profile
source ~/.bash_profile
```

```text
$ mkdir ~/.kube
$ scp liusen@master01.k8s.lab:~/.kube/config ~/.kube/config
$ sudo yum -y install kubernetes-client
```

## 测试 Kubernetes 集群

在 Kubernetes 集群中创建一个 Pod，验证是否正常运行：

```text
kubectl create deployment nginx --image=nginx
kubectl expose deployment nginx --port=80 --type=NodePort
kubectl get pods,svc
```

## Setting up a short alias for kubectl

Most users of Kubernetes use `k` as the alias for `kubectl`.
Add the following line to your `~/.bashrc` or equivalent file:

```text
alias k=kubectl
```

## 命令自动补充

安装 bash-completion

```text
$ sudo yum -y install bash-completion
```

拷贝 kubernetes 的自动补全脚本到系统补全目录中

```text
source <(kubectl completion bash)
```

重新加载环境变量，使设置生效

```text
echo "source <(kubectl completion bash)" >> ~/.bashrc
source ~/.bashrc
```

- [Link](https://www.yuque.com/xuxiaowei-com-cn/gitlab-k8s/k8s-install)

However, this will only complete your commands when you use the full `kubectl` command name.
It won't work when you use the `k` alias.
To enable completion for the alias, you must run the following command:

```text
$ complete -o default -F __start_kubectl k
```

## Running your first application on Kubernetes

### Creating a Deployment

```text
$ kubectl create deployment kiada --image=lsieun/kiada:0.1
deployment.apps/kiada created
```

### Listing deployments

```text
$ kubectl get deployments
NAME    READY   UP-TO-DATE   AVAILABLE   AGE
kiada   1/1     1            1           2m48s
```

### Listing pods

```text
$ kubectl get pods
NAME                     READY   STATUS      RESTARTS   AGE
kiada-846468789c-lmsfn   1/1     Running     0          6m31s
```

### Exposing your application to the world

```text
$ kubectl expose deployment kiada --type=LoadBalancer --port 8080
service/kiada exposed
```

```text
$ kubectl get services
NAME         TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
kiada        LoadBalancer   10.110.64.173   <pending>     8080:32222/TCP   84s
kubernetes   ClusterIP      10.96.0.1       <none>        443/TCP          2d12h
```

### Horizontally scaling the application

```text
$ kubectl scale deployment kiada --replicas=3
deployment.apps/kiada scaled
```

```text
$ kubectl get deployments
NAME    READY   UP-TO-DATE   AVAILABLE   AGE
kiada   3/3     3            3           71m
```

```text
$ kubectl get pods
NAME                     READY   STATUS      RESTARTS   AGE
kiada-846468789c-9v5pf   1/1     Running     0          3m38s
kiada-846468789c-hbnxt   1/1     Running     0          3m38s
kiada-846468789c-lmsfn   1/1     Running     0          72m
```

```text
$ kubectl get pods -o wide
NAME                     READY   STATUS      RESTARTS   AGE    IP               NODE               NOMINATED NODE   READINESS GATES
kiada-846468789c-9v5pf   1/1     Running     0          4m     10.244.203.8     worker01.k8s.lab   <none>           <none>
kiada-846468789c-hbnxt   1/1     Running     0          4m     10.244.167.211   worker02.k8s.lab   <none>           <none>
kiada-846468789c-lmsfn   1/1     Running     0          73m    10.244.167.210   worker02.k8s.lab   <none>           <none>
```


