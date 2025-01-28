---
title: "systemctl"
sequence: "systemctl"
---

[UP](/linux.html)


`systemctl` may be used to introspect and control the state of the "systemd" system and service manager.

查看帮助：

```text
$ man systemctl
```

`deamon-reload` does not affect running services in any way.
`daemon-reload` is a reload for `systemd`,
while `reload` is a reload for a specific service.


```text
$ systemctl list-units
```

```text
$ sudo systemctl list-unit-files
```

```text
$ systemctl cat docker.service
# /usr/lib/systemd/system/docker.service                     # 注意：这里显示了文件路径
[Unit]
Description=Docker Application Container Engine
Documentation=https://docs.docker.com
After=network-online.target docker.socket firewalld.service containerd.service time-set.target
Wants=network-online.target containerd.service
Requires=docker.socket

[Service]
Type=notify
# the default is not to use systemd for cgroups because the delegate issues still
# exists and systemd currently does not support the cgroup feature set required
# for containers run by docker
ExecStart=/usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
ExecReload=/bin/kill -s HUP $MAINPID
TimeoutStartSec=0
RestartSec=2
Restart=always

...

# kill only the docker process, not all processes in the cgroup
KillMode=process
OOMScoreAdjust=-500

[Install]
WantedBy=multi-user.target
```

```text
$ systemctl edit docker.service
```
