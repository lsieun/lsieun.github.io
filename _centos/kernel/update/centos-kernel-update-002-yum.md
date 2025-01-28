---
title: "Centos7 内核升级（YUM 安装）"
sequence: "102"
---

## 内核升级

### 查看当前内核版本信息

第 1 种方式：

```text
$ uname -a
Linux centos7.local 3.10.0-1160.102.1.el7.x86_64 #1 SMP ... x86_64 x86_64 x86_64 GNU/Linux
```

第 2 种方式，仅查看版本信息：

```text
$ uname -r
3.10.0-1160.102.1.el7.x86_64
```

第 3 种方式，通过绝对路径查看查看版本信息及相关内容：

```text
$ cat /proc/version
Linux version 3.10.0-1160.102.1.el7.x86_64 ... (gcc version 4.8.5 20150623 (Red Hat 4.8.5-44) (GCC) ) ...
```

第 4 种方式，通过绝对路径查看查看版本信息：

```text
$ cat /etc/redhat-release
CentOS Linux release 7.9.2009 (Core)
```

### 安装内核

#### 导入仓库源

第 1 步，更新 YUM 源仓库：

```text
$ sudo yum -y update
```

第 2 步，导入 ELRepo 仓库的公共密钥：

```text
$ sudo rpm --import https://www.elrepo.org/RPM-GPG-KEY-elrepo.org
```

第 3 步，安装 ELRepo 仓库的 YUM 源：

```text
$ sudo yum -y install https://www.elrepo.org/elrepo-release-7.el7.elrepo.noarch.rpm
```

第 4 步，缓存：

```text
$ yum makecache
```

第 5 步，查询可用内核版本：

```text
$ yum --disablerepo="*" --enablerepo="elrepo-kernel" list available
Available Packages
kernel-lt.x86_64                    5.4.265-1.el7.elrepo     elrepo-kernel
kernel-lt-devel.x86_64              5.4.265-1.el7.elrepo     elrepo-kernel
kernel-lt-doc.noarch                5.4.265-1.el7.elrepo     elrepo-kernel
kernel-lt-headers.x86_64            5.4.265-1.el7.elrepo     elrepo-kernel
kernel-lt-tools.x86_64              5.4.265-1.el7.elrepo     elrepo-kernel
kernel-lt-tools-libs.x86_64         5.4.265-1.el7.elrepo     elrepo-kernel
kernel-lt-tools-libs-devel.x86_64   5.4.265-1.el7.elrepo     elrepo-kernel
kernel-ml.x86_64                    6.6.8-1.el7.elrepo       elrepo-kernel
kernel-ml-devel.x86_64              6.6.8-1.el7.elrepo       elrepo-kernel
kernel-ml-doc.noarch                6.6.8-1.el7.elrepo       elrepo-kernel
kernel-ml-headers.x86_64            6.6.8-1.el7.elrepo       elrepo-kernel
kernel-ml-tools.x86_64              6.6.8-1.el7.elrepo       elrepo-kernel
kernel-ml-tools-libs.x86_64         6.6.8-1.el7.elrepo       elrepo-kernel
kernel-ml-tools-libs-devel.x86_64   6.6.8-1.el7.elrepo       elrepo-kernel
perf.x86_64                         5.4.265-1.el7.elrepo     elrepo-kernel
python-perf.x86_64                  5.4.265-1.el7.elrepo     elrepo-kernel
```

#### 选择 ML 或 LT 版本安装

第 1 种方式，安装 **最新版 ML** 版本：

```text
$ sudo yum -y --enablerepo=elrepo-kernel install kernel-ml-devel kernel-ml
```

第 2 种方式，安装 **最新版 LT** 版本（推荐）

```text
$ sudo yum -y --enablerepo=elrepo-kernel install kernel-lt-devel kernel-lt
```

第 3 种方式，指定版本（不带版本号就安装最新版本）：

```text
$ sudo yum -y --enablerepo=elrepo-kernel install kernel-lt-devel-5.4.265-1.el7.elrepo.x86_64 kernel-lt-5.4.265-1.el7.elrepo.x86_64
```

安装完成后需要设置 grub2，即内核默认启动项

### GRUB2 设置

