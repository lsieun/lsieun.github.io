---
title: "Nexus Installation (Docker)"
sequence: "103"
---

## 安装部署

第一步，启动`sonatype/nexus3`：

```text
$ sudo mkdir /opt/nexus-data
$ sudo chown -R 200 /opt/nexus-data
$ docker run -d -p 8081:8081 --name nexus3 -v /opt/nexus-data:/nexus-data sonatype/nexus3
```

在上面的命令中 `chown -R 200 /opt/nexus-data` 中有一个 `200`，这是 `sonatype/nexus3` 启动后 `nexus` 用户的 ID：

```text
$ docker exec -it nexus3 /bin/bash

bash-4.4$ whoami
nexus

bash-4.4$ id
uid=200(nexus) gid=200(nexus) groups=200(nexus)

bash-4.4$ cat /etc/passwd | grep nexus
nexus:x:200:200:Nexus Repository Manager user:/opt/sonatype/nexus:/bin/false
```

第二步，替换 `license-bundle-1.6.0.jar` 文件：

```text
$ docker cp ~/license-bundle-1.6.0.jar nexus3:/opt/sonatype/nexus/system/com/sonatype/licensing/license-bundle/1.6.0/
```

第三步，编辑 `<data-dir>/etc/nexus.properties` 文件：

```text
$ sudo vi /opt/nexus-data/etc/nexus.properties
```

添加如下内容：

```text
nexus.loadAsOSS=false
```

第四步，重启 Docker 容器：

```text
$ docker restart nexus3
```

## 用户设置

第一步，用浏览器访问：

```text
http://192.168.80.130:8081
```

![](/assets/images/nexus3/sonatype-nexus-repository-pro.png)

![](/assets/images/nexus3/nexus-data-admin-password.png)

从 `Host` 上查看 `admin.password`：

```text
$ cat /opt/nexus-data/admin.password
```

从容器中进行查看：

```text
docker exec <container-name-or-id> cat /nexus-data/admin.password
```

```text
$ docker exec nexus3 cat /nexus-data/admin.password
```

## 进入容器


使用 `root` 用户进入容器：

```text
$ docker exec -it --user=root nexus3 /bin/bash
```

```text
# cd /opt/sonatype/nexus/bin/
# ./nexus run

# cd /opt/sonatype/nexus/bin/
# ./nexus stop


```


## 其它


```text
jar -uvf license-bundle-1.6.0.jar org/sonatype/licensing/trial/internal/DefaultTrialLicenseManager.class
```

```text
jar -uvf nexus-bootstrap-3.40.1-01.jar org/sonatype/nexus/bootstrap/osgi/BootstrapListener.class
```

替换Jar包：

```text
nexus-3.xx.x/system/com/sonatype/licensing/license-bundle/1.6.0/license-bundle-1.6.0.jar
```

To downgrade a Nexus Repository Manager (NXRM) 3 PRO instance to OSS:

- Gracefully stop NXRM.
- Open the file `<data-dir>/etc/nexus.properties` in a text editor.
- Add a new line to the file containing:

```text
nexus.loadAsOSS=true
```

```text
nexus.loadAsOSS=false
```

在docker环境下，破解Nexus Repository：
第一步，通过docker安装nexus
第二步，以root用户启动nexus，替换/opt/sonatype/nexus/system/com/sonatype/licensing/license-bundle/1.6.0/license-bundle-1.6.0.jar
第三步，关闭nexus，修改`<data-dir>/etc/nexus.properties`文件，添加`nexus.loadAsOSS=false`配置
第四步，重新启动Nexus
