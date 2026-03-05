---
title: "port"
sequence: "port"
---

[UP](/windows/index.html)

## 查询端口

查询端口：

```text
netstat -ano
```

查询指定端口：

```text
netstat -ano | findstr "端口号"
```

根据PID查询进程：

```text
tasklist|findstr "PID"
```

## 开放防火墙端口

- [3 招教你轻松开放 Windows 防火墙端口](https://www.sysgeek.cn/how-to-open-windows-firewall-ports/)

### 使用「命令提示符 」

对于习惯使用命令行的用户，Windows 提供了 `netsh` 命令来快速管理防火墙。

第 1 步，按 `Windows + R` 快捷键打开「运行」对话框，
输入 `cmd` 并按 `Ctrl + Shift + 回车`，
以管理员权限打开「命令提示符」。

第 2 步，执行以下命令，创建防火墙端口开放规则：

```text
netsh advfirewall firewall add rule name="规则名称" dir=in action=allow protocol=TCP localport=12345
```

参数说明：

- `name`：规则名称，请替换为你想要的名称。
- `dir`：方向，`in` 代表入站，`out` 代表出站。
- `action`：动作，通常为 `allow`（允许）或 `block`（阻止）。
- `protocol`：协议，可选 `TCP` 或 `UDP`。
- `localport`：具体的端口号。

第 3 步，开放端口范围：
如果你需要开放一段连续的端口（例如 `12000` 到 `12200`），可以使用以下命令：

```text
netsh advfirewall firewall add rule name="规则名称" dir=in action=allow protocol=TCP localport=12000-12200
```

**注意**：`netsh` 命令不支持直接使用像 `localport=80,443,8080` 这样以逗号分隔的多个端口列表。

### 使用 PowerShell

PowerShell 的 `NetSecurity` 模块要比 CMD 更强大、灵活，特别适合批量操作。

第 1 步，按 `Windows + R` 快捷键打开「运行」对话框，
输入 `powershell`，然后按 `Ctrl + Shift + 回车`，以管理员权限打开 PowerShell。

第 2 步，执行以下命令，创建 Windows 防火墙开放端口规则：

开放单个端口：

```text
New-NetFirewallRule -DisplayName "规则名称" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 12345
```

参数说明：

- `-DisplayName`：规则名称
- `-Direction`：`Inbound` 代表入站，`Outbound` 代表出站。
- `-Action`：动作，通常为 `Allow` 或 `Block`。
- `-Protocol`：协议，可选 `TCP` 或 `UDP`。
- `-LocalPort`：具体的端口号。

开放端口范围：

```text
New-NetFirewallRule -DisplayName "规则名称" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 4000-4010
```

通过 PowerShell 的循环脚本，可以轻松批量开放多个不连续端口：

```text
$ports = @(80, 443, 8080)  
foreach ($port in $ports) {  
    New-NetFirewallRule -DisplayName "Allow TCP $port" -Direction Inbound -Action Allow -Protocol TCP -LocalPort $port  
}
```
