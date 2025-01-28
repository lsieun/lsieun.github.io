---
title: "NFS"
sequence: "nfs"
---

[UP](/linux.html)


## 安装服务

```text
$ sudo yum -y install nfs-utils
$ sudo mkdir /nfsdata
$ sudo chmod 755 /nfsdata
$ chown nfsnobody:nfsnobody /nfsdata/
$ echo "/nfsdata    *(rw,sync,all_squash)" > /etc/exports
$ sudo systemctl enable nfs
$ systemctl start nfs
$ exportfs -rv
```

## 用户

nfsnobody（NFS Nobody）是一个特殊的用户账号，通常用于 NFS（Network File System）共享文件系统中。

在 NFS 系统中，每个远程主机（客户端）通过 UID（用户标识符）和 GID（组标识符）来识别用户和组。
当 NFS 服务器无法映射客户端的 UID 和 GID 到本地系统的有效用户和组时，就会使用 nfsnobody 来代替。

nfsnobody 是一个虚拟用户，它通常被分配一个特定的 UID 和 GID，例如 65534。
当 NFS 服务器无法确定客户端的 UID 和 GID 时，它将使用 nfsnobody 的 UID 和 GID 来处理文件和目录权限。

通常情况下，服务器会将对文件的访问权限限制为只读或只写，以确保 nfsnobody 无权限对服务器上的文件进行更改或破坏。
这样可以保护服务器的安全性，并防止未经授权的访问。

总之，nfsnobody 在 NFS 系统中起到一个代理角色，用于处理来自未能映射到本地有效用户和组的远程客户端的请求，并限制对共享文件的访问权限。
