---
title: "Distro"
sequence: "102"
---

[UP](/linux.html)


查看 Linux 是 Redhat 还是 centos，及版本信息。命令如下：

```text
more /etc/issue
```

## 查看 Linux 内核版本命令

第一方法：

```text
# cat /proc/version
Linux version 3.10.0-1160.el7.x86_64 (mockbuild@kbuilder.bsys.centos.org)
 (gcc version 4.8.5 20150623 (Red Hat 4.8.5-44) (GCC) ) #1 SMP Mon Oct 19 16:18:59 UTC 2020
```

第二种方式：

```text
# uname -a
Linux 13fa91a6d858 3.10.0-1160.el7.x86_64 #1 SMP Mon Oct 19 16:18:59 UTC 2020 x86_64 GNU/Linux
```

## 查看 Linux 系统版本的命令

第一种方式：

```text
lsb_release -a
```

第二种方式：这种方法只适合 Redhat 系的 Linux

CentOS:

```text
$ cat /etc/redhat-release 
CentOS Linux release 7.9.2009 (Core)
```

```text
$ cat /etc/os-release
NAME="CentOS Linux"
VERSION="7 (Core)"
ID="centos"
ID_LIKE="rhel fedora"
VERSION_ID="7"
PRETTY_NAME="CentOS Linux 7 (Core)"
ANSI_COLOR="0;31"
CPE_NAME="cpe:/o:centos:centos:7"
HOME_URL="https://www.centos.org/"
BUG_REPORT_URL="https://bugs.centos.org/"

CENTOS_MANTISBT_PROJECT="CentOS-7"
CENTOS_MANTISBT_PROJECT_VERSION="7"
REDHAT_SUPPORT_PRODUCT="centos"
REDHAT_SUPPORT_PRODUCT_VERSION="7"
```

Type any one of the following command to find os name and version in Linux:

```text
cat /etc/os-release
lsb_release -a
hostnamectl
```

Type the following command to find Linux kernel version:

```text
uname -r
```

## lsb_release

### Prerequisite

By default, `lsb_release` command may not be installed on your system.

- Hence, use the **apk command** on Alpine Linux,
- **dnf command**/**yum command** on RHEL & co,
- **apt command**/**apt-get command on** Debian, Ubuntu & co,
- **zypper command** on SUSE/OpenSUSE,
- **pacman command** on Arch Linux

to install the lsb_release.

```text
yum whatprovides lsb_release
$ sudo yum install redhat-lsb-core
```
