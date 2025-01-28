---
title: "集群分发脚本"
sequence: "102"
---

[UP](/linux.html)


## scp

scp = secure copy 安全拷贝

scp 可以实现服务器与服务器之间的数据拷贝。（from server1 to server2）

### 基本语法

```text
scp   -r       $pdir/$fname           $user@$host:$pidr/$fname
命令   递归      要拷贝的文件路径/名称     目的地用户 @ 主机：目的地路径/名称
```

### 示例操作

前提：在 server1、server2、server3 都已经创建好 `/opt/module`、`/opt/software` 两个目录，
并且把这两个目录修改为 `devops:devops`

```text
$ sudo chown devops:devops -R /opt/module
$ scp -r /opt/module/jdk08 devops@server2:/opt/module
$ scp -r devops@server2:/opt/module/hadoop /opt/module
$ scp -r devops@server2:/opt/module/* devops@server3:/opt/module
```

## rsync 远程同步工具

rsync 主要用于备份和镜像。

rsync 的特点：

- 速度快
- 避免复制相同内容
- 支持符号链接

rsync 和 scp 区别：

- 速度：用 rsync 做文件的复制要比 scp 的速度快
- 内容：rsync 只对差异文件做更新，scp 是把所有文件都复制过去

### 基本语法

```text
rsync -av $pdir/$fname $user@$host:$pdir/$fname
```

选项参数说明：

- `-a`：归档拷贝
- `-v`：显示复制过程

### 示例操作

```text
$ rsync -av hadoop-3.1.3/ devops@server3:/opt/module/hadoop-3.1.3/
```

## xsync 集群分发脚本

### 需求

需求：循环复制文件到所有节点的相同目录下

### 需求分析

rsync 命令原始拷贝：

```text
rsync -av /opt/module devops@server3:/opt/
```

期望脚本：

```text
xync 要同步的文件名称
```

期望脚本在任何路径都能使用（脚本放在声明了全局环境变量的路径）：

```text
$ echo $PATH
/usr/local/bin:/usr/bin:/usr/local/sbin:/usr/sbin:/home/devops/.local/bin:/home/devops/bin
```

### 脚本实现

第 1 步，所有服务器安装 `rsync`：

```text
$ sudo yum -y install rsync
```

第 2 步，在 `/home/devops/bin` 目录下创建 `xsync` 文件：

```text
$ mkdir ~/bin
$ vi ~/bin/xsync
```

内容如下：

```bash
#!/bin/bash

hosts=("server1" "server2" "server3")

# 1. 判断参数个数
if [ $# -lt 1 ]
then
    echo "Not Enough Arguments!"
    exit
fi

# 2. 遍历集群所有机器
for host in ${hosts[@]}
do
    echo "========= ${host} ========="
    
    # 3. 遍历所有目录，挨个发送
    for file in $@
    do
        # 4. 判断文件是否存在
        if [ -e $file ]
        then
            # 5. 获取父目录
            pdir=$(cd -P $(dirname $file); pwd)
            
            # 6. 获取当前文件的名称
            fname=$(basename $file)
            ssh $host "mkdir -p $pdir"
            rsync -av $pdir/$fname $host:$pdir
        else
            echo "$file does not exits!"
        fi
    done
done
```

第 3 步，修改脚本 `xsync` 具有执行权限：

```text
$ chmod u+x ~/bin/xsync
```

第 4 步，测试脚本：

```text
$ xsync ~/bin
```

### 一步完成

File: `install-xsync.sh`

```bash
#!/bin/bash

sudo yum -y install rsync
mkdir -p ~/bin
cat <<'EOF' > ~/bin/xsync
#!/bin/bash

hosts=("server1" "server2" "server3")

# 1. 判断参数个数
if [ $# -lt 1 ]
then
    echo "Not Enough Arguments!"
    exit
fi

# 2. 遍历集群所有机器
for host in ${hosts[@]}
do
    echo "========= ${host} ========="
    
    # 3. 遍历所有目录，挨个发送
    for file in $@
    do
        # 4. 判断文件是否存在
        if [ -e $file ]
        then
            # 5. 获取父目录
            pdir=$(cd -P $(dirname $file); pwd)
            
            # 6. 获取当前文件的名称
            fname=$(basename $file)
            ssh $host "mkdir -p $pdir"
            rsync -av $pdir/$fname $host:$pdir
        else
            echo "$file does not exits!"
        fi
    done
done
EOF

chmod u+x ~/bin/xsync
```

## Root 用户

第 1 步，将脚本复制到 `/bin` 中，以便全局调用：

```text
$ sudo cp ~/bin/xsync /bin/
```

其实，`/bin/` 目录是 `/usr/bin/` 目录的映射：

```text
$ ls -l /
total 16
lrwxrwxrwx.   1 root root    7 Nov 18 23:48 bin -> usr/bin
```

第 2 步，同步到其它节点：

```text
$ sudo xsync /bin/xsync
```

第 3 步，同步环境变量配置（root 所有者）：

```text
sudo xsync /etc/profile.d/my_env.sh
```

注意：如果用了 `sudo`，那么 `xsync` 一定要给它的路径补全。

让环境变量生效：

```text
$ source /etc/profile
```
