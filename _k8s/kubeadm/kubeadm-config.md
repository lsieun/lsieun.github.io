---
title: "kubeadm config"
sequence: "kubeadm-config"
---

During `kubeadm init`,
kubeadm uploads the `ClusterConfiguration` object to your cluster
in a ConfigMap called `kubeadm-config` in the kube-system namespace.
This configuration is then read during `kubeadm join`, `kubeadm reset` and `kubeadm upgrade`.

You can use `kubeadm config print` to print the default static configuration
that kubeadm uses for `kubeadm init` and `kubeadm join`.

```text
$ kubeadm config print init-defaults
$ kubeadm config print join-defaults
```

```text
docker tag registry.aliyuncs.com/google_containers/kube-apiserver:v1.27.3 docker.lan.net:8083/google_containers/kube-apiserver:v1.27.3
docker tag registry.aliyuncs.com/google_containers/kube-controller-manager:v1.27.3 registry.aliyuncs.com/google_containers/kube-controller-manager:v1.27.3
docker tag registry.aliyuncs.com/google_containers/kube-scheduler:v1.27.3 registry.aliyuncs.com/google_containers/kube-scheduler:v1.27.3
docker tag registry.aliyuncs.com/google_containers/kube-proxy:v1.27.3
docker tag registry.aliyuncs.com/google_containers/pause:3.9
```
