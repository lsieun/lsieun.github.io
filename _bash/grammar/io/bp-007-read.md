---
title: "read"
sequence: "107"
---

[UP](/bash.html)


```bash
#!/bin/bash

# 输入 IP 地址
read -p "请输入 IP 地址: " ip_address

# 使用 IFS 按照.分隔 IP 地址
IFS='.' read -r -a ip_parts <<< "$ip_address"

# 输出各个数字
echo "第一部分 IP 地址: ${ip_parts[0]}"
echo "第二部分 IP 地址: ${ip_parts[1]}"
echo "第三部分 IP 地址: ${ip_parts[2]}"
echo "第四部分 IP 地址: ${ip_parts[3]}"
```