GRUB2（GRand Unified Bootloader version 2）是一个来自 GNU 项目的多操作系统启动程序，
用于**选择操作系统分区上的不同内核**，也可用于**向这些内核传递启动参数**。

内核安装好后，需要设置为默认启动选项并重启后才会生效。

#### 默认启动

第 1 步，查看系统上的所有可用内核：

```text
$ sudo awk -F\' '$1=="menuentry " {print i++ " : " $2}' /etc/grub2.cfg
0 : CentOS Linux (5.4.265-1.el7.elrepo.x86_64) 7 (Core)
1 : CentOS Linux (3.10.0-1160.105.1.el7.x86_64) 7 (Core)
2 : CentOS Linux (3.10.0-1160.102.1.el7.x86_64) 7 (Core)
3 : CentOS Linux (3.10.0-1160.71.1.el7.x86_64) 7 (Core)
4 : CentOS Linux (0-rescue-702fd188f4034c42aa2e3b648888af10) 7 (Core)
```

刚刚安装的内核即 `0 : CentOS Linux (5.4.265-1.el7.elrepo.x86_64) 7 (Core)`。

第 2 步，将 `grub2` 默认设置为 `0`：

方法1：通过 `grub2-set-default 0` 命令设置：

```text
$ sudo grub2-set-default 0
```

方法2：编辑 `/etc/default/grub` 文件，将 `GRUB_DEFAULT` 设置为 `0`：

```text
$ sudo vi /etc/default/grub
```

```text
GRUB_DEFAULT=0
```

#### 生成 grub 配置文件

`/boot/grub2/grub.cfg` 是 GRUB2 引导加载器的配置文件。

```text
$ sudo grub2-mkconfig -o /boot/grub2/grub.cfg
```

- `grub2-mkconfig`: 是一个用于生成 GRUB2 配置文件的命令。
- `-o`: 表示将输出写入指定的文件。
- `/boot/grub2/grub.cfg`: 是 GRUB2 配置文件的路径。

执行这个命令将重新生成或更新 `/boot/grub2/grub.cfg` 文件，以反映当前系统中安装的操作系统和内核版本。
这通常用于确保 GRUB2 菜单项与当前系统设置一致，以便在启动时提供正确的引导选项。

### 重启

```text
# 重启(默认30秒)
$ sudo reboot

# 立即重启
$ sudo reboot -h now
```

## 重启之后

### 验证是否升级成功

```text
$ uname -a
Linux centos7.local 5.4.265-1.el7.elrepo.x86_64 #1 SMP Wed Dec 20 13:57:20 EST 2023 x86_64 x86_64 x86_64 GNU/Linux
```

仅查看版本信息：

```text
$ uname -r
5.4.265-1.el7.elrepo.x86_64
```

通过绝对路径查看查看版本信息及相关内容：

```text
$ cat /proc/version
Linux version 5.4.265-1.el7.elrepo.x86_64 ... (gcc version 9.3.1 20200408 (Red Hat 9.3.1-2) (GCC)) #1 SMP ...
```

通过绝对路径查看查看版本信息：

```text
$ cat /etc/redhat-release
CentOS Linux release 7.9.2009 (Core)
```

### 删除旧内核（可选）

第 1 步，查看系统中的全部内核：

```text
$ rpm -qa | grep kernel
...
$ rpm -qa | grep kernel | sort
kernel-3.10.0-1160.102.1.el7.x86_64
kernel-3.10.0-1160.105.1.el7.x86_64
kernel-3.10.0-1160.71.1.el7.x86_64
kernel-lt-5.4.265-1.el7.elrepo.x86_64
kernel-lt-devel-5.4.265-1.el7.elrepo.x86_64
kernel-tools-3.10.0-1160.105.1.el7.x86_64
kernel-tools-libs-3.10.0-1160.105.1.el7.x86_64
```

第 2 步，移除旧的 kernel 版本：

```text
# yum remove kernel-版本
$ sudo yum remove -y kernel-3.10.0-1160.102.1.el7.x86_64 kernel-3.10.0-1160.105.1.el7.x86_64 kernel-3.10.0-1160.71.1.el7.x86_64 kernel-tools-3.10.0-1160.105.1.el7.x86_64 kernel-tools-libs-3.10.0-1160.105.1.el7.x86_64
```

## Reference

- [Centos7 内核升级](https://juejin.cn/post/7173248647701184526)
