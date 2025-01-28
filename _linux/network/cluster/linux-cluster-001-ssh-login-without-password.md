---
title: "免密登录"
sequence: "101"
---

[UP](/linux.html)


## 配置 hosts

```text
$ sudo tee -a /etc/hosts <<EOF
192.168.80.131 server1
192.168.80.132 server2
192.168.80.133 server3
EOF
```

## 免密登录

第 1 步，生成公钥和私钥：

```text
$ ssh-keygen -t rsa
```

然后三次回车，`~/.ssh` 目录下就会生成两个文件 `id_rsa`（私钥）、`id_rsa.pub`（公钥）

第 2 步，将公钥拷贝到免密登录的目标机器上：


```text
$ ssh-copy-id server1
$ ssh-copy-id server2
$ ssh-copy-id server3
```

`~/.ssh` 目录下文件功能解释：

- `id_rsa`：生成的私钥
- `id_rsa.pub`：生成的公钥
- `authorized_keys`：存放授权过的无密登录服务器公钥

## 批量免密登录脚本

File: `hostlist.txt`

```text
192.168.80.131 server1
192.168.80.132 server2
192.168.80.133 server3
```

```text
$ sudo yum -y install expect
```

File: `batchSendKey.sh`

```bash
#!/bin/bash

if [ ! -f ~/.ssh/id_rsa ]
then
    ssh-keygen -t rsa
else
    echo "id_rsa has created ..."
fi
 
while read line
do
    user="${USER}"
    ip=`echo $line | cut -d " " -f 1`
    passwd="123456"
    expect << EOF
        set timeout 10
        spawn ssh-copy-id -i ~/.ssh/id_rsa.pub $user@$ip
        expect {
          "yes/no" { send "yes\n";exp_continue }
          "password" { send "$passwd\n" }
        }
        expect "password" { send "$passwd\n" }
EOF
done < hostlist.txt
```

## Good（成功）

File: `ssh-login-without-password.sh`

```bash
#!/bin/bash
set -e

ssh-keygen() {
    sudo yum -y install expect
    /usr/bin/expect <<-EOF
    set timeout 60
    spawn ssh-keygen
    expect {
        "*ssh/id_rsa*:" { send "\r"; exp_continue}
        "Overwrite (y/n)?" { send "n\r" }
        "Enter passphrase (empty for no passphrase):" { send "\r"; exp_continue}
        "Enter same passphrase again:" { send "\r"}
    }
    expect eof
EOF
    echo ""
}


ssh-copy(){
    /usr/bin/expect <<-EOF
    set timeout -1
    spawn ssh-copy-id $1
    expect {
        "*yes/no" { send "yes\r"; exp_continue }
        "*password:" { send "$2\r" }
    }
    expect eof
EOF
}


ssh-keygen


# 定义一个数组
IPArray=("server1" "server2" "server3")
USERNAME="${USER}"
PASSWORD="123456"

# 使用 for 循环遍历数组
for ip in "${IPArray[@]}"
do
    ssh-copy "${USERNAME}@${ip}" "${PASSWORD}"
done
```
