---
title: "Java 08: CentOS 7 Mini"
sequence: "jdk08"
---

## 安装 JDK

### 下载

```text
https://www.oracle.com/java/technologies/downloads/
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

```bash
tar -zxvf jdk-8u*.tar.gz -C /opt/module/
```

解压之后的完整路径为：`/opt/module/jdk*`。

```bash
$ cd /opt/module/

# 第 1 种方式，创建软连接
$ ln -s jdk*/ jdk

# 第 2 种方式，移动目录
$ mv jdk* jdk
```

### 修改配置

第 1 步，添加配置信息：

- 第一种方式，修改 `sudo vi /etc/profile` 文件
- 第二种方式，添加 `sudo vi /etc/profile.d/my_env.sh` 文件

添加如下内容：

```bash
JAVA_HOME=/opt/module/jdk
PATH=$PATH:$JAVA_HOME/bin

export PATH JAVA_HOME
```

第 2 步，重新加载配置文件：

```bash
source /etc/profile
```

第 3 步，验证：

```bash
java -version
javac -version
```

## 一键脚本

File: `install-jdk.sh`

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
tar -zxvf jdk*.tar.gz -C /opt/module/

# 解压之后的目录
cd /opt/module/
mv jdk* jdk

# 配置环境变量
sudo tee -a /etc/profile.d/my_env.sh <<'EOF'
JAVA_HOME=/opt/module/jdk
PATH=$PATH:$JAVA_HOME/bin
export PATH JAVA_HOME
EOF

# 更新当前会话的环境变量
source /etc/profile

# 测试
java -version
```
