---
title: "Nginx Compile Source"
sequence: "102"
---

- 下载
- 编译安装
- Nginx 启动和停止
- 关闭防火墙
- 安装成系统服务

## 下载

```text
https://nginx.org/en/download.html
```

```text
wget https://nginx.org/download/nginx-1.23.4.tar.gz
```

## 安装依赖

安装 `GCC` 编译器：

```text
sudo yum -y install gcc gcc-c++
```

安装 `PCRE` 正则表达式库：

```text
sudo yum -y install pcre pcre-devel
```

安装 `ZLIB` 压缩库：

```text
sudo yum -y install zlib zlib-devel
```

安装 `OpenSSL` 开发库：

```text
sudo yum -y install openssl openssl-devel
```

## 安装 Nginx

解压 `nginx.*.tar.gz` 文件：

```text
tar -zxvf nginx-1.23.4.tar.gz
$ cd nginx-1.*
```

编译和安装：

```text
./configure --prefix=/usr/local/nginx
make
sudo make install
```

## 启动 Nginx

进入安装好的目录 `/usr/local/nginx/sbin`：

```bash
$ cd /usr/local/nginx/sbin/

# 启动
$ sudo ./nginx

# 快速停止
$ sudo ./nginx -s stop

# 优雅关闭，在退出前完成已经接受的连接请求
$ sudo ./nginx -s quit

# 重新加载配置
$ sudo ./nginx -s reload
```

## 安装成系统服务

创建服务脚本：

```text
sudo vi /usr/lib/systemd/system/nginx.service
```

服务脚本内容：

```text
[Unit]
Description=The NGINX HTTP and reverse proxy server
After=network.target remote-fs.target nss-lookup.target
        
[Service]
Type=forking
PIDFile=/usr/local/nginx/logs/nginx.pid
ExecStartPre=/usr/local/nginx/sbin/nginx -t -c /usr/local/nginx/conf/nginx.conf
ExecStart=/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf
ExecReload=/usr/local/nginx/sbin/nginx -s reload
ExecStop=/usr/local/nginx/sbin/nginx -s stop
ExecQuit=/usr/local/nginx/sbin/nginx -s quit
PrivateTmp=true
        
[Install]
WantedBy=multi-user.target
```

重新加载系统服务：

```text
$ sudo systemctl daemon-reload
```

启动服务：

```text
$ sudo systemctl start nginx.service
$ systemctl status nginx.service
```

开机启动：

```text
$ sudo systemctl enable nginx.service
```

```text
[Unit]
Description=The NGINX HTTP and reverse proxy server
After=syslog.target network-online.target remote-fs.target nss-lookup.target
Wants=network-online.target
        
[Service]
Type=forking
PIDFile=/var/run/nginx.pid
ExecStartPre=/usr/sbin/nginx -t
ExecStart=/usr/sbin/nginx
ExecReload=/usr/sbin/nginx -s reload
ExecStop=/bin/kill -s QUIT $MAINPID
PrivateTmp=true
        
[Install]
WantedBy=multi-user.target
```

## 防火墙

关闭防火墙：

```text
systemctl stop firewalled.service
```

禁止防火墙开机启动：

```text
systemctl disable firewalled.service
```

开放端口：

```text
firewall-cmd --zone=public --add-port=80/tcp --permanent
```

重启防火墙：

```text
firewall-cmd --reload
```

## Reference

- [Building nginx from Sources](https://nginx.org/en/docs/configure.html)
- [linux 下编译安装 nginx 完整版](https://cloud.tencent.com/developer/article/1619507)
- [How to compile and install Nginx web server from source on Linux](https://www.xmodulo.com/compile-install-nginx-web-server.html)
- [Installing NGINX Open Source](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/)
  - [Compiling and Installing from Source](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/#compiling-and-installing-from-source)
- [How to Build NGINX from Source on Ubuntu 22.04 or 20.04](https://www.linuxcapable.com/how-to-build-nginx-from-source-on-ubuntu-linux/)

