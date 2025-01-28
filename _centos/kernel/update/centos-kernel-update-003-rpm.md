---
title: "Centos7 内核升级（RPM 安装）"
sequence: "103"
---

查找 kernel rpm 历史版本：[Link](https://mirrors.coreix.net/elrepo-archive-archive/kernel/el7/x86_64/RPMS/)

## 下载内核 RPM

```text
$ wget https://mirrors.coreix.net/elrepo-archive-archive/kernel/el7/x86_64/RPMS/kernel-lt-5.4.265-1.el7.elrepo.x86_64.rpm
$ wget https://mirrors.coreix.net/elrepo-archive-archive/kernel/el7/x86_64/RPMS/kernel-lt-devel-5.4.265-1.el7.elrepo.x86_64.rpm
```

## 安装内核

```text
$ sudo rpm -ivh kernel-lt-5.4.265-1.el7.elrepo.x86_64.rpm

$ sudo yum -y install perl
$ sudo rpm -ivh kernel-lt-devel-5.4.265-1.el7.elrepo.x86_64.rpm
```

## 确认已安装内核版本

```text
rpm -qa | grep kernel
```

## 之后操作

- GRUB2 设置
    - 设置启动
    - 生成 grub 配置文件
- 重启
    - 验证是否升级成功
    - 删除旧内核（可选）
