---
title: "EMQX Installation on Windows"
sequence: "302"
---

## Windows

Windows:

```text
https://www.emqx.com/zh/downloads/broker/5.0.15/emqx-5.0.15-windows-amd64.tar.gz
```

命令行下进入解压路径，启动 EMQX：

```text
./bin/emqx start
```

```text
D:\software\emqx-5.0.14-windows-amd64\bin>emqx.cmd console
EMQX_LOG__FILE_HANDLERS__DEFAULT__ENABLE [log.file_handlers.default.enable]: false
EMQX_LOG__CONSOLE_HANDLER__ENABLE [log.console_handler.enable]: true
EMQX_NODE__DB_ROLE [node.db_role]: core
EMQX_NODE__DB_BACKEND [node.db_backend]: mnesia

D:\software\emqx-5.0.14-windows-amd64>D:\software\emqx-5.0.14-windows-amd64\erts-12.3.2.6\bin\erl.exe -mode embedded -boot "D:\software\emqx-5.0.14-windows-amd64\releases\5.0.14\start" -config "D:\software\emqx-5.0.14-windows-amd64\data\configs\app.2023.02.03.10.06.55.config" -args_file "D:\software\emqx-5.0.14-windows-amd64\data\configs\vm.2023.02.03.10.06.55.args" -mnesia dir 'd:/software/emqx-5.0.14-windows-amd64/data/mnesia/emqx@127.0.0.1'
Listener ssl:default on 0.0.0.0:8883 started.
Listener tcp:default on 0.0.0.0:1883 started.
Listener ws:default on 0.0.0.0:8083 started.
Listener wss:default on 0.0.0.0:8084 started.
Listener http:dashboard on :18083 started.
EMQX 5.0.14 is running now!
Eshell V12.3.2.6  (abort with ^G)
e5.0.14(emqx@127.0.0.1)1>
```

访问地址：

```text
http://localhost:18083/
```

默认用户名及密码：

- admin
- public

修改密码为：`emqx@localhost`
