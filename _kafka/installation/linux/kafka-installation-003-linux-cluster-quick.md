---
title: "Kafka 集群环境-快速（Linux）"
sequence: "103"
---

## 集群规划

![](/assets/images/kafka/kafka-cluster-servers.png)

具体信息：

| Server  | IP             | Role   |
|---------|----------------|--------|
| server1 | 192.168.80.131 | Broker |
| server2 | 192.168.80.132 | Broker |
| server3 | 192.168.80.133 | Broker |

## 集群环境

### server1

```text
sudo yum -y install lrzsz
```

```text
mkdir -p ~/bin
cd ~/bin/
rz -y
```

```text
$ bash ~/bin/env-prepare-3-servers.sh
```

```text
$ bash ~/bin/ssh-login-without-password.sh
```

```text
$ bash ~/bin/install-xsync.sh
```

```text
$ bash ~/bin/sudo-yum-install.sh rsync
```

```text
$ xsync ~/bin/
```

### server2

```text
$ ssh server2
```

```text
$ bash ~/bin/env-prepare-3-servers.sh
```

```text
$ bash ~/bin/ssh-login-without-password.sh
```

### server2

```text
$ ssh server3
```

```text
$ bash ~/bin/env-prepare-3-servers.sh
```

```text
$ bash ~/bin/ssh-login-without-password.sh
```

## JDK

### server1

```text
cd /opt/software/
rz -y
```

```text
$ xsync /opt/software/
```

```text
$ bash ~/bin/install-jdk.sh
```

### server2

```text
ssh server2
```

```text
$ bash ~/bin/install-jdk.sh
```

### server3

```text
ssh server3
```

```text
$ bash ~/bin/install-jdk.sh
```

## Scala

### server1

```text
cd /opt/software/
rz -y
```

```text
$ xsync /opt/software/
```

### all

```text
$ bash ~/bin/install-scala.sh
```

## ZooKeeper

### server1

```text
cd /opt/software/
rz -y
```

```text
$ xsync /opt/software/
```

### all

```text
$ bash ~/bin/install-zk.sh
```

```text
$ chmod u+x ~/bin/zk-cluster.sh
```

### server1
