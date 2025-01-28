---
title: "Jenkins 项目"
sequence: "106"
---

## Jenkins 项目

### 新建 FreeStyle 项目

第 1 步，浏览器打开：

```text
http://192.168.80.252:8080/
```

第 2 步，在 Dashboard 中选择 New Item：

![](/assets/images/devops/jenkins/jenkins-020-new-item.png)

第 3 步，输入名称，并选择 Freestyle project：

![](/assets/images/devops/jenkins/jenkins-021-enter-an-item-name.png)

### 源码管理

第 1 步，找到 Source Code Management：

![](/assets/images/devops/jenkins/jenkins-022-source-code-management.png)

第 2 步，选择 Build Now：

![](/assets/images/devops/jenkins/jenkins-023-build-now.png)

第 3 步，在 Build History 下面选择 `#1`：

![](/assets/images/devops/jenkins/jenkins-024-build-history.png)

第 4 步，查看 Console Output：

![](/assets/images/devops/jenkins/jenkins-025-console-output.png)

第 5 步，在 Linux 服务器上验证代码拉取成功：

```text
192.168.80.250
```

```text
$ cd /opt/jenkins/workspace/
$ ls -l
total 0
drwxr-xr-x. 4 devops devops 79 Sep 13 19:12 myproject-ci
```

### 构建

第 1 步，在当前项目下选择 Configure：

![](/assets/images/devops/jenkins/jenkins-026-configure.png)

第 2 步，在 Build Steps 部分，选择 Add Build step 下的 Execute shell： 

![](/assets/images/devops/jenkins/jenkins-027-build-steps.png)

第 3 步，输入命令：

```text
sh /usr/local/maven/bin/mvn clean package -DskipTests
```

![](/assets/images/devops/jenkins/jenkins-028-execute-shell.png)

第 4 步，选择 Build Now：

![](/assets/images/devops/jenkins/jenkins-029-build-now.png)

第 5 步，查看 Console Output：

![](/assets/images/devops/jenkins/jenkins-030-build-success.png)

第 6 步，在 Linux 上，验证是否生成 jar 文件成功：

```text
$ cd /opt/jenkins/workspace/myproject-ci/target/
$ ls -l
total 17336
drwxr-xr-x. 3 devops devops       50 Sep 13 19:33 classes
drwxr-xr-x. 3 devops devops       25 Sep 13 19:33 generated-sources
drwxr-xr-x. 3 devops devops       30 Sep 13 19:33 generated-test-sources
drwxr-xr-x. 2 devops devops       28 Sep 13 19:33 maven-archiver
drwxr-xr-x. 3 devops devops       35 Sep 13 19:33 maven-status
-rw-r--r--. 1 devops devops 17744507 Sep 13 19:34 myproject-ci-0.0.1-SNAPSHOT.jar    # A.
-rw-r--r--. 1 devops devops     3354 Sep 13 19:33 myproject-ci-0.0.1-SNAPSHOT.jar.original
drwxr-xr-x. 2 devops devops       93 Sep 13 19:33 surefire-reports
drwxr-xr-x. 3 devops devops       20 Sep 13 19:33 test-classes
```

### 发布

#### 配置 Credential

第 1 步，选择 Manage Jenkins：

![](/assets/images/devops/jenkins/jenkins-031-manage-jenkins.png)

第 2 步，选择 System：

![](/assets/images/devops/jenkins/jenkins-032-system-config.png)

第 3 步，在 Publish over SSH 部分，选择 SSH Servers 下的 Add 按钮：

![](/assets/images/devops/jenkins/jenkins-033-add-ssh-server.png)

第 4 步，输入服务器信息：

![](/assets/images/devops/jenkins/jenkins-034-ssh-server-info.png)

第 5 步，测试是否连接成功：

![](/assets/images/devops/jenkins/jenkins-035-test-connection.png)


#### 发布的目标服务器

第 1 步，在当前项目下，选择 Configure：

![](/assets/images/devops/jenkins/jenkins-036-configure.png)

第 2 步，找到 Post-build Actions 部分：

![](/assets/images/devops/jenkins/jenkins-037-post-build-actions.png)

第 3 步，选择 Send build artifacts over SSH：

![](/assets/images/devops/jenkins/jenkins-038-send-build-artifacts-over-ssh.png)

第 4 步，输入相应信息：

```text
pkill java
nohup java -jar /home/devops/target/myproject-ci-0.0.1-SNAPSHOT.jar & sleep 1
```

![](/assets/images/devops/jenkins/jenkins-039-ssh-publisher.png)

第 5 步，在 Advanced 下勾选 Exec in pty：

![](/assets/images/devops/jenkins/jenkins-040-exec-in-pty.png)

第 6 步，选择 Build Now：

![](/assets/images/devops/jenkins/jenkins-041-build-now.png)

第 7 步，查看 Console Output：

![](/assets/images/devops/jenkins/jenkins-042-console-output.png)

第 8 步，在 Linux 上进行验证：

```text
$ jps
1767 Jps
1676 myproject-ci-0.0.1-SNAPSHOT.jar
```

## 测试

第 1 步，修改代码：

```text
Hello World v1.1
```

第 2 步，提交代码

第 3 步，进行构建。

第 4 步，验证是否更新成功。

```text
http://192.168.80.253:8888/hello/world
```

如果访问不了，尝试关闭防火墙：

```text
$ sudo systemctl stop firewalld
```
