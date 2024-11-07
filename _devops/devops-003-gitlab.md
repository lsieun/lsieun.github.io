---
title: "安装并初始化 GitLab"
sequence: "103"
---

## 开启 Macvlan

- [ ] TODO: 进一步学习 macvlan 和 docker network 的知识

```text
$ docker network create --driver macvlan \
 --subnet=192.168.80.0/24 \
 --ip-range=192.168.80.0/24 \
 --gateway=192.168.80.2 \
 -o parent=ens33 \
 macvlan250
```

## 部署 GitLab

```text
sudo mkdir -p /opt/gitlab/{config,data,log}
sudo chmod -R 755 /opt/gitlab
```

```text
docker run --name gitlab \
--hostname gitlab.example.com \
--restart=always \
--network macvlan250 --ip=192.168.80.251 \
-v /opt/gitlab/config:/etc/gitlab \
-v /opt/gitlab/log:/var/log/gitlab \
-v /opt/gitlab/data:/var/opt/gitlab \
-d gitlab/gitlab-ce:16.1.0-ce.0
```

生成的日志非常多：

```text
docker logs -f gitlab
```

## 修改密码

第 1 步，查看默认密码：

```text
$ docker exec -it gitlab grep 'Password:' /etc/gitlab/initial_root_password
Password: lczLWhbvwIW5ey0jkGlpIOFM0C67te5RW1zT+LpnTYo=
```

第 2 步，浏览器访问：

```text
http://192.168.80.251:80
```

第 3 步，输入用户名和密码：

- 用户：`root`
- 密码：如上


![](/assets/images/devops/gitlab/gitlab-001-login.png)

第 4 步，选择 Preferences 菜单项：

![](/assets/images/devops/gitlab/gitlab-002-menu-preferences.png)

第 5 步，选择 Password 选项卡，然后修改密码：

- 用户：`root`
- 密码：`123@Abc.com`

![](/assets/images/devops/gitlab/gitlab-003-change-password.png)


第 6 步，重新登录：

![](/assets/images/devops/gitlab/gitlab-004-sign-in-again.png)

