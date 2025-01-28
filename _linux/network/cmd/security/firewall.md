---
title: "firewall"
sequence: "102"
---

[UP](/linux.html)


Firewalls are tools that can protect an OS.
Linux has **iptables** and **firewalld**,
which contain firewall rules and can manage firewall rules in Linux.
Essentially, **iptables** and **firewalld** are configured by the systems administrator to reject or accept traffic.
While you are not expected to be able to configure a system,
read this article to see how iptables can control incoming or outgoing traffic.
Why does the order of the rules matter?

- iptables
- firewalld
- seLinux

## The firewall

A firewall is a set of rules.
When a data packet moves into or out of a protected network space,
its contents (in particular, information about its origin, target, and the protocol it plans to use)
are tested against the firewall rules to see if it should be allowed through.

- On the one hand, **iptables** is a tool for managing firewall rules on a Linux machine.
- On the other hand, **firewalld** is also a tool for managing firewall rules on a Linux machine.

## iptables

Now a days, every Linux Kernel comes with **iptables** and can be found pre build or pre installed
on every famous modern Linux distributions.

On most Linux systems, **iptables** is installed in this `/usr/sbin/iptables` directory.
It can be also  found in `/sbin/iptables`,
but since iptables is more like a service rather than an “essential binary”,
the preferred location remains in `/usr/sbin` directory.

我的 CentOS 是 `CentOS Linux release 7.9.2009` 版本：

```text
$ cat /etc/redhat-release
CentOS Linux release 7.9.2009 (Core)
```

文件 `/usr/sbin/iptables` 是存在的：

```text
$ ls -l /usr/sbin/iptables
lrwxrwxrwx. 1 root root 13 Nov 10  2021 /usr/sbin/iptables -> xtables-multi

$ ls -l /usr/sbin/xtables-multi 
-rwxr-xr-x. 1 root root 93712 Oct  1  2020 /usr/sbin/xtables-multi
```

文件 `/sbin/iptables` 是存在的：

```text
$ ls -l /sbin/iptables
lrwxrwxrwx. 1 root root 13 Nov 10  2021 /sbin/iptables -> xtables-multi

$ ls -l /sbin/xtables-multi 
-rwxr-xr-x. 1 root root 93712 Oct  1  2020 /sbin/xtables-multi
```

For Ubuntu or Debian

```text
sudo apt-get install iptables
```

For CentOS:

```text
sudo yum install iptables-services
```

For RHEL

```text
sudo yum install iptables
```

### Iptables version

To know your iptables version, type the following command in your terminal:

```text
$ sudo iptables --version
iptables v1.4.21
```

### Start & Stopping your iptables firewall

For **Ubuntu**, type the following to stop.

```text
sudo service ufw stop
```

To start it again

```text
sudo service ufw start
```

For **Debian** & **RHEL** , type the following to stop.

```text
sudo /etc/init.d/iptables stop
```

To start it again

```text
sudo /etc/init.d/iptables start
```

For **CentOS**, type the following to stop.

```text
sudo service iptables stop
```

To start it again

```text
sudo service iptables start
```

### Getting all iptables rules lists

To know all the rules that is currently present & active in your iprables, simply open a terminal and type the following.

```text
sudo iptables -L
```

Type the following to know the status of the chains of your iptables firewall.

```text
sudo iptables -S
```

With the above command, you can learn whether your chains are accepting or not.

### Clear all iptables rules

To clear all the rules from your iptables firewall, please type the following.
This is normally known as **flushing your iptables rules**.

```text
sudo iptables -F
```

If you want to flush the INPUT chain only, or any individual chains, issue the below commands as per your requirements.

```text
sudo iptables -F INPUT
sudo iptables -F OUTPUT
sudo iptables -F FORWARD
```

### ACCEPT or DROP Chains

To accept or drop a particular chain, issue any of the following command on your terminal to meet your requirements.

```text
iptables --policy INPUT DROP
```

The above rule will not accept anything that is incoming to that server.
To revert it again back to ACCEPT, do the following

```text
iptables --policy INPUT ACCEPT
```

Same goes for other chains as well like

```text
iptables --policy OUTPUT DROP
iptables --policy FORWARD DROP
```


## firewall

查看开放的端口号：

```text
firewall-cmd --list-all
```

设置开放的端口号：

```text
firewall-cmd --add-service=http --permanent
sudo firewall-cmd --add-port=80/tcp --permanent
```

开放端口号之后，记得要重新启动防火墙。

重启防火墙：

```text
firewall-cmd --reload
```

## Reference

- [IPTABLES VS FIREWALLD](https://www.unixmen.com/iptables-vs-firewalld/)
- [Linux firewalls: What you need to know about iptables and firewalld](https://opensource.com/article/18/9/linux-iptables-firewalld)
