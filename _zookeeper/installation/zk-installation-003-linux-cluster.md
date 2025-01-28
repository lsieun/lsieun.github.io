---
title: "ZooKeeper 集群环境（Linux）"
sequence: "103"
---

## 集群规划

服务器规划：

| Server  | IP             |
|---------|----------------|
| server1 | 192.168.80.131 |
| server2 | 192.168.80.132 |
| server3 | 192.168.80.133 |

## 准备工作

第 1 步，关闭防火墙（所有服务器）：

```text
$ sudo systemctl disable --now firewalld
```

第 2 步，配置 `/etc/hosts`（所有服务器）：

```text
$ sudo tee -a /etc/hosts <<EOF
192.168.80.131 server1
192.168.80.132 server2
192.168.80.133 server3
EOF
```

第 3 步，配置免密登录（所有服务器） [Link]({% link _linux/network/cluster/linux-cluster-001-ssh-login-without-password.md %})

第 4 步，集群分发脚本（所有服务器） [Link]({% link _linux/network/cluster/linux-cluster-002-xsync.md %})

第 5 步，安装 JDK 环境（所有服务器） [Link]({% link _centos/software/centos-7-mini-jdk08.md %})

## 集群环境搭建

### 下载

```text
https://zookeeper.apache.org/releases.html
```

```text
https://www.apache.org/dyn/closer.lua/zookeeper/zookeeper-3.9.1/apache-zookeeper-3.9.1-bin.tar.gz
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
$ cd /opt/software/
$ tar -zxvf apache-zookeeper-*.tar.gz -C /opt/module/
```

第 4 步，创建软连接：

```text
$ cd /opt/module/

# 第 1 种方式，创建软连接
$ ln -s apache-zookeeper*/ zookeeper

# 第 2 种方式，移动目录
$ mv apache-zookeeper*/ zookeeper
```

### 修改配置

第 1 步，创建 ZK 存储数据和日志目录：

```text
mkdir -p /opt/module/zookeeper/{data,logs}
```

第 2 步，修改 ZK 配置文件：

```text
$ cd /opt/module/zookeeper/conf/
$ cp zoo_sample.cfg zoo.cfg
```

第 3 步，编辑 `zoo.cfg` 文件：

```text
vi zoo.cfg
```

```text
# 更新数据目录
dataDir=/opt/module/zookeeper/data
# 增加日志目录
dataLogDir=/opt/module/zookeeper/logs
# 增加集群配置
## server.服务器ID=服务器IP地址:服务器之间通信端口:服务器之间投票选举端口
server.1=server1:2888:3888
server.2=server2:2888:3888
server.3=server3:2888:3888
# 打开注释
# ZK 提供了自动清理事务日志和快照文件的功能，这个参数指定了清理频率，单位是小时
autopurge.purgeInterval=1
```

第 4 步，添加 `myid` 配置

在 `zookeeper` 的 `data` 目录下创建一个 `myid` 文件，内容为 `1`，这个文件就是记录每个服务器的 ID：

```text
$ cd /opt/module/zookeeper/data

# server1
$ echo 1 > myid
```

第 5 步，安装包分发并修改 `myid` 的值：

```text
$ xsync /opt/module/apache-zookeeper-3.8.3-bin/
$ xsync /opt/module/zookeeper
```

注意：修改 `mypid` 的值

```text
# server2
$ echo 2 > myid

# server3
$ echo 3 > myid
```

### 一键脚本

File: `install-zk.sh`

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
cd /opt/software/
tar -zxvf apache-zookeeper-*.tar.gz -C /opt/module/

# 解压之后的目录
cd /opt/module/
mv apache-zookeeper*/ zookeeper

# 配置文件
cd /opt/module/zookeeper/conf/
cp zoo_sample.cfg zoo.cfg

# 创建 ZK 存储数据和日志目录
mkdir -p /opt/module/zookeeper/{data,logs}
cd /opt/module/zookeeper/data
echo 1 > myid
```

再编辑 `zoo.zoo.cfg`

## 启动 ZK

### 命令行启动

第 1 步，三台服务器上，依次启动三个 ZK 实例

```text
$ /opt/module/zookeeper/bin/zkServer.sh start
```

第 2 步，查看 ZK 启动是否成功：

```text
$ /opt/module/zookeeper/bin/zkServer.sh status
```

### 集群脚本

目标：编写一个脚本，对集群中的 ZK 进行启动、停止、查看状态。

第 1 步，编写 `zk.sh` 文件：

```text
$ vi ~/bin/zk.sh
```

```bash
#!/bin/bash

if(($# == 0)); then
    echo "Usage: zk.sh [start|stop|status]";
    exit;
fi

hosts="server1 server2 server3"

for host in $hosts
do
    echo "========= ${host} ========="
    ssh $host "source /etc/profile; /opt/module/zookeeper/bin/zkServer.sh $1"
done
```

第 2 步，添加执行权限：

```text
$ chmod u+x ~/bin/zk.sh
```

第 3 步，执行命令：

```text
$ zk.sh start
$ zk.sh stop
$ zk.sh status
```

