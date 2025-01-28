---
title: "分布式锁"
sequence: "102"
---

## 基于 Redis 的分布式锁

释放锁的业务流程是这样的：

- 获取锁中的线程标识
- 判断是否与指定的标识（当前线程标识）一致
- 如果一致，则释放锁（删除）
- 如果不一致，则什么都不做

```text
-- 锁的 key
local key = "lock:order:5"
-- 当前线程标识
local threadId = "abcdef"

-- 获取锁中线程标识 get key
local id = redis.call('get', key)
-- 比较线程标识与锁中的标识是否一致
if(id == threadId)
then
    -- 释放锁 del key
    return redis.call('del', key)
end
return 0
```

```text
-- 锁的 key
local key = KEY[1]
-- 当前线程标识
local threadId = ARGV[1]

-- 获取锁中线程标识 get key
local id = redis.call('get', key)
-- 比较线程标识与锁中的标识是否一致
if(id == threadId)
then
    -- 释放锁 del key
    return redis.call('del', key)
end
return 0
```

## Redisson 可重入锁原理

### 获取锁

获取锁的 Lua 脚本：

```lua
local key = KEYS[1];        -- 锁的 key
local threadId = ARGV[1]    -- 线程唯一标识
local releaseTime = ARGV[2] -- 锁的自动释放时间

-- 第 1 种情况，锁不存在（注意，这里用的是 exists）
if(redis.call('EXISTS', key) == 0)
then
    -- 不存在，获取锁
    redis.call('HSET', key, threadId, '1')
    -- 设置有效期
    redis.call('EXPIRE', key, releaseTime)
    return 1
end

-- 第 2 种情况，锁已经存在，并且 threadId 是自己的（注意，这里用的是 hexists，与上面的进行区别）
if(redis.call('HEXISTS', key, threadId) == 1)
then
    -- 不存在，获取锁，重入次数 + 1
    redis.call('HINCRBY', key, threadId, 1)
    -- 设置有效期
    redis.call('EXPIRE', key, releaseTime)
    return 1
end

-- 第 3 种情况，锁已经存在，但 threadId 不是自己的
return 0
```

```text
$ mkdir -p /tmp/redis/lua; cd /tmp/redis/lua
$ cat <<EOF > dist-lock-acquire.lua
# 脚本的内容
EOF
```



### 释放锁

释放锁的 Lua 脚本：

```lua
local key = KEYS[1];        -- 锁的 key
local threadId = ARGV[1]    -- 线程唯一标识
local releaseTime = ARGV[2] -- 锁的自动释放时间

-- 第 1 种情况，锁不存在（注意，这里用的是 exists）
if(redis.call('EXISTS', key) == 0)
then
    return nil
end

-- 第 2 种情况，锁已经存在，但是 threadId 不是自己的（注意，这里用的是 hexists，与上面的进行区别）
if(redis.call('HEXISTS', key, threadId) == 0)
then
    return nil
end

-- 第 3 种情况，锁已经存在，并且 threadId 是自己的
local count = redis.call('HINCRBY', key, threadId, -1)
if(count > 0)
then
    -- 如果 count 大于 0，则不能释放锁，重置有效期，然后返回
    redis.call('EXPIRE', key, releaseTime)
    return 1
else
    -- 如果 count 等于 0，则可以释放锁，直接删除，然后返回
    redis.call('DEL', key)
    return 1
end
```

```text
$ mkdir -p /tmp/redis/lua; cd /tmp/redis/lua
$ cat <<EOF > dist-lock-release.lua
# 脚本的内容
EOF
```

### 测试

```text
# 第 1 步，线程 x 首次获取锁，成功
$ redis-cli --eval dist-lock-acquire.lua lock:user:123456 , thread-x 30
(integer) 1

# 第 2 步，线程 x 再次获取锁（可重入），成功
$ redis-cli --eval dist-lock-acquire.lua lock:user:123456 , thread-x 30
(integer) 1

# 第 3 步，线程 y 首次获取锁，失败
$ redis-cli --eval dist-lock-acquire.lua lock:user:123456 , thread-y 30
(integer) 0
```

```text
# 第 1 步，线程 x 首次获取锁，成功
$ redis-cli --eval dist-lock-release.lua lock:user:123456 , thread-x 30
```

