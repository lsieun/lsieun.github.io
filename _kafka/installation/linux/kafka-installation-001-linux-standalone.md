---
title: "Kafka 单机环境（Linux）"
sequence: "101"
---

## 前提

- 安装 [JDK 8]({% link _centos/software/centos-7-mini-jdk08.md %})
- 安装 [Scala]({% link _centos/software/centos-7-scala.md %})
- 关闭防火墙

```text
$ sudo systemctl disable --now firewalld
```

## 安装 Kafka

### 下载

```text
https://kafka.apache.org/downloads
```

下载地址：

```text
https://downloads.apache.org/kafka/3.6.1/kafka_2.13-3.6.1.tgz
https://downloads.apache.org/kafka/3.6.1/kafka_2.12-3.6.1.tgz
```

在安装包 `kafka_2.12-3.6.1.tgz` 和 `kafka_2.13-3.6.1.tgz` 的命名中，

- `2.12` 或 `2.13` 表示 Scala 的版本。
- `3.6.1` 表示 Kafka 的版本

由于 Kafka 是使用 Scala 语言来编写的，因此在下载 Kafka 的时候，会让我们选择 Scala 语言的版本。
只需要与本地的 Scala 版本相符的 Kafka 即可。

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
$ tar -zxvf kafka*.tgz -C /opt/module/
```

解压之后的完整路径为：`/opt/module/kafka*`。

```bash
$ cd /opt/module/

# 第 1 种方式，创建软连接
$ ln -s kafka*/ kafka

# 第 2 种方式，移动目录
$ mv kafka* kafka
```

### 修改配置

第 1 步，添加配置信息：

- 第一种方式，修改 `sudo vi /etc/profile` 文件
- 第二种方式，添加 `sudo vi /etc/profile.d/my_env.sh` 文件

添加如下内容：

```bash
KAFKA_HOME=/opt/kafka
PATH=$PATH:$KAFKA_HOME/bin

export PATH KAFKA_HOME
```

第 2 步，重新加载配置文件：

```text
$ source /etc/profile
```

## 测试

### ZooKeeper 服务端

Kafka 严重依赖 ZooKeeper，所以我们在启动 Kafka 之前，需要启动 ZooKeeper 服务。
Kafka 提供了快速使用 ZooKeeper 服务，解压之后，其根目录下的 `bin` 目录 ZooKeeper 的启动和停止服务，
但仅适用于单机模式（ZooKeeper也是单例）。

多 Broker 模式，强烈建议使用自行部署的 ZooKeeper。

```text
$ ls -l zookeeper*
-rwxr-xr-x. 1 root root  867 Nov 24 17:38 zookeeper-security-migration.sh
-rwxr-xr-x. 1 root root 1393 Nov 24 17:38 zookeeper-server-start.sh
-rwxr-xr-x. 1 root root 1366 Nov 24 17:38 zookeeper-server-stop.sh
-rwxr-xr-x. 1 root root 1019 Nov 24 17:38 zookeeper-shell.sh
```

第 1 步，启动：

```text
$ cd /opt/module/kafka/
$ bin/zookeeper-server-start.sh -daemon ./config/zookeeper.properties
```

第 2 步，查看进程：

```text
$ jps
3973 QuorumPeerMain    # ZooKeeper 的进程
4425 Jps
```

### ZooKeeper 客户端

```text
$ cd /opt/module/kafka/
$ bin/zookeeper-shell.sh localhost:2181
```

```text
ls /
[admin, brokers, cluster, config, consumers, controller, controller_epoch, feature,
 isr_change_notification, latest_producer_id_block, log_dir_event_notification, zookeeper]
 
 ls /brokers
[ids, seqid, topics]

ls /brokers/ids
[0]
```

### Kafka 服务端

第 1 步，启动：

```text
$ cd /opt/module/kafka/
$ bin/kafka-server-start.sh -daemon ./config/server.properties
```

停止 Kafka：

```text
$ cd /opt/module/kafka/
$ bin/kafka-server-stop.sh
```

第 2 步，查看进程：

启动之后，可以使用 `jps` 查看当前节点的进程。如果出现名为 `Kafka` 的进程，说明 Kafka 的单机版本搭建完成。

```text
$ jps
4929 Jps
3973 QuorumPeerMain
4446 Kafka    # Kafka 的进程
```

### Kafka 客户端

注意：关闭防火墙。

第 1 步，创建一个名为 test 的主题：

```text
$ cd /opt/module/kafka/
$ bin/kafka-topics.sh \
--bootstrap-server localhost:9092 \
--create \
--topic my-favorite-topic \
--partitions 1 \
--replication-factor 1
```

在 Kafka 中，消息是需要存储于主题中，Producer 会将消息写入到指定的 Topic 中，而 Consumer 会从指定的 Topic 中读取数据。

第 2 步，查看所有的主题列表：

```text
$ bin/kafka-topics.sh \
--bootstrap-server localhost:9092 \
--list
```

第 3 步，发送消息

Kafka 自带一个命令客户端（Client）。它将从文件或标准输入中获取输入，

运行 Producer，然后输入一些信息到控制台并发送到服务器：

```text
$ cd /opt/module/kafka/
$ bin/kafka-console-producer.sh \
--bootstrap-server localhost:9092 \
--topic my-favorite-topic
> this is a message
> this is another message
```

第 4 步，消费消息

Kafka 有一个消费者客户端命令，它可以转存消息到标准输出：

```text
$ cd /opt/module/kafka/
$ bin/kafka-console-consumer.sh \
--bootstrap-server localhost:9092 \
--topic my-favorite-topic \
--from-beginning
```
