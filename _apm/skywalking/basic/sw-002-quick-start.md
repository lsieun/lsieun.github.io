---
title: "快速开始"
sequence: "102"
---


- 部署 OAP 服务
    - 下载安装包
    - 修改配置
    - 启动 OAP 服务
- Skywalking UI 可视化
- 基于 Agent 监控 Spring Boot 应用
    - 配置文件
    - 启动脚本
    - IDE 开发工具


```text
Application --> Agent (Client) --> OAP (Server) --> UI
```

## JDK 环境安装

Requirement: JDK11 to JDK17 are tested. Other versions are not tested and may or may not work.

解压：

```bash
# root
sudo tar -zxvf jdk-*.tar.gz -C /usr/local/
```

解压之后的完整路径为：`/usr/local/jdk-17.0.1`。

```bash
cd /usr/local/
sudo ln -s jdk-17.0.1/ jdk17
```

编辑 `/etc/profile` 文件：

```bash
sudo vim /etc/profile
```

添加如下内容：

```bash
JAVA_HOME=/usr/local/jdk17
PATH=$PATH:$JAVA_HOME/bin
export JAVA_HOME PATH
```

重新加载 `/etc/profile` 文件

```bash
source /etc/profile
```

验证：

```bash
java -version
javac -version
```

## 服务端 OAP

### 下载

下载 Foundations 中的 SkyWalking APM，选择 Distribution 版本：


在 Agents 中下载所需要的 Agent


```text
/opt/skywalking
```

### 修改配置

解压 `apache-skywalking-apm-9.x.x.tar.gz`，并修改 `config/applications.yml` 文件：

```text
tar -zxvf apache-skywalking-apm-*.gz
mv apache-skywalking-apm-bin/ /usr/local/skywalking-apm
```

找到 `storage > selector`，将其修改为 `${SW_STORAGE:elasticsearch}`

根据自己需求，决定是否修改命名空间、ES 连接地址、用户名密码等。

### 启动

![](/assets/images/java/skywalking/apache-skywalking-apm-tar-gz-directories.png)


进入 `bin` 目录，选择启动脚本运行

- `startup.sh`：先启动 OAP 服务，再启动 UI 服务。
- `oapService.sh`：单独启动 OAP 服务，第一次启动需要初始化数据，因此可能会比较慢
- `webappService.sh`：单独启动 UI 服务

![](/assets/images/java/skywalking/apache-skywalking-apm-bin-scripts.png)

You can use `bin/startup.sh` (or `cmd`) to start up the backend and UI with their default settings, set out as follows:

- Backend storage uses `H2` by default (for an easier start)
- Backend listens on `0.0.0.0/11800` for **gRPC APIs** and `0.0.0.0/12800` for **HTTP REST APIs**.

In Java, DotNetCore, Node.js, and Istio agents/probes,
you should set the gRPC service address to `ip/host:11800`, and IP/host should be where your backend is.

- UI listens on `8080` port and request `127.0.0.1/12800` to run a GraphQL query.

```text
                  ┌─── ApplicationStartUp ───┼─── 8080 ───┼─── UI
                  │
SkyWalking OAP ───┤                          ┌─── 11800 ───┼─── gRPC APIs: Java, DotNetCore, Node.js
                  │                          │
                  │                          ├─── 12800 ───┼─── HTTP REST APIs
                  └─── OAPServerStartUp ─────┤
                                             ├─── 12801 ───┼─── AWS Firehose receiver
                                             │
                                             └─── 9090 ────┼─── Prometheus Data Source
```

在 `config/application.yml` 中，有如下配置：

```yaml
core:
  selector: ${SW_CORE:default}
  default:
    restHost: ${SW_CORE_REST_HOST:0.0.0.0}
    restPort: ${SW_CORE_REST_PORT:12800}
    gRPCHost: ${SW_CORE_GRPC_HOST:0.0.0.0}
    gRPCPort: ${SW_CORE_GRPC_PORT:11800}
```

