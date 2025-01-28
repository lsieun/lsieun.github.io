---
title: "info + inspect"
sequence: "102"
---

## docker info

```text
$ docker info
Client: Docker Engine - Community
 Version:    24.0.2
 Context:    default
 Debug Mode: false
 Plugins:
  buildx: Docker Buildx (Docker Inc.)
    Version:  v0.10.5
    Path:     /usr/libexec/docker/cli-plugins/docker-buildx
  compose: Docker Compose (Docker Inc.)
    Version:  v2.18.1
    Path:     /usr/libexec/docker/cli-plugins/docker-compose

Server:
 Containers: 1
  Running: 0
  Paused: 0
  Stopped: 1
 Images: 3
 Server Version: 24.0.2
 Storage Driver: overlay2
  Backing Filesystem: xfs
  Supports d_type: true
  Using metacopy: false
  Native Overlay Diff: true
  userxattr: false
 Logging Driver: json-file
 Cgroup Driver: cgroupfs
 Cgroup Version: 1
 Plugins:
  Volume: local
  Network: bridge host ipvlan macvlan null overlay
  Log: awslogs fluentd gcplogs gelf journald json-file local logentries splunk syslog
 Swarm: inactive
 Runtimes: io.containerd.runc.v2 runc
 Default Runtime: runc
 Init Binary: docker-init
 containerd version: 3dce8eb055cbb6872793272b4f20ed16117344f8
 runc version: v1.1.7-0-g860f061
 init version: de40ad0
 Security Options:
  seccomp
   Profile: builtin
 Kernel Version: 3.10.0-957.el7.x86_64
 Operating System: CentOS Linux 7 (Core)
 OSType: linux
 Architecture: x86_64
 CPUs: 4
 Total Memory: 3.683GiB
 Name: centos7.lsieun.com
 ID: 88234d5b-9cdd-4a4a-b72f-ce11138df369
 Docker Root Dir: /var/lib/docker
 Debug Mode: true
  File Descriptors: 23
  Goroutines: 34
  System Time: 2023-06-14T02:24:54.324394112-04:00
  EventsListeners: 0
 Experimental: false
 Insecure Registries:
  docker.lan.net:8082
  docker.lan.net:8083
  127.0.0.0/8
 Registry Mirrors:
  https://hub-mirror.c.163.com/
 Live Restore Enabled: false
```

## docker inspect

```text
$ docker inspect --help

Usage:  docker inspect [OPTIONS] NAME|ID [NAME|ID...]

Return low-level information on Docker objects

Options:
  -f, --format string   Format the output using the given Go template
  -s, --size            Display total file sizes if the type is container
      --type string     Return JSON for specified type
```

### Image

```text
$ docker inspect docker.io/mysql:5.7

$ docker inspect alpine:3.18.0
```

### Container

```text
$ docker inspect nexus3
```

```text
$ docker run -dit --name alpine1 alpine ash
$ docker run -dit --name alpine2 --link alpine1 alpine ash
```

{% highlight text %}
{% raw %}
$ docker inspect -f "{{ .HostConfig.Links }}" alpine2
{% endraw %}
{% endhighlight %}

### Network

```text
$ docker network create somenetwork
e298f55577aca6df1d3ed581b2b171e73a159559e938750e87d398e4c0860e67

$ docker network ls
NETWORK ID     NAME          DRIVER    SCOPE
f4a2e6ffa3d1   bridge        bridge    local
873a6c48cb3f   host          host      local
bf92466ae79f   none          null      local
e298f55577ac   somenetwork   bridge    local

$ docker inspect somenetwork
[
    {
        "Name": "somenetwork",
        "Id": "e298f55577aca6df1d3ed581b2b171e73a159559e938750e87d398e4c0860e67",
        "Created": "2023-06-14T05:02:20.455279826-04:00",
        "Scope": "local",
        "Driver": "bridge",
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "default",
            "Options": {},
            "Config": [
                {
                    "Subnet": "172.18.0.0/16",
                    "Gateway": "172.18.0.1"
                }
            ]
        },
        "Internal": false,
        "Attachable": false,
        "Ingress": false,
        "ConfigFrom": {
            "Network": ""
        },
        "ConfigOnly": false,
        "Containers": {},
        "Options": {},
        "Labels": {}
    }
]
```
