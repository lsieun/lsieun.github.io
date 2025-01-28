---
title: "jps"
sequence: "101"
---

[UP](/bash.html)


```bash
#!/bin/bash
USAGE="使用方法：sh jps-cluster.sh"
NODES=("server1" "server2" "server2")
for NODE in ${NODES[*]};
do
    echo "--------$NODE--------"
    ssh $NODE "/opt/module/jdk/bin/jps"
done
echo "------------------------------------------"
echo "--------jps-cluster.sh 脚本执行完成 !--------"
```