在 `webapp/application.yml` 中，有如下配置：

```yaml
serverPort: ${SW_SERVER_PORT:-8080}

# Comma seperated list of OAP addresses.
oapServices: ${SW_OAP_ADDRESS:-http://localhost:12800}
```

```text
cd bin
bash startup.sh
```

```text
$ bash startup.sh
SkyWalking OAP started successfully!
SkyWalking Web Application started successfully!
```

使用 `jps -l` 命令检查是否启动成功：

```text
$ jps -l
9607 org.apache.skywalking.oap.server.webapp.ApplicationStartUp
9578 org.apache.skywalking.oap.server.starter.OAPServerStartUp
10700 jdk.jcmd/sun.tools.jps.Jps
```

```text
$ sudo netstat -nltp
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name    
tcp6       0      0 :::8080                 :::*                    LISTEN      9607/java        # ApplicationStartUp
tcp6       0      0 :::11800                :::*                    LISTEN      9578/java        # OAPServerStartUp
tcp6       0      0 :::12800                :::*                    LISTEN      9578/java        # OAPServerStartUp
tcp6       0      0 :::12801                :::*                    LISTEN      9578/java        # OAPServerStartUp
tcp6       0      0 :::9090                 :::*                    LISTEN      9578/java        # OAPServerStartUp
```

检查任意服务是否启动成功，可以查看 `<SkyWalking Home>/logs` 下面的日志文件

## SkyWalking UI 可视化

```text
http://192.168.80.130:8080/
```

## 基于 Agent 监控 Spring Boot 应用



### 配置文件


```text
skywalking-agent/config/agent.config
```


### 启动脚本

SkyWalking Agent 启动脚本

```text
#!/bin/bash

# 探针名称，一般指定为监控应用的名称
export SW_AGENT_NAME=skywalking-demo

# Collector 地址，指向 OAP 服务
export SW_AGENT_COLLECTOR_BACKEND_SERVICE=127.0.0.1:11800

# 配置链路的最大 Span 数量，默认值为 300
export SW_AGENT_SPAN_LIMIT=1000

export JAVA_AGENT=-javaagent:<探针 Jar 的位置>

# 启动程序
java $JAVA_AGENT -jar skywalking-demo-1.0.0-SNAPSHOT.jar
```

其中，`SW` 为 Sky Walking 的缩写。

### IDE 开发工具

通过 IntelliJ IDEA 启动配置中，添加如下 JVM 参数：

```text
-javaagent:探针 Jar 所在位置
-DSW_AGENT_NAME=skywalking-demo
-DSW_AGENT_COLLECTOR_BACKEND_SERVICES=192.168.80.130:11800
```

```text
-javaagent:D:\tmp\skywalking-agent\skywalking-agent.jar
-DSW_AGENT_NAME=skywalking-spring-boot-demo
-DSW_AGENT_COLLECTOR_BACKEND_SERVICES=192.168.80.130:11800
```

- File: `start-skywalking.sh`

```bash
#!/bin/bash

# 指定 SkyWalking OAP 的安装目录
SKYWALKING_HOME=/usr/local/skywalking-apm

# 启动 SkyWalking OAP
$SKYWALKING_HOME/bin/startup.sh start
```

- File: `stop-skywalking.sh`

```bash
#!/bin/bash

# 预定义需要杀掉的进程名字
declare -a names=("ApplicationStartUp" "OAPServerStartUp")

# 遍历所有预定义的进程名字并杀掉进程
for name in "${names[@]}"; do
  # 查找进程 ID
  pid=$(jps | grep $name | awk '{print $1}')
  
  # 杀掉进程
  if [ -n "$pid" ]; then
      echo "Found process $name with PID $pid, stopping ..."
      kill -9 $pid
  else
      echo "Process $name not found"
  fi
done
```
