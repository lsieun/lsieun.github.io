---
title: "DevOps 环境"
sequence: "102"
---

- Gitlab: 250 - 192.168.80.251
- Jenkins: 250 - 192.168.80.252
- WebServer: 252 - 192.168.80.252

## 安装 Docker

```text
cat >> /etc/sysctl.conf <<-'EOF'
net.ipv4.ip_forward=1
vm.max_map_count=655360
EOF
$ sudo sysctl -p
$ sudo systemctl disable --now firewalld
```

## WebServer

### 安装 JDK

```text
$ sudo yum -y install java-1.8.0-openjdk-devel.x86_64
```

```text
sudo cat >> /etc/profile <<-'EOF'
export JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk
export PATH=$JAVA_HOME/bin:$PATH
EOF
```

```text
source /etc/profile
echo $JAVA_HOME
```

```text
$ java -version
openjdk version "1.8.0_382"
OpenJDK Runtime Environment (build 1.8.0_382-b05)
OpenJDK 64-Bit Server VM (build 25.382-b05, mixed mode)
```
