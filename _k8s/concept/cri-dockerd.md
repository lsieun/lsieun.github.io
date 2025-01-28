---
title: "cri-dockerd"
sequence: "cri-dockerd"
---

The `cri-dockerd` adapter provides a shim for **Docker Engine**
that lets you control Docker via the **Kubernetes Container Runtime Interface**.

For users running `0.2.5` or above, the default network plugin is `cni`.
Kubernetes 1.24+ has removed `kubenet` and other network plumbing from upstream
as part of the `dockershim` removal/deprecation.
In order for a cluster to become operational, **Calico**, **Flannel**, **Weave**, or another CNI should be used.

A “shim” is used to translate between the **Docker Engine component** and **the relevant Kubernetes interface**,
in this case Container Runtime Interface (CRI).
If you need a CRI compliant Engine,
you can easily switch to Containerd and eliminate the need for cri-dockerd interface.

```text
$ cri-dockerd --help
```

## Reference

- [Github: cri-dockerd](https://github.com/Mirantis/cri-dockerd)
