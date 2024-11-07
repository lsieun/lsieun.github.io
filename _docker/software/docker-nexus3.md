---
title: "Nexus3"
sequence: "nexus"
---

```text
docker pull sonatype/nexus3
```

```text
docker run -d --restart=always --net=host -p 8081:8081 -p 5000:5000 --name nexus -v /opt/nexus/nexus-data:/nexus-data sonatype/nexus
```

```text
touch docker-compose.yaml
vi docker-compose.yaml
```

```text
version: '3.8'
services:
  nexus3:
    image: sonatype/nexus3
    container_name: nexus3
    privileged: true
    user: root
    ports:
     - 8081:8081
     - 5000:5000
     - 5001:5001
    volumes:
      - ./nexus-data:/nexus-data
```

```text
docker compose up -d
```

```text
http://192.168.80.130:8081/
```

点击右上角的`Sign in`按钮：

![](/assets/images/nexus3/nexus-data-admin-password.png)

```text
$ docker exec -it nexus3 /bin/bash
```

```text
# cat /nexus-data/admin.password 
5b47fb59-ae73-4894-9fa5-d7af8c6c50e5
```

![](/assets/images/nexus3/choose-new-password-for-admin.png)

![](/assets/images/nexus3/configure-annoymous-access.png)

![](/assets/images/nexus3/nexus3-setup-complete.png)

在docker环境下，破解Nexus Repository：
第一步，通过docker安装nexus
第二步，以root用户启动nexus，替换/opt/sonatype/nexus/system/com/sonatype/licensing/license-bundle/1.6.0/license-bundle-1.6.0.jar
第三步，关闭nexus，修改<data-dir>/etc/nexus.properties文件，添加nexus.loadAsOSS=false配置
第四步，重新启动Nexus

```text
$ docker exec -it nexus3 /bin/bash
```

```text
docker exec -it --user=root nexus3 /bin/bash
```

```text
# cd /opt/sonatype/nexus/system/com/sonatype/licensing/license-bundle/1.6.0/
# mv license-bundle-1.6.0.jar license-bundle-1.6.0.jar.bak
```

```text
$ docker cp ~/license-bundle-1.6.0.jar nexus3:/opt/sonatype/nexus/system/com/sonatype/licensing/license-bundle/1.6.0/
```

```text
$ docker compose down
$ cd ./nexus-data/etc/
$ sudo vi nexus.properties
```

添加如下内容：

```text
nexus.loadAsOSS=false
```

```text
$ docker compose up -d
```

## Reference

- [sonatype/nexus3](https://hub.docker.com/r/sonatype/nexus3)
