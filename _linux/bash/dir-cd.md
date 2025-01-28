---
title: "Cd"
sequence: "dir-cmd"
---

[UP](/linux.html)


```bash
$ type cd

cd is a shell builtin
```

自我约束：

- 使用 `cd` 代替 `cd ~`
- 使用 `cd -` 代替 `cd $OLDPWD`
- 对于常用的目录使用 `alias`，例如：`alias cdnet='cd /etc/sysconfig/network-scripts'`

```bash
cd -
```

An argument of `-` is converted to `$OLDPWD` before the directory change is attempted.
