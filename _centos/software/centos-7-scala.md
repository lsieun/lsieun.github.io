---
title: "Scala"
sequence: "scala"
---

## 前提

需要先安装 [JDK 8]({% link _centos/software/centos-7-mini-jdk08.md %})

## 安装 Scala

### 下载

```text
https://scala-lang.org/download/all.html
```

```text
wget https://downloads.lightbend.com/scala/2.13.12/scala-2.13.12.tgz
wget https://downloads.lightbend.com/scala/2.12.18/scala-2.12.18.tgz
```

### 解压

第 1 步，创建目录：

```text
$ sudo mkdir -p /opt/{module,software}
$ sudo chown $USER: -R /opt/{module,software}
```

第 2 步，上传压缩包：

```text
$ cd /opt/software/
$ sudo yum -y install lrzsz
$ rz -y
```

第 3 步，解压：

```text
$ tar -zxvf scala-*.tgz -C /opt/module/
```

解压之后的完整路径为：`/opt/module/scala-*`。

```text
$ cd /opt/module/

# 第 1 种方式，创建软连接
$ ln -s scala-*/ scala

# 第 2 种方式，移动目录
$ mv scala-* scala
```

### 修改配置

第 1 步，添加配置信息：

- 第一种方式，修改 `sudo vi /etc/profile` 文件
- 第二种方式，添加 `sudo vi /etc/profile.d/my_env.sh` 文件

添加如下内容：

```text
SCALA_HOME=/opt/module/scala
PATH=$PATH:$SCALA_HOME/bin

export PATH SCALA_HOME
```

第 2 步，重新加载配置文件：

```text
$ source /etc/profile
```

第 3 步，验证：

```text
$ scala -version
```

## 一键脚本

File: `install-scala.sh`

```bash
#!/bin/bash

# 创建目录
sudo mkdir -p /opt/{module,software}
sudo chown $USER: -R /opt/{module,software}

# 上传JDK的tar包
cd /opt/software/
sudo yum -y install lrzsz
rz -y

# 解压JDK的tar包
tar -zxvf scala-*.tgz -C /opt/module/

# 解压之后的目录
cd /opt/module/
mv scala-* scala

# 配置环境变量
sudo tee -a /etc/profile.d/my_env.sh <<'EOF'
SCALA_HOME=/opt/module/scala
PATH=$PATH:$SCALA_HOME/bin
export PATH SCALA_HOME
EOF

# 更新当前会话的环境变量
source /etc/profile

# 测试
scala -version
```
