---
title: "调用命令"
sequence: "103"
---

[UP](/bash.html)


## 普通用户

```bash
#!/bin/bash
 
params=$@
i=1
for (( i=1 ; i <= 3 ; i = $i + 1 )) ; do
    echo "================== server$i $params =================="
    ssh server$i "$params"
done
```

## sudo

File: `sudo-xcall.sh`

```bash
#!/bin/bash

# 远程服务器信息
HOSTS=("server1" "server2" "server3")
USERNAME="devops"
PASSWORD="123456"

# 安装命令
COMMAND="sudo -S $@"

for host in ${HOSTS[@]}
do
    echo "================== ${host}: sudo ${@} =================="
    # 使用 ssh 远程执行命令
    ssh -T ${USERNAME}@${host} "${COMMAND}" <<EOF
$(echo $PASSWORD)
EOF
done
```
