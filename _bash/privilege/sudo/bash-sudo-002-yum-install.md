---
title: "安装软件"
sequence: "102"
---

[UP](/bash.html)


## 版本一（成功）

```bash
#!/bin/bash

# 远程服务器信息
HOST="192.168.80.132"
USERNAME="devops"
PASSWORD="123456"

# 安装 net-tools 命令
INSTALL_COMMAND="sudo -S yum -y install net-tools"

# 使用 ssh 远程执行命令
ssh -T ${USERNAME}@${HOST} "${INSTALL_COMMAND}" <<EOF
$(echo $PASSWORD)
EOF

exit 0
```

## 版本二

```bash
#!/bin/bash

# 远程服务器信息
HOSTS=("server1" "server2" "server3")
USERNAME="devops"
PASSWORD="123456"

# 安装命令
INSTALL_COMMAND="sudo -S yum -y install $@"

for host in ${HOSTS[@]}
do
    echo "=== ${host} ==="
    # 使用 ssh 远程执行命令
    ssh -T ${USERNAME}@${host} "${INSTALL_COMMAND}" <<EOF
$(echo $PASSWORD)
EOF
done
```

```text
$ yum-install.sh yum-utils tree wget net-tools psmisc lrzsz expect
```
