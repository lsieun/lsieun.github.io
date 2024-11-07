---
title: "Kafka 集群环境（Linux）"
sequence: "102"
---

## 集群规划

![](/assets/images/kafka/kafka-cluster-servers.png)

具体信息：

| Server  | IP             | Role   |
|---------|----------------|--------|
| server1 | 192.168.80.131 | Broker |
| server2 | 192.168.80.132 | Broker |
| server3 | 192.168.80.133 | Broker |



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

第 6 步，安装 Scala 环境（所有服务器） [Link]({% link _centos/software/centos-7-scala.md %})

第 7 步，安装 ZooKeeper 集群环境 [Link]({% link _zookeeper/installation/zk-installation-003-linux-cluster.md %})


## 安装 Kafka

### 安装目录

创建目录：

```text
sudo mkdir -p /opt/{module,software}
sudo chown $USER: -R /opt/{module,software}
```

### 上传 tar 包

上传tar包：

```text
cd /opt/software/
sudo yum -y install lrzsz
rz -y
```

### 脚本安装

第 1 步，编写 Bash 脚本： `~/bin/install-kafka.sh`

```text
#!/bin/bash

# 解压tar包
cd /opt/software/
tar -zxvf kafka*.tgz -C /opt/module/

# 解压之后的目录
cd /opt/module/
mv kafka* kafka

# 创建数据目录
mkdir -p /opt/module/kafka/data

# 配置环境变量
sudo tee -a /etc/profile.d/my_env.sh <<'EOF'
KAFKA_HOME=/opt/module/kafka
PATH=$PATH:$KAFKA_HOME/bin
export PATH KAFKA_HOME
EOF

```

第 2 步，执行：

```text
$ bash ~/bin/install-kafka.sh
```

第 3 步，更新当前会话的环境变量


```text
source /etc/profile
```

### 修改配置文件

第 1 步，修改配置文件：`$KAFKA_HOME/config/server.properties`

```text
# 当前 Kafka 实例的 ID，必须是整数，且在整个集群中不能重复。
broker.id=1

# Kafka 保存数据的目录，需要手动创建
log.dirs=/opt/module/kafka/data

# Kafka 元数据在 ZooKeeper 存储
# 最后的 /kafka 表示在 ZooKeeper 的根下创建 kafka 节点，管理所有 Kafka 的元数据
zookeeper.connect=server1:2181,server2:2181,server3:2181/kafka
```

第 2 步，将修改配置文件之后的 Kafka 发送到其它的节点

```text
$ xsync /opt/module/kafka/
```

第 3 步，到另外两个节点上修改 `$KAFKA_HOME/config/server.properties` 的 `broker.id` 值：

- 将 `server2` 上的 `broker.id` 修改为 `2`
- 将 `server3` 上的 `broker.id` 修改为 `3`

## 启动 Kafka

第 1 步，启动 ZooKeeper

第 2 步，启动 Kafka：

```text
$ cd /opt/module/kafka/
$ bin/kafka-server-start.sh -daemon ./config/server.properties
```

第 3 步，停止 Kafka：

```text
$ bin/kafka-server-stop.sh
```

## 脚本

File: `kafka.sh`

```bash
#!/bin/bash

COMMAND=$1

USAGE="kafka-cluster.sh [start|stop]"
if [ ! $COMMAND ]
then
    echo "${USAGE}"
    exit -1
fi

if [ $COMMAND != "start" -a $COMMAND != "stop" ]; then
    echo "${USAGE}"
    exit -1
fi

# 设置 Kafka 安装路径
KAFKA_HOME=/opt/module/kafka

# 节点数组
HOSTS=("server1" "server2" "server3")
for HOST in ${HOSTS[*]}; do
    msg="${HOST}..."
  
    ssh -T $HOST << EOF
    if [ $COMMAND == "start" ]; then
        $KAFKA_HOME/bin/kafka-server-start.sh -daemon $KAFKA_HOME/config/server.properties
    elif [ $COMMAND == "stop" ]; then
        $KAFKA_HOME/bin/kafka-server-stop.sh
    fi
EOF
    
    msg="${msg}done!"
    echo "${msg}"
done
```
