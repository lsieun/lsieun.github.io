---
title: "Redis Installation: Linux"
sequence: "102"
---

## 源码安装

Redis has no dependencies other than a C compiler and `libc`.

### 环境准备

安装软件：

```text
sudo yum -y install wget gcc make tcl
```

- `wget`: A utility for retrieving files using the HTTP or FTP protocols
- `gcc`: Various compilers (C, C++, Objective-C, Java, ...)
- `make`: A GNU tool which simplifies the build process for users
- `tcl`: Tool Command Language, pronounced tickle

### 下载源码包

下载 Redis 源码包：

```text
wget https://download.redis.io/redis-stable.tar.gz
```

### 编译

第 1 步，解压：

```text
tar -zxvf redis-stable.tar.gz
```

第 2 步，编译 Redis：

```text
cd redis-stable
make
```

需要等待比较长的时间，编译完成后，会看到如下信息：

```text
Hint: It's a good idea to run 'make test' ;)

make[1]: Leaving directory `/.../redis-stable/src'
```

在编译完成后，在 `redis-stable/src` 目录下有两个重要文件：

- `redis-server`: the Redis Server itself
- `redis-cli`: the command line interface utility to talk with Redis.

### 安装

第一种方式，在默认情况下，安装到 `/usr/local/bin` 目录：

```text
sudo make install
sudo mkdir -p /etc/redis
```

第二种方式，安装到指定目录：

```text
$ sudo mkdir -p /opt/redis
$ sudo make install PREFIX=/opt/redis
```

```text
$ sudo mkdir -p /opt/redis/conf/
$ sudo cp -p ~/redis-stable/redis.conf /opt/redis/conf/
```

### 配置环境变量

第 1 步，编辑 `/etc/profile` 文件：

```text
$ sudo vi /etc/profile
```

在文件末尾添加如下内容：

```text
export REDIS_HOME=/opt/redis/bin
export PATH=$PATH:$REDIS_HOME
```

第 2 步，重新加载系统环境变量：

```text
$ source /etc/profile
```

### System Configuration

```text
# Set the vm.overcommit_memory to 1, which means always, this will avoid data to be truncated
$ sudo vi /etc/sysctl.conf
  vm.overcommit_memory=1
$ sudo sysctl vm.overcommit_memory=1

# Change the maximum of backlog connections some value higher than the value on tcp-backlog option of redis.conf, which defaults to 511
$ sudo sysctl -w net.core.somaxconn=512

# Disable transparent huge pages support, that is known to cause latency and memory access issues with Redis.
$ sudo echo never > /sys/kernel/mm/transparent_hugepage/enabled

$ sudo sysctl -w fs.file-max=100000
```

### 开放端口

防火墙开放 `6379` 端口：

```text
sudo firewall-cmd --zone=public --add-port=6379/tcp --permanent
sudo firewall-cmd --reload
```

## 启动方式

Redis 启动的方式有很多种，例如：

- 默认启动
- 指定配置启动
- 开机自启

### 命令行启动

```text
# 启动 Redis
redis-server

# 让 Redis 在后台进行运行
redis-server &

# 指定配置配置文件的方式启动 Redis
redis-server /path/to/redis.conf
```

### 开机自启

修改 `redis.conf` 文件：

```text
daemonize yes
bind * -::*
protected-mode no
```

```text
sudo vi /etc/systemd/system/redis.service
```

```text
[Unit]
Description=redis-server
After=network.target
 
[Service]
Type=forking
ExecStart=/opt/redis/bin/redis-server /opt/redis/conf/redis.conf
ExecStop=/opt/redis/bin/redis-cli shutdown
Restart=always
PrivateTmp=true
 
[Install]
WantedBy=multi-user.target
```


```text
$ ./redis-server 
1739:C 18 Dec 2023 21:05:19.864 # WARNING Memory overcommit must be enabled! Without it, a background save or replication may fail under low memory condition. Being disabled, it can also cause failures without low memory condition, see https://github.com/jemalloc/jemalloc/issues/1328. To fix this issue add 'vm.overcommit_memory = 1' to /etc/sysctl.conf and then reboot or run the command 'sysctl vm.overcommit_memory=1' for this to take effect.
1739:C 18 Dec 2023 21:05:19.864 * oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
1739:C 18 Dec 2023 21:05:19.864 * Redis version=7.2.3, bits=64, commit=00000000, modified=0, pid=1739, just started
1739:C 18 Dec 2023 21:05:19.864 # Warning: no config file specified, using the default config. In order to specify a config file use ./redis-server /path/to/redis.conf
1739:M 18 Dec 2023 21:05:19.866 # You requested maxclients of 10000 requiring at least 10032 max file descriptors.
1739:M 18 Dec 2023 21:05:19.866 # Server can't set maximum open files to 10032 because of OS error: Operation not permitted.
1739:M 18 Dec 2023 21:05:19.866 # Current maximum open files is 4096. maxclients has been reduced to 4064 to compensate for low ulimit. If you need higher maxclients increase 'ulimit -n'.
1739:M 18 Dec 2023 21:05:19.866 * monotonic clock: POSIX clock_gettime
```

## 安装后

### 用户和组

```text
sudo groupadd redis
sudo useradd -s /sbin/nologin -M -g redis redis
```

```text
sudo usermod -aG redis $USER
newgrp redis
```

### 创建目录

```text
sudo mkdir -p /opt/redis/{conf,data,log}
sudo chmod -R 775 /opt/redis/{conf,data,log}
sudo chown redis:redis /opt/redis/{conf,data,log}
```

- `/etc/redis`: Storage location for configuration files
- `/var/run/redis`: Storage location for data files and startup process ID files
- `/var/log/redis`: Log output destination

### 复制配置文件

```text
$ sudo cp -p ~/redis-stable/redis.conf /etc/redis/6379.conf
```

```text
# Network
port 6379
bind 0.0.0.0

# Security
protected-mode no

# Process
daemonize yes
pidfile /var/run/redis_6379.pid

# Log
loglevel notice
logfile "/opt/redis/log/redis.log"

# Persistence
dir /opt/redis/data/
```

## 服务

```text
$ sudo mkdir /etc/redis
$ sudo cp ~/redis-stable/redis.conf /etc/redis/
```

```text
sudo vi /etc/systemd/system/redis.service
```

```text
[Unit]
Description=Redis Data Store
After=network.target

[Service]
User=redis
Group=redis
ExecStart=/opt/redis/bin/redis-server /opt/redis/conf/redis.conf
ExecStop=/opt/redis/bin/redis-cli shutdown
Restart=always

[Install]
WantedBy=multi-user.target
```

```text
sudo systemctl enable redis
sudo systemctl start redis
```

## Reference

- [Install Redis](https://redis.io/docs/install/install-redis/)
- [Install Redis from Source](https://redis.io/docs/install/install-redis/install-redis-from-source/)

