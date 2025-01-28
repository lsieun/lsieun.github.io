---
title: "环境变量（全局变量）"
sequence: "102"
---

[UP](/bash.html)


- 第一个问题，环境变量在哪儿定义？
- 如何查看现有的环境变量

## 在哪儿定义

环境变量，可以在命令行中设置，但用户退出时这些变量值也会丢失。因此，最好在用户的家目录下的 `.bash_profile` 文件中，或全局配置 `/etc/bashrc`， `/etc/profile` 文件或者 `/etc/profile.d` 中定义。将环境变量放入 profile 文件中，每次用户登录时这些变量值都将被初始化。

## 命名规则

传统上，所有环境变量均为大写。<sub>这个解释的是“命名问题”</sub>

## 使用前的准备

环境变量应用于用户进程前，必须用 export 命令导出。<sub>这个解释的是“如何使用的问题”</sub>

```bash
export ANT_HOME=/opt/ant
```

或者

```bash
ANT_HOME=/opt/ant
export ANT_HOME
```

同时 export 多个变量

```bash
export ANT_HOME JAVA_HOME
```

## 如何查看

使用 `env`（或 `printenv`）或 `set` 显示默认的环境变量

有一些环境变量，比如 HOME、PATH、SHELL、UID、USER 等，在用户登录之前就已经被 `/bin/login` 程序设置好了。通常环境变量定义并保存在用户家目录下的 `.bash_profile` 文件中。

### OS

```bash
# 查看主机名称
echo $HOSTNAME
# 查看系统是 32 位，还是 64 位
echo $HOSTTYPE
```

### User

```bash
## 用户目录
echo $HOME

echo $USER

echo $UID

echo $SHELL

echo $PATH

echo $PWD
```

### 命令提示符

```bash
echo $PS1
```

### 用户自动退出

- `TMOUT=3600`: 退出前等待超时的秒数

## 用 unset 取消本地变量和环境变量

```bash
# 注意，不是 $USER，而是直接使用 USER（不需要加 $）
unset USER
```
