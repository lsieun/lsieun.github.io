---
title: "Redis 开发规约"
sequence: "104"
---

## Key 的设计

- 可读性和可管理性：` 业务名:表名:id`，例如 `blog:article:1`
- 简洁性：减少 key 的长度，建议不要超过 39 字节，例如 `humanresource:employee:88301` 变成 `hr:emp:88301`
- 不要包含特殊字符：key 不要包含特殊字符（空格、换行、引号），建议使用英文与数字

## Redis 的安全建议

- Redis 不要在外网被访问，禁止：`bind 0.0.0.0`
    - `bind 192.168.80.128`
- 更改 Redis 端口，不要 `6379`
    - `port 8838`
- Redis 使用非 root 启动
- Redis 没有设置密码或者弱密码，不要与登录密码相同
- `requirepass` 与 `masterauth`
- 定期备份，`save` 命令
- 配置好 Linux 防火墙规则
