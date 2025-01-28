---
title: "Redis 的 Lua 脚本"
sequence: "101"
---

Redis 提供了 Lua 脚本功能，在一个脚本中编写多条 Redis 命令，确保多条命令执行时的原子性。

Lua 是一种编程语言，基本语法参考：

```text
https://www.runoob.com/lua/lua-tutorial.html
```

Redis 提供的调用函数，语法如下：

```text
# 执行 Redis 命令
redis.call('命令名称', 'key', '其它参数', ...)
```

例如，我们要执行 `set name jack`，则脚本是这样：

```text
redis.call('set', 'name', 'jack')
```

例如，我们先执行 `set name Rose`，再执行 `get name`，则脚本如下：

```text
redis.call('set', 'name', 'jack')
local name = redis.call('get', 'name')
return name
```

## 调用

写好脚本后，需要用 Redis 命令来调用脚本。

调用脚本的常见命令如下：

```text
> HELP @scripting

  EVAL script numkeys [key [key ...]] [arg [arg ...]]
  summary: Executes a server-side Lua script.
  since: 2.6.0
  ...
```

例如，我们要执行 `redis.call('set', 'name', 'jack')` 这个脚本，语法如下：

```text
EVAL "redis.call('set', 'name', 'jack')" 0
```

```text
127.0.0.1:6379> EVAL "redis.call('set', 'name', 'jack')" 0
(nil)
127.0.0.1:6379> get name
"jack"
```

如果脚本中的 key、value 不想写成固定值，可以作为参数传递。
key 类型参数会放入 `KEYS` 数组，其它参数会放入 `ARGV` 数组。
在脚本中，可以从 `KEYS` 和 `ARGV` 数组获取这些参数：

```text
EVAL "redis.call('set', KEYS[1], ARGV[1])" 1 name Rose
```

注意：在 Lua 脚本中，数组索引从 `1` 开始

```text
127.0.0.1:6379> EVAL "redis.call('set', KEYS[1], ARGV[1])" 1 name Rose
(nil)
127.0.0.1:6379> get name
"Rose"
```

```text
> eval "return {KEYS[1],KEYS[2],2ARGV[1],ARGV[2]}" 2 username age jack 20
1) "username"
2) "age"
3) "jack"
4) "20"
```

## 第二种调用方式

对于一段长的lua脚本，可以将脚本放在一个文件中，通过如下命令执行lua脚本

```text
$ redis-cli --eval path/to/redis.lua KEYS[1] KEYS[2] , ARGV[1] ARGV[2] ...
```

- `--eval`：告诉 redis-cli 读取并运行后面的 Lua 脚本
- `path/to/redis.lua`：Lua 脚本的位置
- `KEYS[1] KEYS[2]`：要操作的键，可以指定多个，在 Lua 脚本中通过 `KEYS[1]` 和 `KEYS[2]` 获取
- `ARGV[1] ARGV[2]`:在 Lua 脚本中通过 `ARGV[1]`、`ARGV[2]` 获取

注意：`KEYS` 和 `ARGV` 中间的 `,` 两边的空格，不能省略。

设置一个 `key = username`,`value=Jack`, `20s` 过期时间

```text
local key=KEYS[1] 
local args=ARGV 

return redis.call("setex", key, unpack(args))
```

```text
cat <<EOF > abc.lua
local key=KEYS[1] 
local args=ARGV

return redis.call("setex", key, unpack(args))
EOF
```

```text
$ redis-cli --eval /opt/abc.lua username , 20 Jack
```

## EVALSHA 命令

将脚本 script 添加到脚本缓存中，但并不立即执行这个脚本。

语法如下：

```text
EVALSHA sha1 numkeys key [key ...] arg [arg ...]
```


参数说明：

- `sha1`：通过 `SCRIPT LOAD` 生成的 sha1 校验码。
- `numkeys`：用于指定键名参数的个数。
- `key [key ...]`：从 EVAL 的第三个参数开始算起，表示在脚本中所用到的那些 Redis 键(key)，这些键名参数可以在 Lua 中通过全局变量 `KEYS` 数组，用 `1` 为基址的形式访问( `KEYS[1]`，`KEYS[2]`，以此类推)。
- `arg [arg ...]`：附加参数，在 Lua 中通过全局变量 `ARGV` 数组访问，访问的形式和 `KEYS` 变量类似(`ARGV[1]`、`ARGV[2]`，诸如此类)。

```text
127.0.0.1:6379> SCRIPT LOAD "return 'hello world'"
"5332031c6b470dc5a0dd9b4bf2030dea6d65de91"
127.0.0.1:6379> EVALSHA "5332031c6b470dc5a0dd9b4bf2030dea6d65de91"

(error) ERR wrong number of arguments for 'evalsha' command
127.0.0.1:6379> EVALSHA "5332031c6b470dc5a0dd9b4bf2030dea6d65de91" 0
"hello world"
```

## 示例

```text
$ mkdir -p /tmp/redis/lua; cd /tmp/redis/lua
$ cat <<EOF > updateJson.lua
local id = KEYS[1]
local data = ARGV[1]
local dataSource = cjson.decode(data)

local retJson = redis.call('get', id)
if retJson == false then
    retJson = {}
else
    retJson = cjson.decode(retJson)
end

for k,v in pairs(dataSource) do
    retJson[k] = v
end

redis.call('set', id, cjson.encode(retJson))
return redis.call('get', id)

EOF
```

```text
$ redis-cli --eval updateJson.lua users:id:123456 , '{"name": "Lucy", "sex": "female", "grade": "A"}'
```

```text
$ redis-cli SCRIPT LOAD "`cat updateJson.lua`"
"745b29712af3c447bdf0fe9b6bb1be69a75ebba5"
$ redis-cli EVALSHA 745b29712af3c447bdf0fe9b6bb1be69a75ebba5 1 users:id:123456 '{"name": "Tom", "sex": "male", "grade": "C"}'
```

## Reference

- [Scripting with Lua](https://redis.io/docs/interact/programmability/eval-intro/)
- [Lua Commands in Redis](https://redis.io/commands/?group=scripting)
  - [SCRIPT LOAD](https://redis.io/commands/script-load/)

