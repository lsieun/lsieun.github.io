---
title: "集群：关机"
sequence: "104"
---

[UP](/bash.html)


```bash
#!/bin/bash

# 远程服务器信息
HOSTS=("server1" "server2" "server3")
USERNAME="devops"
PASSWORD="123456"

# 安装命令
COMMAND="sudo -S shutdown -h now"

# 获取数组长度
length=${#HOSTS[@]}

for ((i=$length-1; i>=0; i--))
do
    host="${HOSTS[i]}"
    echo "================== ${host}: shutdown =================="
    # 使用 ssh 远程执行命令
    ssh -T ${USERNAME}@${host} "${COMMAND}" <<EOF
$(echo $PASSWORD)
EOF
done
```
