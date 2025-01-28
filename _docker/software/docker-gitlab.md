---
title: "GitLab"
sequence: "gitlab"
---

```text
# 机器配置要大于4g，否则很容易启动不了，报502
```

## 启动 Gitlab 容器

```text
mkdir -p ~/gitlab/{etc,log,opt}
```

```text
# 启动容器
docker run \
 -it  \
 -p 7080:80 \
 -p 7022:22 \
 -v ~/gitlab/etc:/etc/gitlab  \
 -v ~/gitlab/log:/var/log/gitlab \
 -v ~/gitlab/opt:/var/opt/gitlab \
 --privileged=true \
 --name gitlab \
 gitlab/gitlab-ce:16.1.0-ce.0
```

```text
# 启动容器
docker run \
 -itd  \
 -p 7080:80 \
 -p 7022:22 \
 -v ~/gitlab/etc:/etc/gitlab  \
 -v ~/gitlab/log:/var/log/gitlab \
 -v ~/gitlab/opt:/var/opt/gitlab \
 --restart always \
 --privileged=true \
 --name gitlab \
 gitlab/gitlab-ce:16.1.0-ce.0
```

## 修改配置

```text
#进容器内部
docker exec -it gitlab /bin/bash
 
#修改gitlab.rb
vi /etc/gitlab/gitlab.rb
 
#加入如下
#gitlab访问地址，可以写域名。如果端口不写的话默认为80端口
external_url 'http://192.168.80.130'
#ssh主机ip
gitlab_rails['gitlab_ssh_host'] = '192.168.80.130'
#ssh连接端口
gitlab_rails['gitlab_shell_ssh_port'] = 7022
 
# 让配置生效
gitlab-ctl reconfigure
```

```text
# 修改http和ssh配置
vi /opt/gitlab/embedded/service/gitlab-rails/config/gitlab.yml
 
  gitlab:
    host: 192.168.124.194
    port: 9980 # 这里改为9980
    https: false
```

```text
gitlab-ctl restart
```

```text
$ docker exec -it gitlab grep 'Password:' /etc/gitlab/initial_root_password
Password: BRapyNCY+WHAIuGY6gn9w+OXcJVMh8i56XifKAjh3W0=
```

- username: `root`
- password: `xxx`


## Docker Compose

```text
mkdir gitlab
export GITLAB_HOME=$(pwd)/gitlab
cd gitlab
vi compose.yaml
```

```yaml
services:
  web:
    image: 'gitlab/gitlab-ce:16.1.0-ce.0'
    restart: always
    hostname: 'localhost'
    container_name: gitlab-ce
    environment:
      GITLAB_OMNIBUS_CONFIG: |
        external_url 'http://localhost'
    ports:
      - '8080:80'
      - '8443:443'
    volumes:
      - '$GITLAB_HOME/config:/etc/gitlab'
      - '$GITLAB_HOME/logs:/var/log/gitlab'
      - '$GITLAB_HOME/data:/var/opt/gitlab'
    networks:
      - gitlab

networks:
  gitlab:
    name: gitlab-network
```

```text
docker compose up -d
```

```text
docker exec -it gitlab-ce grep 'Password:' /etc/gitlab/initial_root_password
```

```yaml
services:
  web:
    image: 'gitlab/gitlab-ce:latest'
    restart: always
    hostname: 'localhost'
    container_name: gitlab-ce
    environment:
      GITLAB_OMNIBUS_CONFIG: |
        external_url 'http://localhost'
    ports:
      - '8080:80'
      - '8443:443'
    volumes:
      - '$GITLAB_HOME/config:/etc/gitlab'
      - '$GITLAB_HOME/logs:/var/log/gitlab'
      - '$GITLAB_HOME/data:/var/opt/gitlab'
    networks:
      - gitlab
  gitlab-runner:
    image: gitlab/gitlab-runner:alpine
    container_name: gitlab-runner    
    restart: always
    depends_on:
      - web
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - '$GITLAB_HOME/gitlab-runner:/etc/gitlab-runner'
    networks:
      - gitlab

networks:
  gitlab:
    name: gitlab-network
```
