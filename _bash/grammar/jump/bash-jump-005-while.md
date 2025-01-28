---
title: "while"
sequence: "105"
---

[UP](/bash.html)


## While 条件句

```bash
while 条件
do
    指令...
done
```

```bash
#!/bin/bash

num=0

while [ ${num} -lt 10  ]
do
    uptime
    sleep 2
    num=$(( ${num} + 1 ))
done

```

## util 语句

```bash
util 条件
do
    指令...
done
```
