---
title: "NPM Repo"
sequence: "npm"
---

步骤：

- create a private (hosted) repository for our own packages
- create a proxy repository pointing to the official registry
- create a group repository to privide all the above repos under a single URL
- Set up npm registry

use your own nexus:

```text
npm config set registry http://192.168.80.130:8081/repository/npm-group/
```

http://hub-mirror.c.163.com

```text
$ sudo vi /etc/docker/daemon.json
```

```json
{
    "insecure-registries":[
        "192.168.1.22:8082",
        "192.168.1.22:8083"
    ],
    "disable-legacy-registry": true
}
```

## Reference

- [2021年最新nexus搭建docker私服npm私服](https://www.bilibili.com/video/BV1rb4y1f72d)
