---
title: "Win7 + MySQL8 + Zip"
sequence: "112"
---


## 安装 VC_redist.x64.exe

Windows 版的 MySQL 8.0 依赖 Microsoft Visual C++ 2019 Redistributable Package
（`VC_redist.x64.exe`）， 该软件必须安装；
否则，在执行 `mysqld`、`mysql` 等命令时，将没有任何反应。

另外，如果之前安装过 Visual Studio，那该软件已经在你电脑上安装好了。

第 1 步，下载

```text
https://learn.microsoft.com/en-US/cpp/windows/latest-supported-vc-redist
```

![](/assets/images/db/mysql/installation/win/download-vc-redist-x64-exe.png)


第 2 步，安装（过程略）。

## 运行 MySQL

### 下载 MySQL

第 1 步，打开下载网址，并选择 MySQL Community Server：

```text
https://dev.mysql.com/downloads/
```

![](/assets/images/db/mysql/installation/win/mysql-community-downloads-url.png)

第 2 步，选择 Windows Zip Archive 版本下载：

![](/assets/images/db/mysql/installation/win/mysql-8.2.0-winx64-zip-download.png)

第 3 步，选择 `No thanks, just start my download`：

![](/assets/images/db/mysql/installation/win/just-start-my-download.png)

### 解压

```text
D:\service\MySQL
```

![](/assets/images/db/mysql/installation/win/extract-mysql8-win-zip.png)

![](/assets/images/db/mysql/installation/win/mysql8-directories.png)


### 初始化 data 目录

初始化 data 目录，就是生成一个名为 data 的目录。数据表、权限表、时区表等都定义在该目录下。

在 MySQL 安装目录下，进入 `bin` 目录，执行以下命令，就会 MySQL 安装目录生成 `data` 目录：

```text
> mysqld --initialize --console
```

![](/assets/images/db/mysql/installation/win/mysqld-initialize-console.png)

扩展：

```text
# 方法一。使用该方法，第一次登陆 MySQL 时不需要密码。
mysqld --initialize-insecure

# 方法二：使用该方法，会生成一个临时密码。临时密码位于 data 文件夹后缀为 .err 的文件中。
mysqld --initialize

# 方法三：使用该方法，会生成一个临时密码。临时密码会显示在命令行窗口中。
mysqld --initialize --console
```

### 启动 MySQL

在命令行中执行以下命令，就可以启动 MySQL Server 了：

```text
./mysqld
# 或 
./mysqld --console
```

![](/assets/images/db/mysql/installation/win/mysqld-console.png)

注意：

- 不要关闭该命令行窗口！！！关闭该窗口，就会关闭 MySQL 的进程。
- 如果需要排查问题，可以使用 `--verbose` 选项。

### 登陆 MySQL

再打开一个新的命令行窗口，在其中输入以下命令：

```text
./mysql -u root -p
```

### 修改密码

```text
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
```

```text
ALTER USER 'root'@'localhost' IDENTIFIED BY '123456';
```

![](/assets/images/db/mysql/installation/win/mysql-alter-root-password.png)

## MySQL 服务

### 注册为服务

将 MySQL 注册为 Windows 服务，就可以设置开机自启，也可以当作服务来启动、关闭。

第 1 步，关闭 MySQL 进程。

第 2 步，以管理员身份运行如下命令：

```text
mysqld --install         # 注册为开机自启的服务
mysqld --install-manual  # 注册为手动启动的服务
```

在默认情况下，服务名为 `MySQL`。

如果想注册为其它名字，例如，注册为 `MySQL8`

```text
mysqld --install MySQL8
```

建议 MySQL 的启动类型为手动启动，然后每次使用以下命令启动：

```text
# powershell 命令。需要管理员权限
start-service mysql    # start-service 可简写为 sasv

# cmd 命令
net start mysql
```

### 取消注册

第 1 步，以管理员身份运行，关闭 MySQL 进程：

```text
# powershell 命令。需要管理员权限
stop-service mysql  # stop-service 可简写为 spsv

# cmd 命令
net stop mysql
```

第 2 步，取消注册：

```text
mysqld --remove
```

如果注册时使用了其它名字，如 MySQL8，使用如下命令：

```text
mysqld --remove mysql8
```

下载 `mysql-8.1.0-winx64.zip` 文件。

![](/assets/images/db/mysql/config/win7-mysql8-zip-my-ini-file.png)

打开 `my.ini` 文件：

```text
[mysqld]
basedir ="D:\service\MySQL\mysql-8.1.0-winx64"
datadir ="D:\service\MySQL\mysql-8.1.0-winx64\data"
port=3333
server_id =10
character-set-server=utf8
character_set_filesystem=utf8
[client]
port=3333
default-character-set=utf8
[mysqld_safe]
timezone="CST"
[mysql]
default-character-set=utf8
```



```text
mysqld –initialize –user=root –console
```

```text
[mysqld]
basedir ="D:\mysql\mysql-8.0.12-winx64"
datadir ="D:\mysql\mysql-8.0.12-winx64\data"
port=3333
server_id =10
character-set-server=gbk
character_set_filesystem=gbk
[client]
port=3333
default-character-set=gbk
[mysqld_safe]
timezone="CST"
[mysql]
default-character-set=utf8
```

输入完以后，保存时，请点击另存为，查看编码格式是否为 `ANSI`；
如果不是，请修改为 `ANSI`，以免在后面的配置安装中出现错误。

```text
[mysqld]
port=3310
server-id=1000
log-bin=mysql-bin
```

## Reference

- [在 Windows 上配置免安装版 MySQL 8.0](https://zhuanlan.zhihu.com/p/420917888)
- [mysql8免安装 windows mysql8.0免安装配置教程](https://blog.51cto.com/u_16099262/7874619)
- [Windows下的免安装版MySQL配置](https://javaforall.cn/134475.html)
