---
title: "systemd Drop-In"
sequence: "systemd-drop-in"
---

[UP](/linux.html)


Drop-In 是 `systemd` 配置文件的一种方式，可以在不修改原始配置文件的情况下，通过增量方式来覆盖或扩展配置。
可以将 Drop-In 文件视为覆盖原始配置的"补丁"。

在 `systemd` 中，服务的配置文件是放在 `/etc/systemd/system` 目录或者 `/usr/lib/systemd/system` 目录下的。
Drop-In 文件同样放在这些目录中，只是它们被放在了一个子目录中，
通常是 `/etc/systemd/system/<服务名>.service.d/` 或 `/usr/lib/systemd/system/<服务名>.service.d/` 目录下。

在 Drop-In 文件中，只需要编写需要覆盖或扩展的配置项，不需要重写整个配置文件。这种方式为系统管理员提供了一种更加灵活的方式来自定义服务的配置。

当使用 `systemctl` 命令查看服务状态时，如果服务有 Drop-In 文件，它们会以 "Drop-In" 的形式显示在命令输出中，以便管理员能够了解哪些文件被应用。

例如，假设有一个名为 `httpd.service` 的服务，它有一个 Drop-In 文件 `custom.conf`，
并且现在通过 `systemctl status httpd.service` 命令查看该服务的状态，则命令输出可能如下所示：

```
● httpd.service - The Apache HTTP Server
   Loaded: loaded (/usr/lib/systemd/system/httpd.service; enabled; vendor preset: disabled)
  Drop-In: /etc/systemd/system/httpd.service.d
           └─ custom.conf
   Active: active (running) since Tue 2021-12-14 10:16:51 CST; 4h 53min ago
 Main PID: 10561 (httpd)
    Tasks: 213 (limit: 23511)
   Memory: 17.2M
   CGroup: /system.slice/httpd.service
           ├─ 10561 /usr/sbin/httpd -DFOREGROUND
           ├─ 10563 /usr/sbin/httpd -DFOREGROUND
           ├─ 10564 /usr/sbin/httpd -DFOREGROUND
           ├─ 10565 /usr/sbin/httpd -DFOREGROUND
           ├─ 10566 /usr/sbin/httpd -DFOREGROUND
           └─ 10567 /usr/sbin/httpd -DFOREGROUND
```

可以看到，在 `httpd.service` 服务状态输出中有 "Drop-In" 项，下面显示了有一个名为 "custom.conf" 的 Drop-In 文件被应用。
