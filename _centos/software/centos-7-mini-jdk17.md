---
title: "Java 17: CentOS 7 Mini"
sequence: "jdk17"
---

## 下载地址

```text
https://www.oracle.com/java/technologies/downloads/
```

## 解压

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

```bash
$ sudo tar -zxvf jdk-*.tar.gz -C /opt
```

解压之后的完整路径为：`/usr/local/jdk-17.0.1`。

```bash
$ cd /opt/
$ sudo ln -s jdk-17.*/ jdk17
```

## 修改配置

第 1 步，添加配置信息：

- 第一种方式，修改 `sudo vi /etc/profile` 文件
- 第二种方式，添加 `sudo vi /etc/profile.d/my_env.sh` 文件

添加如下内容：

```bash
JAVA_HOME=/opt/jdk17
PATH=$JAVA_HOME/bin:$PATH
export JAVA_HOME PATH
```

第 2 步，重新加载配置文件：

```bash
$ source /etc/profile
```

第 3 步，验证：

```bash
java -version
javac -version
```

```text
$ vim ~/.bashrc
# User specific aliases and functions
alias java08=/usr/local/jdk08/bin/java
alias java11=/usr/local/jdk11/bin/java
alias java17=/usr/local/jdk17/bin/java
alias javac08=/usr/local/jdk08/bin/javac
alias javac11=/usr/local/jdk11/bin/javac
alias javac17=/usr/local/jdk17/bin/javac
```
