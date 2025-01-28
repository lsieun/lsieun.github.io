---
title: "常用的配置"
sequence: "120"
---

## Simple

```text
sudo mkdir -p /opt/redis/data
sudo chmod 777 /opt/redis/data
```

```text
# Network
port 6379
bind 0.0.0.0

# Security
protected-mode no

# Process
daemonize no
pidfile /var/run/redis_6379.pid

# Persistence
dir /opt/redis/data/
```

## Password

```text
# Network
port 6379
bind 0.0.0.0

# Security
protected-mode yes
requirepass "str0ng_passw0rd"

# Process
daemonize no
pidfile ./redis.pid
```

## SSL


