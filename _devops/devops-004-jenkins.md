---
title: "安装并初始化 Jenkins"
sequence: "104"
---

## 准备 JDK 和 Maven

### JDK 8

```text
$ tar -zxvf jdk-8u202-linux-x64.tar.gz
$ sudo mv ~/jdk1.8.0_202/ /opt/jdk
```

### Maven

第 1 步，解压 maven：

```text
$ tar -zxvf apache-maven-3.8.8-bin.tar.gz
$ sudo mv ~/apache-maven-3.8.8 /opt/maven
```

第 2 步，修改 `/opt/maven/conf/settings.xml` 文件：

第一种方式，使用阿云的仓库：

```xml
<mirrors>
    <mirror>
        <id>alimaven</id>
        <name>aliyun maven</name>
        <url>https://maven.aliyun.com/repository/public</url>
        <mirrorOf>central</mirrorOf>
    </mirror>
</mirrors>
```

第二种方式，使用自己搭建的 Nexus 仓库：

```xml
<mirrors>
    <mirror>
        <id>nexus3</id>
        <name>private maven repo</name>
        <url>https://nexus.lsieun.cn/repository/maven-public</url>
        <mirrorOf>central</mirrorOf>
    </mirror>
</mirrors>
```

```xml
<mirror>
    <id>nexus3</id>
    <name>private maven repo</name>
    <url>http://192.168.80.1:8081/repository/maven-public</url>
    <mirrorOf>central</mirrorOf>
</mirror>
```

## 部署 Jenkins 容器 

### Docker 运行

第 1 步，创建目录，并修改权限：

```text
$ sudo mkdir -p /opt/jenkins/
$ sudo chmod -R 777 /opt/jenkins/
```

第 2 步，运行：

```text
docker run --name jenkins \
--restart=always \
--network macvlan250 --ip=192.168.80.252 \
-v /opt/jenkins/:/var/jenkins_home/ \
-v /opt/jdk:/usr/local/jdk \
-v /opt/maven:/usr/local/maven \
-e JENKINS_UC=https://mirrors.cloud.tencent.com/jenkins/ \
-e JENKINS_UC_DOWNLOAD=https://mirrors.cloud.tencent.com/jenkins/ \
-d jenkins/jenkins:2.415-jdk11
```

国内常⽤的 Jenkins 插件安装源

- tencent  https://mirrors.cloud.tencent.com/jenkins/
- huawei  https://mirrors.huaweicloud.com/jenkins/
- tsinghua  https://mirrors.tuna.tsinghua.edu.cn/jenkins/
- ustc  https://mirrors.ustc.edu.cn/jenkins/
- bit  http://mirror.bit.edu.cn/jenkins/

第 3 步，查看日志：

```text
docker logs -f jenkins
```

第 4 步，查看默认密码：

```text
$ docker exec -it jenkins cat /var/jenkins_home/secrets/initialAdminPassword
d57dee4d707b40ce96b41f15f47b0fae
```


### UI 界面安装

第 1 步，浏览器访问：

```text
http://192.168.80.252:8080/
```

![](/assets/images/devops/jenkins/jenkins-001-unlock-jenkins.png)


第 2 步，选择 Select plugins to install：

![](/assets/images/devops/jenkins/jenkins-002-customize-jenkins.png)

第 3 步，不做修改，直接点击 Install：

![](/assets/images/devops/jenkins/jenkins-003-install.png)

第 4 步，等待安装：

![](/assets/images/devops/jenkins/jenkins-004-getting-started.png)

第 5 步，创建第一个管理员：

![](/assets/images/devops/jenkins/jenkins-005-create-first-admin-user.png)

第 6 步，Instance Configuration：

![](/assets/images/devops/jenkins/jenkins-006-instance-configuration.png)

第 7 步，开始使用 Jenkins：

![](/assets/images/devops/jenkins/jenkins-007-start-using-jenkins.png)

## 配置 Jenkins

### 安装两个插件

第 1 步，选择 Manage Jenkins：

![](/assets/images/devops/jenkins/jenkins-008-manage-jenkins.png)

第 2 步，在 System Configuration 下选择 Plugins：

![](/assets/images/devops/jenkins/jenkins-009-plugins.png)

第 3 步，在 Available plugins 中，搜索 Git Parameter：

![](/assets/images/devops/jenkins/jenkins-010-git-parameter.png)

第 4 步，继续搜索 Publish Over SSH：

![](/assets/images/devops/jenkins/jenkins-011-publish-over-ssh.png)

第 5 步，选择 Install：

![](/assets/images/devops/jenkins/jenkins-012-install-plugin.png)

第 6 步，等待安装完成：

![](/assets/images/devops/jenkins/jenkins-013-download-progress.png)

### 配置 JDK 和 Maven

第 1 步，选择 Manage Jenkins：

![](/assets/images/devops/jenkins/jenkins-014-manage-jenkins.png)

第 2 步，在 System Configuration 下选择 Tools：

![](/assets/images/devops/jenkins/jenkins-015-tools.png)

第 3 步，选择 Add JDK：

![](/assets/images/devops/jenkins/jenkins-016-add-jdk.png)

第 4 步，输入 JDK 的相关信息：

![](/assets/images/devops/jenkins/jenkins-017-jdk-installation.png)

第 5 步，选择 Add Maven：

![](/assets/images/devops/jenkins/jenkins-018-add-maven.png)

第 6 步，输入 Maven 相关信息：

![](/assets/images/devops/jenkins/jenkins-019-maven-installation.png)

第 7 步，进行保存。
