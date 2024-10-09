---
title: "用户信息配置"
sequence: "101"
---

[UP](/git/git-index.html)


## config

```text
# 设置用户名和邮箱（全局）
git config --global user.name "xxxxxx"
git config --global user.email jmxxxxxx@163.com

# 查看用户名和邮箱（全局）
git config --global user.name
git config --global user.email

# 设置用户名和邮箱（局部）
git config --local user.name "xxxxxx"
git config --local user.email jmxxxxxx@163.com

# 查看用户名和邮箱（局部）
git config --local user.name
git config --local user.email

# 查看所有配置
git config --list

# 查看帮助
git config --help
```
