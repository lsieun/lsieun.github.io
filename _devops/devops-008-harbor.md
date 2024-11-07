---
title: "部署 Harbor"
sequence: "108"
---

## 环境准备

System requirements:

- [ ] docker 17.06.0-ce+
- [ ] docker-compose 1.18.0+

## Harbor 部署

第 1 步，下载

```text
https://github.com/goharbor/harbor
https://github.com/goharbor/harbor/releases
```

第 2 步，解压：

```text
$ tar -zxvf harbor-offline-installer-v2.7.3.tgz
```

第 3 步，修改 `harbor.yml` 文件：

```text
$ cp harbor.yml.tmpl harbor.yml
$ vi harbor.yml
```

```text
hostname: 192.168.80.253    # A. 修改 IP 地址

http:
  port: 80

# https:                                  # B. 注释掉
#  port: 443                              # B.
#  certificate: /your/certificate/path    # B.
#  private_key: /your/private/key/path    # B.

# ...

harbor_admin_password: Harbor12345    # C. 默认密码
```

第 4 步，安装：

```text
$ ./install.sh
```

启动失败了，错误信息如下：

```text
Note: stopping existing Harbor instance ...
Failed to load /home/devops/harbor/common/config/registryctl/env:
 open /home/devops/harbor/common/config/registryctl/env: permission denied
```

```text
$ sudo sh ./install.sh
```

第 5 步，浏览器访问：

```text
http://192.168.80.253/
```

- 用户：`admin`
- 密码：`Harbor12345`

![](/assets/images/devops/harbor/harbor-001-login.png)

![](/assets/images/devops/harbor/harbor-002-projects.png)
