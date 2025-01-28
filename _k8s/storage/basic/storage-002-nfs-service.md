---
title: "CentOS 安装 NFS 服务"
sequence: "102"
---

## 第一种方式

### master node

在 `master01.k8s.lab` 上执行：

```text
$ sudo yum -y install nfs-utils rpcbind
```

```text
$ sudo mkdir -p /opt/pv/mysql
$ sudo chmod 755 /opt/pv/mysql
```

```text
cat > /etc/exports <<-'EOF'
/opt/pv/mysql  *(rw,async,no_root_squash)
EOF
```

```text
$ sudo systemctl restart rpcbind
$ sudo systemctl enable rpcbind
$ sudo systemctl restart nfs
$ sudo systemctl enable nfs
```

### worker node

在 `worker01.k8s.lab` 和 `worker02.k8s.lab` 上执行：

```text
$ sudo yum -y install nfs-utils
$ sudo systemctl enable nfs
```

```text
$ showmount -e master01.k8s.lab
Export list for master01.k8s.lab:
/opt/pv/mysql *
```
