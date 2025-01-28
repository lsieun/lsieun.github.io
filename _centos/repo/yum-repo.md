---
title: "YUM Repository"
sequence: "101"
---

## EPEL

EPEL(Extra Packages for Enterprise Linux) 
是由 Fedora Special Interest Group 维护的 Enterprise Linux（RHEL、CentOS）中经 常用到的包。

首先从 CentOS Extras 这个源里安装 epel-release：

```text
sudo yum install epel-release
```

用如下命令自动替换：

```text
sudo sed -e 's!^metalink=!#metalink=!g' \
    -e 's!^#baseurl=!baseurl=!g' \
    -e 's!https\?://download\.fedoraproject\.org/pub/epel!https://mirrors.tuna.tsinghua.edu.cn/epel!g' \
    -e 's!https\?://download\.example/pub/epel!https://mirrors.tuna.tsinghua.edu.cn/epel!g' \
    -i /etc/yum.repos.d/epel*.repo
```

```text
sudo sed -e 's!^metalink=!#metalink=!g' \
    -e 's!^#baseurl=!baseurl=!g' \
    -e 's!https\?://download\.fedoraproject\.org/pub/epel!https://nexus.lsieun.cn/repository/yum/epel!g' \
    -e 's!https\?://download\.example/pub/epel!https://nexus.lsieun.cn/repository/yum/epel!g' \
    -i /etc/yum.repos.d/epel*.repo
```

```text
$ sudo yum update
$ yum makecache
```

```text
$ sudo yum -y install htop
```
