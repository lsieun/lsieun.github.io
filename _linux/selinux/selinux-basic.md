---
title: "SELinux"
sequence: "selinux"
---

[UP](/linux.html)


## 要查看 SELinux 的状态：

```text
$ getenforce
```

这些命令将会返回 SELinux 的当前状态。可能的输出是：

- `Enforcing`：表示 SELinux 当前处于强制模式，严格执行策略。
- `Permissive`：表示 SELinux 当前处于宽容模式，记录违反策略的操作但不阻止它们。
- `Disabled`：表示 SELinux 当前处于禁用状态。

如果您是使用 Root 用户执行以上命令，将会显示更详细的 SELinux 信息。如果您是普通用户，可能只会显示当前的 SELinux 状态。

请注意，如果您使用的是不同的 Linux 发行版或配置了不同的 SELinux 策略，可能还有其他命令或方式来检查 SELinux 的状态。

## Disable SELinux

If you have SELinux in enforcing mode, turn it off or use Permissive mode.

```text
$ sudo setenforce 0
$ sudo sed -i 's/^SELINUX=.*/SELINUX=permissive/g' /etc/selinux/config
```

```text
$ sudo sed -ri 's/^SELINUX=.*/SELINUX=disabled/g' /etc/selinux/config
```
