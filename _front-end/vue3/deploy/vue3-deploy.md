---
title: "打包和部署"
sequence: "203"
---

- CI: Continuous Integration（持续集成）
- CD: Continuous Delivery（持续交付）或Continuous Deployment（持续部署）


## 自动化部署流程

```text

Git仓库    --->    安装Jenkins（需要有Java环境）    --->    Jenkins自动构建（Node/npm环境）    --->    构建生产项目 

SSH连接    --->    发布项目文件夹    --->    Nginx配置    --->    用户浏览器访问
```

## Jenkins自动化部署

### 安装Java环境

```text
dnf search java-1.8
dnf install java-1.8.0-openjdk.x86_64
```

### 安装Jenkins

```text
wget -o /etc/yum.repos.d/jenkins.repo http://pgk.jenkins-ci.org/redhat-stable/jenkins.repo

# 导入GPG密钥以确保您的软件合法
rpm --import https://pkg.jenkins.io/redhat/jenkins.io.key
# 或者
rmp --import http://pkg.jenkins-ci.org/redhat/jenkins-ci.org.key
```

通过`vim`编辑：

```text
vi jenkins.repo
```

```text
[jenkins]
name=Jenkins-stable
baseurl=http://pkg.jenkins.io/redhat
gpgcheck=1
```

安装Jenkins

```text
dn install jenkins # --nogpgcheck（可以不加）
```

启动Jenkins服务：

```text
systemctl start jenkins
systemctl status jenkins
systemctl enable jenkins
```

Jenkins默认使用`8080`端口提供服务，所以需要加入到安全组中：

```text

```

## Nginx安装和配置

### 安装Nginx

安装Nginx：

```text
dfn install nginx
```

启动Nginx：

```text
systemctl start nginx
systemctl status nginx
systemctl enable nginx

systemctl restart nginx
```

### 配置Nginx

Nginx主要配置**用户**和**默认访问目录**。

配置用户：

```text
user root;    # 将普通用户nginx修改为root
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;
```

```text
mkdir mall_cms
cd mall_cms
touch index.html
```

```text
cat /etc/nginx/nginx.conf
```

```text
server {
    location / {
        root /root/mall_cms;
        index index.html;
    }
}
```

```text
npm run build

dist
```


```text
.....
分时天月周

H*****
H/30*****
```

## 构建触发器：

定时字符串从左往右分别：分、时、天、月、周

```text
# 每半小时构建一次 或 每半小时检查一次远程代码分支，有更新则构建
H/30 * * * *

# 每两小时构建一次 或 每两小时检查一次远程代码分支，有更新则构建
H H/2 * * *

# 每天凌晨两点定时构建
H 2 * * *

# 每月15号执行构建
H H 15 * *

# 工作日，上午9点整执行
H 9 * * 1-5

# 每周1/3/5，从8:30开始截止19:30，每4小时30分钟构建一次
H/30 8-20/4 * * 1,3,5
```

## 构建环境

```text
npm run build
```

Manage Jenkins --> Manage Plugins --> 可选插件

搜索Node找到NodeJS，

系统管理 ---> 全局工具配置 ---> NodeJS安装

Provide Node & npm bin/folder to PATH

构建

执行shell命令：

```text
pwd
node -v
npm -v
npm install
npm run build

echo '构建完成~~~'
ls

rm -rf /root/jm_site_inspect_web
mv -rf ./dist/* /root/jm_site_inspect_web
```

```text
/etc/sysconfig/jenkins
```

```text
JENKINS_USER="root"
```

重启Jenkins

```text
systemctl restart jenkins
```

