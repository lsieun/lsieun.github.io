---
title: "netstat"
sequence: "102"
---

[UP](/linux.html)


```text
$ sudo netstat -tulpn
```

- `-t`, `--tcp`: 指明显示 TCP 端口
- `-u`, `--udp`: 指明显示 UDP 端口
- `-a`, `--all`: 显示所有 socket(套接字)，包括正在监听的（LISTEN）

- `--numeric`, `-n`: Show numerical addresses instead of trying to determine symbolic host, port or user names.
- `-l`, `--listening`: Show only listening sockets.  (These are omitted by default.)
- `-p`, `--program`: Show the PID and name of the program to which each socket belongs.

```text
-t: tcp (Protocol)
-n: number (Port)
-l: listening (State)
-p: program (PID)
```

```text
$ sudo netstat -tnlp
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name    
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      8980/sshd           
tcp        0      0 127.0.0.1:25            0.0.0.0:*               LISTEN      9235/master         
```

```text
# 缺少 p
$ sudo netstat -tnl
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State      
tcp        0      0 0.0.0.0:8081            0.0.0.0:*               LISTEN     
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN     
tcp        0      0 127.0.0.1:25            0.0.0.0:*               LISTEN     
tcp6       0      0 :::8081                 :::*                    LISTEN     
tcp6       0      0 :::22                   :::*                    LISTEN     
tcp6       0      0 ::1:25                  :::*                    LISTEN
```

```text
$ sudo netstat -tlp
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name    
tcp        0      0 0.0.0.0:ssh             0.0.0.0:*               LISTEN      8980/sshd           
tcp        0      0 localhost:smtp          0.0.0.0:*               LISTEN      9235/master
```
