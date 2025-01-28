---
title: "哨兵模式 - 故障转移"
sequence: "104"
---

- failover: the capacity to automatically switch to a standby computer server if the primary one fails

## 主观下线和客观下线

- S_DOWN: Subjectively Down
    - 配置项：`sentinel down-after-milliseconds mymaster 30000`
- O_DOWN: Objectively Down
    - 配置项：`sentinel monitor <master-name> <ip> <redis-port> <quorum>`
