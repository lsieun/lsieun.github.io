---
title: "Docker Data Volumes"
sequence: "104"
---

映射 Volume 过程中，一般考虑三个方面：

- 配置 conf
- 数据 data
- 日志 log
- 其它
    - 插件 plugins

## privileged

容器卷记得加入：

```text
--privileged=true
```

Docker挂载主机目录访问，如果出现

```text
cannot open directory: Permission denied
```

解决方法：在挂载目录后，多加一个`--privileged=true`参数即可。

使用该参数，container内的root拥有真正的root权限；否则，container内的root只是外部的一个普通用户权限。

如果是CentOS 7，安全模块会比之前系统版本加强，不安全的会先禁止，所以目录挂载的情况被默认认为不安全的行为。

## 示例

命令：

```text
docker run -it --privileged=true -v /宿主机绝对路径目录:/容器内目录 镜像名
```

示例：

```text
docker run -it --name myUbuntu --privileged=true -v /tmp/myHostData:/tmp/myDockerData ubuntu /bin/bash
```

查看数据卷是否挂载成功：

```text
docker inspect myUbuntu
```

输出内容（相关部分）：

```text
"Mounts": [
    {
        "Type": "bind",
        "Source": "/tmp/myHostData",
        "Destination": "/tmp/myDockerData",
        "Mode": "",
        "RW": true,
        "Propagation": "rprivate"
    }
]
```

容器和宿主机之间数据共享：

```text

```

特点：

- 数据卷，可在容器之间共享或重用数据
- 数据卷中的更改，
    - 可以直接实时生效
    - 但是不会包含在镜像的更新中
- 数据卷的生命周期，一直持续到没有容器使用它为止。

## 读写规则

容器卷ro和rw读写规则

### 读写（默认）

注意，下面的命令多了一个`:rw`：

```text
docker run -it --privileged=true -v /宿主机绝对路径目录:/容器内目录:rw 镜像名
```

在默认情况下，就是`rw`。

## 只读

如果容器实例内部被限制，只能读取，不能写：

```text
docker run -it --privileged=true -v /宿主机绝对路径目录:/容器内目录:ro 镜像名
```

如果在容器内添加文件，会提示`Read-only file system`信息：

```text
# touch hello.txt
touch: cannot touch 'hello.txt': Read-only file system
```

## 卷的继承和共享

学习重点：`--volumes-from`

命令：

```text
docker run -it --privileged=ture --volumes-from 父类 --name myUbuntu3 ubuntu
```

示例：

```text
docker run -it --privileged=ture --volumes-from myUbuntu2 --name myUbuntu3 ubuntu
```

如果`myUbuntu2`关闭了，那么`myUbuntu3`从`myUbuntu`继承的卷仍然是有效的：因为继承的是映射规则。

## Reference

- [How To Work with Docker Data Volumes on Ubuntu 14.04](https://www.digitalocean.com/community/tutorials/how-to-work-with-docker-data-volumes-on-ubuntu-14-04)
- [How To Share Data between Docker Containers](https://www.digitalocean.com/community/tutorials/how-to-share-data-between-docker-containers)
