---
title: "Redis Lua More"
sequence: "103"
---

## Lua VS. Transaction

You may wonder how to choose between Lua and Redis transactions in Redis,
since both are capable of executing a group of operations as a whole.
Generally speaking, it's better to choose Lua rather than transactions
when you need a complex logical judgment or a processing loop for your business scenario.

## 执行时间

Similar to Redis transactions, attention must also be paid to the execution time of your Lua script.
The Redis Server won't process any commands when executing a Lua program.
So, we must make sure that the Lua script can be executed as soon as possible.
Once the execution time of a Lua script exceeds 5 seconds by default
(set `lua-time-limit` in the Redis configuration to change it), you can call `SCRIPT KILL` to kill it.
If any write command has already been called in your script,
you have to send `SHUTDOWN NOSAVE` to shut down your Redis Server without performing persistence.
If the execution time is less than 5 seconds, the `SCRIPT KILL` command will also be blocked until the timeout is reached.

## 是否存在

For Lua script management, you can tell if a script exists by calling `SCRIPT EXISTS` with the SHA-1 ID.

```text
$ redis-cli SCRIPT EXISTS 745b29712af3c447bdf0fe9b6bb1be69a75ebba5
1) (integer) 1

# 清空
$ redis-cli SCRIPT FLUSH

$ redis-cli SCRIPT EXISTS 745b29712af3c447bdf0fe9b6bb1be69a75ebba5
1) (integer) 0
```

## 临时保存

The last thing to note is that because the script is only saved in a script cache of a Redis Server process,
which will be gone during rebooting, you have to reload the Lua scripts after you restart the Redis Server.
