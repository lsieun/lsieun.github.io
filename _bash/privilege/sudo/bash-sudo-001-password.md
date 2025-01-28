---
title: "自动输入 sudo 密码"
sequence: "101"
---

[UP](/bash.html)


## 管道

使用管道：

```text
echo your_password | sudo -S your_command
```

在上面的脚本中，

- 将 `your_password` 替换为实际的密码
- 将 `your_command` 替换为想要执行的实际命令

```text
#!/bin/bash

# 定义密码
PASSWORD="123456"

echo "${PASSWORD}" | sudo -S whoami
sudo ls -l /root
echo $USER
echo $HOME
```

## Here Document

```text
sudo -S your_command << EOF 
your_password 
EOF
```

在上面的脚本中，

- 将 `your_password` 替换为实际的密码
- 将 `your_command` 替换为想要执行的实际命令

```text
#!/bin/bash

# 定义密码
PASSWORD="123456"

sudo -S whoami << EOF
${PASSWORD}
EOF
sudo ls -l /root
echo $USER
echo $HOME
```

## expect

在 Bash 脚本中使用 sudo 命令时，自动输入密码通常是不安全的，因为这样做可能会导致脚本被未经授权的用户执行，从而获得超级用户权限。但是，如果你仍然想要实现这个功能，可以考虑使用 expect 工具来实现自动输入密码。

下面是一个示例 Bash 脚本，使用 expect 命令自动输入 sudo 密码：

```text
#!/bin/bash

# 定义密码
PASSWORD="your_password"

# 启动 expect 命令
expect <<EOF
spawn sudo your_command
expect "Password:"
send "$PASSWORD\r"
interact
EOF
```

```text
#!/bin/bash

# 定义密码
PASSWORD="123456"

# 启动 expect 命令
expect <<EOF
spawn sudo ls /root
expect "password"
send "$PASSWORD\r"
interact
EOF
```

在上面的脚本中，你需要将 your_password 替换为实际的密码，并将 your_command 替换为你想要执行的实际命令。

这个脚本使用 expect 命令来模拟交互式密码输入。当脚本执行 sudo your_command 时，它会等待输入密码。然后，使用 send 命令将密码发送给 sudo 命令。最后，使用 interact 命令使脚本退出交互模式，并将控制权返回给终端。

请注意，使用这种方法自动输入密码仍然存在安全风险，因为密码明文存储在脚本中。如果可能的话，最好避免在脚本中自动输入密码，并考虑其他安全措施，例如配置/etc/sudoers 文件来允许无密码执行特定命令。
