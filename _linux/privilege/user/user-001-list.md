---
title: "当前用户和所有用户"
sequence: "101"
---

[UP](/linux.html)


## 当前用户

```text
$ whoami
devops

$ echo $UID
1000

$ id
uid=1000(devops) gid=1000(devops) groups=1000(devops),10(wheel),995(docker)
```

## 查看所有用户

本地用户（Local user）的信息存储在 `/etc/passwd` 文件中：，。

```text
$ cat /etc/passwd
root:x:0:0:root:/root:/bin/bash
bin:x:1:1:bin:/bin:/sbin/nologin
daemon:x:2:2:daemon:/sbin:/sbin/nologin
shutdown:x:6:0:shutdown:/sbin:/sbin/shutdown
ftp:x:14:50:FTP User:/var/ftp:/sbin/nologin
nobody:x:99:99:Nobody:/:/sbin/nologin
systemd-network:x:192:192:systemd Network Management:/:/sbin/nologin
sshd:x:74:74:Privilege-separated SSH:/var/empty/sshd:/sbin/nologin
liusen:x:1000:1000:liusen:/home/liusen:/bin/bash
```

每一行代表一条用户信息，每一条用户信息用 `:` 分隔：

- User name.
- Encrypted password (`x` means that the password is stored in the `/etc/shadow` file).
- User ID number (`UID`).
- User's group ID number (`GID`).
- Full name of the user (GECOS).
- User home directory.
- Login shell (defaults to /bin/bash).

### 只查看用户名

If you want to display only the username you can use either `awk` or `cut` commands
to print only the first field containing the username:

```text
$ awk -F: '{ print $1}' /etc/passwd
root
bin
daemon
shutdown
ftp
nobody
systemd-network
sshd
liusen
```

```text
$ cut -d: -f1 /etc/passwd
root
bin
daemon
shutdown
ftp
nobody
systemd-network
sshd
liusen
```
