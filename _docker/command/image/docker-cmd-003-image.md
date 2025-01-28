---
title: "Image: search + pull + rmi"
sequence: "103"
---

镜像命令：

- docker images：列出本地主机上的镜像
- docker search 某个镜像名字
    - `docker search --limit 5 redis`
- docker pull 某个镜像名字
    - `docker pull hello-world`
    - `docker pull ubuntu`
    - `docker pull redis:7.2.3`
- docker system df 查看镜像/容器/数据卷所占的空间
- docker rmi 某个镜像名字 ID：删除
    - `docker rmi -f <镜像 ID>`
    - `docker rmi -f <镜像名1:TAG> <镜像名2:TAG>`
    - `docker rmi -f ${docker images -qa}`

```text
$ docker image --help

Usage:  docker image COMMAND

Manage images

Commands:
  build       Build an image from a Dockerfile
  history     Show the history of an image
  import      Import the contents from a tarball to create a filesystem image
  inspect     Display detailed information on one or more images
  load        Load an image from a tar archive or STDIN
  ls          List images
  prune       Remove unused images
  pull        Download an image from a registry
  push        Upload an image to a registry
  rm          Remove one or more images
  save        Save one or more images to a tar archive (streamed to STDOUT by default)
  tag         Create a tag TARGET_IMAGE that refers to SOURCE_IMAGE
```

## docker search

```text
$ docker search nginx
```

## docker image

列出本地主机上的镜像

```text
$ docker images
REPOSITORY                                         TAG            IMAGE ID       CREATED        SIZE
mysql                                              8.0.33         c71276df4a87   4 days ago     565MB
eclipse-temurin                                    17-jdk-jammy   50440189b0f4   7 days ago     456MB
```

```text
# 注意，这里的 image 是单数
$ docker image ls
REPOSITORY                                         TAG            IMAGE ID       CREATED        SIZE
mysql                                              8.0.33         c71276df4a87   4 days ago     565MB
eclipse-temurin                                    17-jdk-jammy   50440189b0f4   7 days ago     456MB
```

{% highlight text%}
{% raw %}
$ docker image ls --format "table {{.Repository}} {{.Tag}}"
REPOSITORY      TAG
mysql           8.0.33
eclipse-temurin 17-jdk-jammy
{% endraw %}
{% endhighlight %}

```text
$ docker images
REPOSITORY      TAG       IMAGE ID       CREATED       SIZE
hello-world     latest    9c7a54a9a43c   5 weeks ago   13.3kB
elasticsearch   7.17.10   a305059888ba   7 weeks ago   622MB
kibana          7.17.10   ba4afcebad69   7 weeks ago   811MB
```

{% highlight text%}
{% raw %}
$ docker images --format "{{.Repository}}:{{.Tag}}"
hello-world:latest
elasticsearch:7.17.10
kibana:7.17.10
{% endraw %}
{% endhighlight %}


添加一个 `alias`：

{% highlight text%}
{% raw %}
$ vi ~/.bashrc
alias docker-images='docker images --format "{{.Repository}}:{{.Tag}}"'
{% endraw %}
{% endhighlight %}

{% highlight text%}
{% raw %}
$ docker images --format "{{.Repository}}:{{.Tag}}" | grep docker.lan.net | xargs docker rmi
{% endraw %}
{% endhighlight %}

## Pull

```text
$ docker pull nginx:latest
```

### 特殊字符

在使用 `docker pull` 命令下载镜像时，如果镜像名称中包含连字符（`-`），需要进行特殊处理以避免与命令参数混淆。
可以通过在镜像名称之前加上双引号（`"`）或反斜杠（`\`）来解决该问题。

以下是两种处理方法：

1. 使用双引号（`"`）：

```text
docker pull "镜像名"
```

例如，如果要下载名为 `my-image` 的镜像，可以运行：

 ```text
 docker pull "my-image"
 ```

2. 使用反斜杠（`\`）：

```text
docker pull 镜像名\
```

例如，如果要下载名为 `my-image` 的镜像，可以运行：

```text
docker pull my-image\
```

这些方法可以确保在含有连字符的镜像名称中正确解析 `-` 符号，使 Docker 命令不会将其解释为参数选项。
记得使用适当的镜像名称替换 `"镜像名"` 或 `镜像名\` 部分。

## Delete

注意：`rmi` 是 remove image 的缩写。

```text
$ docker rmi java-docker:v1.0.0
```

{% highlight text%}
{% raw %}
$ docker images --format "{{.Repository}}:{{.Tag}}" | xargs docker rmi
{% endraw %}
{% endhighlight %}

{% highlight text%}
{% raw %}
$ docker images --format "{{.Repository}}:{{.Tag}}" | grep docker.lan.net | xargs docker rmi
{% endraw %}
{% endhighlight %}

## History

```text
$ docker image history busybox:latest
```
