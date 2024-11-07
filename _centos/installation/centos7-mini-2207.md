---
title: "CentOS Mini 7"
sequence: "101"
---

```text
ISO 下载 --> VMWare 创建虚拟机 --> CentOS 安装 --> 配置用户 --> Yum 源
```

## ISO 下载

打开网页：

```text
https://mirrors.aliyun.com/centos/7.9.2009/isos/x86_64/
https://mirrors.ustc.edu.cn/centos/7.9.2009/isos/x86_64/
```

下载文件：

```text
CentOS-7-x86_64-Minimal-2207-02.iso
```

```text
https://mirrors.aliyun.com/centos/7.9.2009/isos/x86_64/CentOS-7-x86_64-Minimal-2207-02.iso
```

## VMWare 创建虚拟机

第 1 步，新建虚拟机：

![](/assets/images/centos/installation/vmware-centos7-install-001.png)

![](/assets/images/centos/installation/vmware-centos7-install-002.png)

![](/assets/images/centos/installation/vmware-centos7-install-003.png)

第 2 步，选择 ISO 镜像文件：

![](/assets/images/centos/installation/vmware-centos7-install-004.png)

第 3 步，虚拟机配置：

![](/assets/images/centos/installation/vmware-centos7-install-005.png)

![](/assets/images/centos/installation/vmware-centos7-install-006.png)

![](/assets/images/centos/installation/vmware-centos7-install-007.png)

![](/assets/images/centos/installation/vmware-centos7-install-008.png)

![](/assets/images/centos/installation/vmware-centos7-install-009.png)

![](/assets/images/centos/installation/vmware-centos7-install-010.png)

![](/assets/images/centos/installation/vmware-centos7-install-011.png)

![](/assets/images/centos/installation/vmware-centos7-install-012.png)

![](/assets/images/centos/installation/vmware-centos7-install-013.png)

![](/assets/images/centos/installation/vmware-centos7-install-014.png)


## CentOS 安装

第 1 步，开启虚拟机：

![](/assets/images/centos/installation/vmware-centos7-install-015.png)

第 2 步，安装 CentOS 7：

![](/assets/images/centos/installation/vmware-centos7-install-016.png)

第 3 步，CentOS 7 配置：

![](/assets/images/centos/installation/vmware-centos7-install-017.png)

选择 `Asia/Shanghai` 时区：

![](/assets/images/centos/installation/vmware-centos7-install-018.png)

- 自动分区
- 禁用 Kdump
- 网络连接

![](/assets/images/centos/installation/vmware-centos7-install-019.png)

用户配置：

- `root`/`root`
- `devops`/`123456`

![](/assets/images/centos/installation/vmware-centos7-install-020.png)

第 4 步，重启：

![](/assets/images/centos/installation/vmware-centos7-install-021.png)

第 5 步，关机

使用 `root` 用户登录：

![](/assets/images/centos/installation/vmware-centos7-install-022.png)

使用 `shutdown -h now` 关机：

![](/assets/images/centos/installation/vmware-centos7-install-023.png)

第 6 步，虚拟机设置（使用物理驱动器）：

![](/assets/images/centos/installation/vmware-centos7-install-024.png)

![](/assets/images/centos/installation/vmware-centos7-install-025.png)

第 7 步，添加 `ClearSystem` 快照：

![](/assets/images/centos/installation/vmware-centos7-install-026.png)

![](/assets/images/centos/installation/vmware-centos7-install-027.png)

![](/assets/images/centos/installation/vmware-centos7-install-028.png)

## 配置用户

第 1 步，使用 `root` 用户登录：

```text
$ ssh root@192.168.80.132
```

第 2 步，确认 `wheel` 用户组启用：

```text
[root@localhost ~]# visudo
```

```text
## Allows people in group wheel to run all commands
%wheel  ALL=(ALL)       ALL
```

![](/assets/images/centos/installation/vmware-centos7-install-029.png)

第 3 步，将 `devops` 用户加入 `wheel` 用户组：

```text
[root@localhost ~]# usermod -aG wheel devops
```

第 4 步，测试：

```text
[root@localhost ~]# su - devops
[devops@localhost ~]$ sudo ls -la /root
```

![](/assets/images/centos/installation/vmware-centos7-install-030.png)

## Yum 源更新

第 1 步，使用 `devops` 用户登录：

```text
$ ssh devops@192.168.80.132
```

- username: `devops`
- password: `123456`

第 2 步，查看 `/etc/yum.repos.d/` 目录：

```text
[devops@localhost ~]$ cd /etc/yum.repos.d/
[devops@localhost yum.repos.d]$ ls
CentOS-Base.repo  CentOS-Debuginfo.repo  CentOS-Media.repo    CentOS-Vault.repo
CentOS-CR.repo    CentOS-fasttrack.repo  CentOS-Sources.repo  CentOS-x86_64-kernel.repo
[devops@localhost yum.repos.d]$ cat CentOS-Base.repo 
[base]
name=CentOS-$releasever - Base
mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=os&infra=$infra
#baseurl=http://mirror.centos.org/centos/$releasever/os/$basearch/
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-7

......
```

第 3 步，替换为清华 Yum 源：

```text
sudo sed -e 's|^mirrorlist=|#mirrorlist=|g' \
         -e 's|^#baseurl=http://mirror.centos.org/centos|baseurl=https://mirrors.tuna.tsinghua.edu.cn/centos|g' \
         -i.bak \
         /etc/yum.repos.d/CentOS-*.repo
```

```text
$ sudo mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup
$ sudo curl -o /etc/yum.repos.d/CentOS-Base.repo https://mirrors.aliyun.com/repo/Centos-7.repo
```

第 4 步，确认修改：

```text
[devops@localhost yum.repos.d]$ ls
CentOS-Base.repo      CentOS-Debuginfo.repo      CentOS-Media.repo        CentOS-Vault.repo
CentOS-Base.repo.bak  CentOS-Debuginfo.repo.bak  CentOS-Media.repo.bak    CentOS-Vault.repo.bak
CentOS-CR.repo        CentOS-fasttrack.repo      CentOS-Sources.repo      CentOS-x86_64-kernel.repo
CentOS-CR.repo.bak    CentOS-fasttrack.repo.bak  CentOS-Sources.repo.bak  CentOS-x86_64-kernel.repo.bak
[devops@localhost yum.repos.d]$ cat CentOS-Base.repo
[base]
name=CentOS-$releasever - Base
#mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=os&infra=$infra
baseurl=https://mirrors.tuna.tsinghua.edu.cn/centos/$releasever/os/$basearch/
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-7

......
```

第 5 步，缓存和更新：

```text
sudo yum makecache
sudo yum -y update
```

第 6 步，关机：

```text
$ sudo shutdown -h now
```

第 7 步，快照：

![](/assets/images/centos/installation/vmware-centos7-install-031.png)

## Reference

- [CentOS 软件仓库镜像使用帮助](https://mirrors.tuna.tsinghua.edu.cn/help/centos/)
