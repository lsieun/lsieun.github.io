---
title: "expect"
sequence: "103"
---

[UP](/bash.html)


## 安装 expect

```text
$ sudo yum -y install expect
```

## 使用 expect 创建脚本

第 1 步，定义脚本执行的 Shell

```text
#!/usr/bin/expect
```

这里定义的是 `expect` 可执行文件的链接路径（或真实路径），功能类似于 Bash 等 Shell 功能。

```bash
#!/bin/bash

sudo yum -y install expect
expect -f
set timeout 30
set password "123456"
spawn ssh -l devops 192.168.80.133 -p 22
expect "*password*"
send "$password\r"
interact
```

第 2 步，`set timeout 30`

设置超时时间，单位是**秒**。如果设置为 `timeout -1` 意为永不超时

第 3 步，`spawn`

`spawn` 是进行 `expect` 环境后才能执行的内部命令，不能直接在默认的 shell 环境中进行执行。

主要功能：传递交换指令。

第 4 步，`expect`

这里的 expect 同样是 `expect` 的内部命令。

主要功能：判断输出结果是否包含某项字符串，没有则立即返回；否则，就等待一段时间后返回，等待时间通过 `timeout` 进行设置。

第 5 步，`send`

执行交互动作，将交互要执行的动作进行进行输入给交互命令。

命令字符串结尾要加上 `r`，如果出现异常状态可以进行检查。

第 6 步，`interact`

执行完后，保持交换状态，把控制权交给控制台。

如果不加这一项，交互完成会自动退出。

第 7 个，`exp_continue`

继续执行接下来的交互操作。

第 8 个，`$argv`

expect 脚本可以接受从 Bash 传递过来的参数，可以使用 `[lindex $argv n]` 获得，`n` 从 `0` 开始，
分别表示第一个、第二个、第三个……参数。

## 示例

### 自动登录服务器

第 1 版本：`ssh-001-simple.exp`

```text
#!/usr/bin/expect
set ipaddress "192.168.80.133"
set username "devops"
set password "123456"
set timeout 30

spawn ssh $username@$ipaddress
expect {
"yes/no" { send "yes\r"; exp_continue }
"password:" { send "$password\r" }
}
interact
```

第 2 版本：`ssh-002-args.exp`

```text
#!/usr/bin/expect
set ipaddress [ lindex $argv 0]
set username [ lindex $argv 1]
set password [ lindex $argv 2]
set timeout 30

spawn ssh $username@$ipaddress
expect {
"yes/no" { send "yes\r"; exp_continue }
"password:" { send "$password\r" }
}
interact
```

```text
$ chmod u+x ssh-002-args.exp
$ ./ssh-002-args.exp 192.168.80.133 devops 123456
```


第 1 步，先使用命令进行登录一下：

```text
ssh -l devops 192.168.80.133 -p 22
```

第 2 步，添加 `login_remote_server.sh` 文件：

```text
#!/usr/bin/expect -f
set timeout 30
set password "123456"
spawn ssh -l devops 192.168.80.133 -p 22
expect "*password*"
send "$password\r"
interact
```

第 3 步，添加执行权限：

```text
$ chmod u+x login_remote_server.sh
```

第 4 步，进行登录：

```text
$ ./login_remote_server.sh
```

### Shell 脚本和 expect

```text
$ cat ip.txt 
192.168.80.131 devops 123456
192.168.80.132 devops 123456
192.168.80.133 devops 123456
```

- 循环 `useradd username`
- 登录远程主机 --> ssh --> 从 ip.txt 文件里获取 IP 和 密码分别赋值给两个变量
- 使用 expect 程序来解决交互问题



```bash
#!/bin/bash
while read ip user pass
do
    /usr/bin/expect <<-END &>/dev/null
    spawn ssh $user@$ip
    expect {
    "yes/no" { send "yes\r";exp_continue }
    "password:" { send "$pass\r" }
    }
    expect "$" { send "touch abcd.txt;exit\r" }
    expect eof
END
    echo "创建文件成功"
done < ip.txt
```

```bash
#!/bin/bash
while read ip user pass
do
    /usr/bin/expect <<-END &>/dev/null
    spawn ssh $user@$ip
    expect {
    "yes/no" { send "yes\r";exp_continue }
    "password:" { send "$pass\r" }
    }
    expect "#" { send "useradd yy1;rm -rf /tmp/*;exit\r" }
    expect eof
    END
done < ip.txt
```

## 常见问题

### bad interpreter

问题描述

将 Windows 上编写的 `ssh-001-simple.exp` 上传到 CentOS 服务器，执行时会出现错误信息：

```text
$ ./ssh-001-simple.exp 
-bash: ./ssh-001-simple.exp: /usr/bin/expect^M: bad interpreter: No such file or directory
```

原因分析

这是不同系统编码格式引起的。在 Windows 系统中编辑的文件可能有不可见字符，所以在 Linux 系统下执行会报以上异常信息。

解决方法

第 1 步，确保文件有可执行权限：

```text
$ chmod a+x ssh-001-simple.exp
```

第 2 步，修改文件格式：

```text
$ vim ssh-001-simple.exp
```

利用如下命令查看文件格式：

```text
:set ff
# 或
:set fileformat
```

可以看到 `fileformat=dos` 或 `fileformat=unix`

利用如下命令修改文件格式：

```text
:set ff=unix
# 或
:set fileformat=unix

# 存盘退出
:wq
```
