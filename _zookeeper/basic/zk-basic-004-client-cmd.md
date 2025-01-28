---
title: "客户端（命令行）"
sequence: "104"
---

## 连接

进入 ZooKeeper 的 `bin` 目录后，有一个 `zkCli.sh` 文件：

```text
# 连接本地的 ZooKeeper 服务器
./zkCli.sh

# 连接指定的服务器
./zkCli.sh -server ip:port
```

```text
$ ./zkCli.sh -server 192.168.80.131:2181
```

连接成功之后，系统会输出 ZooKeeper 的相关环境及配置信息等内容。

输入 `help` 之后，会输出可用的 ZooKeeper 命令：

```text
ZooKeeper -server host:port -client-configuration properties-file cmd args
	addWatch [-m mode] path # optional mode is one of [PERSISTENT, PERSISTENT_RECURSIVE] - default is PERSISTENT_RECURSIVE
	addauth scheme auth
	close 
	config [-c] [-w] [-s]
	connect host:port
	create [-s] [-e] [-c] [-t ttl] path [data] [acl]
	delete [-v version] path
	deleteall path [-b batch size]
	delquota [-n|-b|-N|-B] path
	get [-s] [-w] path
	getAcl [-s] path
	getAllChildrenNumber path
	getEphemerals path
	history 
	listquota path
	ls [-s] [-w] [-R] path
	printwatches on|off
	quit 
	reconfig [-s] [-v version] [[-file path] | [-members serverID=host:port1:port2;port3[,...]*]] | [-add serverId=host:port1:port2;port3[,...]]* [-remove serverId[,...]*]
	redo cmdno
	removewatches path [-c|-d|-a] [-l]
	set [-s] [-v version] path data
	setAcl [-s] [-v version] [-R] path acl
	setquota -n|-b|-N|-B val path
	stat [-w] path
	sync path
	version 
	whoami
```

## 命令

- `quit`：退出

```text
ls /
[zookeeper]

get /zookeeper 

ls /zookeeper 
[config, quota]

get /zookeeper/config 
server.1=server1:2888:3888:participant
server.2=server2:2888:3888:participant
server.3=server3:2888:3888:participant
version=0

get /zookeeper/quota 
```

### 创建节点

使用 `create` 命令，可以创建一个 ZNode 节点：

```text
create [-s] [-e] [-c] [-t ttl] path [data] [acl]
```

其中，

- `-s` 和 `-e` 用于指定节点特性
    - `-s`：表示**顺序**节点
    - `-e`：表示**临时**节点；若不指定，则创建持久节点

#### 创建顺序节点

```text
create -s /zk-sequence 123
```

```text
> create -s /zk-sequence 123
Created /zk-sequence0000000001

> ls /
[zk-sequence0000000001, zookeeper]

> get /zk-sequence0000000001 
123

> stat /zk-sequence0000000001 
cZxid = 0x300000008
ctime = Mon Dec 25 18:18:40 CST 2023
mZxid = 0x300000008
mtime = Mon Dec 25 18:18:40 CST 2023
pZxid = 0x300000008
cversion = 0
dataVersion = 0
aclVersion = 0
ephemeralOwner = 0x0
dataLength = 3
numChildren = 0
```

执行之后，就在根节点下创建一个叫做 `zk-sequence` 的节点，该节点内容是 `123`；
同时，可以看到创建的 `zk-sequence` 节点后面添加了一串数字以示区别。

#### 创建临时节点

```text
> create -e /zk-temp 123
Created /zk-temp

> ls /
[zk-sequence0000000001, zk-temp, zookeeper]
```

临时节点在客户端会话结束后，就会自动删除。

可以使用 `quit` 命令退出客户端，再次连接，会发现 `zk-temp` 被移除了：

```text
ls /
[zk-sequence0000000001, zookeeper]
```

#### 创建永久节点

**永久节点**不同于**顺序节点**，不会自动在后面添加一串数字：

```text
> create /zk-permanent 123
Created /zk-permanent

> ls /
[zk-permanent, zk-sequence0000000001, zookeeper]
```

### 读取节点

与读取相关的命令有 `ls` 命令和 `get` 命令

```text
ls [-s] [-w] [-R] path
```

```text
> ls /
[zk-permanent, zk-sequence0000000001, zookeeper]
```

```text
get [-s] [-w] path
```

```text
> get /zk-permanent 
123
```

```text
stat [-w] path
```

```text
> stat /zk-permanent 
cZxid = 0x30000000c
ctime = Mon Dec 25 19:03:11 CST 2023
mZxid = 0x30000000c
mtime = Mon Dec 25 19:03:11 CST 2023
pZxid = 0x30000000c
cversion = 0
dataVersion = 0
aclVersion = 0
ephemeralOwner = 0x0
dataLength = 3
numChildren = 0
```

### 更新节点

使用 `set` 命令，可以更新指定节点的数据内容：

```text
set [-s] [-v version] path data
```

```text
> set /zk-permanent 456
> get /zk-permanent 
456
> stat /zk-permanent 
cZxid = 0x30000000c
ctime = Mon Dec 25 19:03:11 CST 2023
mZxid = 0x30000000d
mtime = Mon Dec 25 19:19:46 CST 2023
pZxid = 0x30000000c
cversion = 0
dataVersion = 1    # 注意，这里变化了
aclVersion = 0
ephemeralOwner = 0x0
dataLength = 3
numChildren = 0
```

### 删除节点

使用 `delete` 命令可以删除 ZooKeeper 上的指定节点：

```text
delete [-v version] path
```

```text
> ls /
[zk-permanent, zk-sequence0000000001, zookeeper]
> delete /zk-permanent 
> ls /
[zk-sequence0000000001, zookeeper]
```

值得注意的是，**若删除节点存在子节点，那么无法删除该节点，必须先删除子节点，再删除父节点**。
