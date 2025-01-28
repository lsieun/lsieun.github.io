---
title: "hostname"
sequence: "101"
---

[UP](/linux.html)


A computer hostname represents a unique name
that gets assigned to a computer in a network in order to uniquely identify that computer in that specific network.

## 主机名

A computer hostname can be set to any name you like, but you should keep in mind the following rules:

- hostnames can contain **letters** (from `a` to `z`).
- hostnames can contain **digits** (from `0` to `9`).
- hostnames can contain only the **hyphen character** (` – `) as a special character.
- hostnames can contain the **dot special character** (`.`).
- hostnames can contain a combination of all three rules but must start and end with a letter or a number.
- hostnames letters are case-insensitive.
- hostnames must contain between 2 and 63 characters long.
- hostnames should be descriptive
  (to ease identifying the computer purpose, location, geographical area, etc on the network).

## 查看主机名

```text
$ hostname
master01.k8s.lab
$ hostname -s
master01
$ hostname -f
master01.k8s.lab
```

The `-s` flag displayed the computer short name (hostname only) and
the `-f` flag displays the computer **FQDN** in the network
(only if the computer is a part of a domain or realm and the FQDN is set).

You can also display a Linux system hostname by inspecting the content of `/etc/hostname` file using the `cat` command.

```text
$ cat /etc/hostname
master01.k8s.lab
```

## 修改主机名

use the `hostnamectl` command as shown in the below command excerpt.

```text
$ sudo hostnamectl set-hostname your-new-hostname
```

In addition to `hostname` command,
you can also use `hostnamectl` command to display a Linux machine hostname.

```text
hostnamectl
```

```text
$ hostnamectl
   Static hostname: master01.k8s.lab
         Icon name: computer-vm
           Chassis: vm
        Machine ID: bf13549c7e039af13bed5b01649ce89d
           Boot ID: 57d9f3290caa4f0a9aabee58feb7a596
    Virtualization: vmware
  Operating System: CentOS Linux 7 (Core)
       CPE OS Name: cpe:/o:centos:centos:7
            Kernel: Linux 3.10.0-1160.92.1.el7.x86_64
      Architecture: x86-64
```

In order to apply the new hostname, a system `reboot` is required:

```text
$ init 6
$ systemctl reboot
$ shutdown -r
```
