---
title: "systemd"
sequence: "systemd"
---

[UP](/linux.html)


查看帮助：

```text
$ man systemd
```

```text
$ sudo yum -y install psmisc
```

```text
$ pstree
systemd ─┬─ NetworkManager ─── 2*[{NetworkManager}]
        ├─ agetty
        ├─ auditd ───{auditd}
        ├─ containerd ─── 7*[{containerd}]
        ├─ crond
        ├─ dbus-daemon ───{dbus-daemon}
        ├─ dockerd ─── 8*[{dockerd}]
        ├─ irqbalance
        ├─ lvmetad
        ├─ master ─┬─ pickup
        │        └─ qmgr
        ├─ polkitd ─── 6*[{polkitd}]
        ├─ rsyslogd ─── 2*[{rsyslogd}]
        ├─ sshd ─── sshd ─── sshd ─── bash ─── pstree
        ├─ systemd-journal
        ├─ systemd-logind
        ├─ systemd-udevd
        └─ tuned ─── 4*[{tuned}]
```

```text
$ pstree -p
systemd(1)─┬─ NetworkManager(772)─┬─{NetworkManager}(785)
           │                     └─{NetworkManager}(787)
           ├─ agetty(781)
           ├─ anacron(1528)
           ├─ auditd(737)───{auditd}(738)
           ├─ containerd(1743)─┬─{containerd}(1745)
           │                  ├─{containerd}(1746)
           │                  ├─{containerd}(1747)
           │                  ├─{containerd}(1748)
           │                  ├─{containerd}(1749)
           │                  ├─{containerd}(1750)
           │                  └─{containerd}(1752)
           ├─ crond(777)
           ├─ dbus-daemon(767)───{dbus-daemon}(771)
           ├─ dockerd(1587)─┬─{dockerd}(1588)
           │               ├─{dockerd}(1589)
           │               ├─{dockerd}(1590)
           │               ├─{dockerd}(1591)
           │               ├─{dockerd}(1592)
           │               ├─{dockerd}(1593)
           │               ├─{dockerd}(1594)
           │               └─{dockerd}(1598)
           ├─ irqbalance(762)
           ├─ lvmetad(594)
           ├─ master(1127)─┬─ pickup(1132)
           │              └─ qmgr(1133)
           ├─ polkitd(761)─┬─{polkitd}(773)
           │              ├─{polkitd}(774)
           │              ├─{polkitd}(778)
           │              ├─{polkitd}(783)
           │              ├─{polkitd}(784)
           │              └─{polkitd}(789)
           ├─ rsyslogd(992)─┬─{rsyslogd}(1002)
           │               └─{rsyslogd}(1003)
           ├─ sshd(994)─── sshd(1411)─── sshd(1415)─── bash(1416)─── pstree(1776)
           ├─ systemd-journal(563)
           ├─ systemd-logind(766)
           ├─ systemd-udevd(607)
           └─ tuned(991)─┬─{tuned}(1265)
                        ├─{tuned}(1266)
                        ├─{tuned}(1269)
                        └─{tuned}(1270)
```



## 路径

- `/etc/systemd/system`
- `/lib/systemd/system`
- `/usr/lib/systemd/system`

问题：

- 各个目录的区别是什么？
- 我们自己添加，应该放到哪个目录比较合适呢？

If you look at the man page `man systemd.unit` it has a table that explains the differences.
This is from a CentOS 7.x system.

```text
UNIT LOAD PATH
       Unit files are loaded from a set of paths determined during 
       compilation, described in the two tables below. Unit files found 
       in directories listed earlier override files with the same name 
       in directories lower in the list.

Table 1.  Load path when running in system mode (--system).
┌────────────────────────┬─────────────────────────────┐
│ Path                    │ Description                 │
├────────────────────────┼─────────────────────────────┤
│/etc/systemd/system     │ Local configuration         │
├────────────────────────┼─────────────────────────────┤
│/run/systemd/system     │ Runtime units               │
├────────────────────────┼─────────────────────────────┤
│/usr/lib/systemd/system │ Units of installed packages │
└────────────────────────┴─────────────────────────────┘
```

When they say "installed packages" they're referring to anything which was installed via an RPM.
The same can be assumed for Debian/Ubuntu as well where a DEB file would be the "installed package".

NOTE: the table above from a Debian/Ubuntu system is slightly different.

```text
Table 1.  Load path when running in system mode (--system).
┌────────────────────┬─────────────────────────────┐
│ Path                │ Description                 │
├────────────────────┼─────────────────────────────┤
│/etc/systemd/system │ Local configuration         │
├────────────────────┼─────────────────────────────┤
│/run/systemd/system │ Runtime units               │
├────────────────────┼─────────────────────────────┤
│/lib/systemd/system │ Units of installed packages │
└────────────────────┴─────────────────────────────┘
```

The expectation is that `/usr/lib/systemd/system` is a directory that should only contain systemd unit files
which were put there by the package manager (YUM/DNF/RPM/APT/etc).

Files in `/etc/systemd/system` are manually placed here by the operator of the system for ad-hoc software installations
that are not in the form of a package. This would include tarball type software installations.

```text

```

## Unit Types

systemd provides a dependency system between various entities called "units" of 12 different types.

The following unit types are available:

1. Service units, which start and control daemons and the processes they consist of. For details see systemd.service(5).

2. Socket units, which encapsulate local IPC or network sockets in the system, useful for socket-based activation. For details about socket units see systemd.socket(5), for details on socket-based activation and other forms of
   activation, see daemon(7).

3. Target units are useful to group units, or provide well-known synchronization points during boot-up, see systemd.target(5).

4. Device units expose kernel devices in systemd and may be used to implement device-based activation. For details see systemd.device(5).

5. Mount units control mount points in the file system, for details see systemd.mount(5).

6. Automount units provide automount capabilities, for on-demand mounting of file systems as well as parallelized boot-up. See systemd.automount(5).

7. Snapshot units can be used to temporarily save the state of the set of systemd units, which later may be restored by activating the saved snapshot unit. For more information see systemd.snapshot(5).

8. Timer units are useful for triggering activation of other units based on timers. You may find details in systemd.timer(5).

9. Swap units are very similar to mount units and encapsulate memory swap partitions or files of the operating system. They are described in systemd.swap(5).

10. Path units may be used to activate other services when file system objects change or are modified. See systemd.path(5).

11. Slice units may be used to group units which manage system processes (such as service and scope units) in a hierarchical tree for resource management purposes. See systemd.slice(5).

12. Scope units are similar to service units, but manage foreign processes instead of starting them as well. See systemd.scope(5).

```text
$ systemctl list-units
```

```text
$ sudo systemctl list-unit-files
```

```text
$ systemctl list-timers
```



## Configuration File

我们自己写一个 Service，就要落实到具体的文件，那这个文件应该如何写呢？可以查看帮助：

```text
$ man 5 systemd.service
$ man 5 systemd.timer
```
