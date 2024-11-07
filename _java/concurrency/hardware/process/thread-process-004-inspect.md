---
title: "查看进程的方法"
sequence: "104"
---

[UP](/java-concurrency.html)


## Windows

### GUI

任务管理器可以查看进程和线程数，也可以用来杀死进程

### CMD

- tasklist 查看进程
- taskkill 杀死进程

查询端口：

```text
netstat -ano
```

查询指定端口：

```text
netstat -ano | findstr "端口号"
```

根据进程 PID 查询进程名称：

```text
tasklist | findstr "进程 PID 号"
```

根据 PID 结束进程：

```text
taskkill /F /PID "进程 PID 号"
taskkill -f -pid "进程 PID 号"
```

根据进程名称结束进程：

```text
taskkill -f -t -im "进程名称"
```

## Linux

- `ps -fe` 查看所有进程
- `ps -fT -p <PID>` 查看某个进程（PID）的所有线程
- `kill` 杀死进程
- `top` 按大写 `H` 切换是否显示线程
- `top -H -p <PID>` 查看某个进程（PID）的所有线程

查询端口：

```text
netstat -nltp
```

查询指定端口：

```text
netstat -nltp | grep "端口号"
```

```text
nohub java -jar springboot.jar > server.log 2>&1 &
```

```text
ps -ef | grep "java -jar"
```

根据 PID 结束进程：

```text
kill -9 <pid>
```

## Java

- `jps` 命令查看所有 Java 进程
- `jstack <PID>` 查看某个 Java 进程（PID）的所有线程状态
- `jconsole` 来查看某个 Java 进程中线程的运行情况（图形界面）

## jconsole 远程监控配置

```java
public class HelloWorld {

    public static void main(String[] args) {
        Thread t1 = new Thread(() -> {
            while (true) {
                try {
                    Thread.sleep(2000);
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            }
        });
        t1.start();

        Thread t2 = new Thread(() -> {
            while (true) {
                try {
                    Thread.sleep(3000);
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            }
        });
        t2.start();
    }
}
```

```text
$ javac HelloWorld.java
$ java HelloWorld
```

需要以如下方式运行 Java 类

```text
java -Djava.rmi.server.hostname=192.168.80.130 \
-Dcom.sun.management.jmxremote \
-Dcom.sun.management.jmxremote.port=12345 \
-Dcom.sun.management.jmxremote.rmi.port=12345 \
-Dcom.sun.management.jmxremote.ssl=false \
-Dcom.sun.management.jmxremote.authenticate=false \
HelloWorld
```

![](/assets/images/java/concurrency/process/jconsole-remote-process.png)

![](/assets/images/java/concurrency/process/jconsole-insecure-connection.png)

![](/assets/images/java/concurrency/process/jconsole-overview.png)


修改 /etc/hosts 文件将 127.0.0.1 映射至主机名
如果要认证访问，还需要做如下步骤
复制 jmxremote.password 文件
修改 jmxremote.password 和 jmxremote.access 文件的权限为 600 即文件所有者可读写
连接时填入 controlRole （用户名）， R&D （密码）
