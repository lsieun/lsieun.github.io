---
title: "Jenkins"
sequence: "jenkins"
---

第一步，拉取`jenkins/jenkins:lts`镜像

```text
docker pull jenkins/jenkins:lts
```

```text
touch docker-compose.yaml
```

```text
$ vi docker-compose.yaml
```

```text
# docker-compose.yaml
version: '3.8'
services:
  jenkins:
    image: jenkins/jenkins:lts
    privileged: true
    user: root
    restart: always
    ports:
     - 8080:8080
     - 50000:50000
    container_name: jenkins
    volumes:
      - ./jenkins_configuration:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock
```



```text
$ docker compose up -d
```

访问地址：

```text
http://192.168.80.130:8080
```

Go back to your shell and view the logs with docker logs.

```text
$ docker logs jenkins | less
```

```text
$ docker ps
CONTAINER ID   IMAGE                 COMMAND                  CREATED         STATUS          PORTS                                                                                      NAMES
54022b6c5922   jenkins/jenkins:lts   "/usr/bin/tini -- /u…"   8 minutes ago   Up 8 minutes    0.0.0.0:8080->8080/tcp, :::8080->8080/tcp, 0.0.0.0:50000->50000/tcp, :::50000->50000/tcp   jenkins
64145cfb10e5   sonatype/nexus3       "sh -c ${SONATYPE_DI…"   12 days ago     Up 15 minutes   0.0.0.0:8081->8081/tcp, :::8081->8081/tcp                                                  nexus
```

```text
$ docker exec -it 容器ID /bin/bash
```

```text
cat /var/jenkins_home/secrets/initialAdminPassword
45547c9280bb401eb89246a8e5905947
```

输入密码，在页面下方点击`Continue`按钮：

## Adding a Jenkins Agent With Docker Compose

```text
ssh-keygen -t rsa -f jenkins_agent
```

This command creates two files: 
`jenkins_agent`, which holds the **private key**,
and `jenkins-agent.pub`, the **public key**.

```text
$ cat jenkins_agent
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAs9IhYGEJx1twpAZZrvmGYD5I7BNYmYXGl0Do9DxfhMw1LuOY
skwfwy6Mh2rJwS15rk3alTCIAOI1k1a8HwKjwNGexQkMrahdc3MJ0tRg6elZQ/SF
rHjEz9SGM8c+j1gvaRp/CUNoFRBaeIEePHot0AfMdUVjfqkzKZMT3n4W8qT54yX0
mqKc3VixVExDxGPNBgSkv+dO9FvmDDx6xR3qau0DgWoIu76l7z3XKQUbVVHrN2tw
nsHdZ9ezlILY95P06pQSRy3ddMXcZgNory7Xsbh5M7glVN92qsYVBzUYHdzS05ve
gwz36pXTq2axSOgLPxMyJMvOpG6DnH7xZ/+ZpwIDAQABAoIBAQCmCecruS5wWCyA
KCTzfg/oGlr3MT3kNDQVQahYrM5+LpkE/L7oE4ZYkUjNWXuF1lm+6sBkdXV/a2CQ
9cuqzqMpzeTOhvaf+xCfI5/0foomMoNsTgKIKNOCG/j3IojPj1vnrsGSah1XJcyD
7KVgrmhS6ICP4Exojg9h2h7EmKTT0plkFXqQQEyWGgv2hVtSi9cL4ft+u8iH2omG
Xpp7IWC1LidoOBNMWntKenGDcyWYiK7Ht703u75X8dG5kCsROinkQVAAm+TPUig4
kFDLTXk0K40RnRvVMATgyRWbciTSfRWSwZm2zfpnnKLp3EhIV38divMcU8uirNYn
vsaFwFFRAoGBANrXYyG0kk/aNSTf1ozQcIyIggld6MO8dVLBfhMvsC3MPCgdmROQ
uW/t3pPiYMoRPSEC4LU7DYM+rjix2EnHX4b0K2kVxEbHWtmFhkXZ7EopGXTDtwTw
A/pIVXx3ASjzQXBpupbc1YTOeDA1XyDlHIlZVIguu+ig4cXwzC7h772bAoGBANJa
mHdPpJuJJcpeeRMEEC5pHXxJP9beTeBkUgR7nX2TYi1SvpMFNbFx9A4tFC6yPYX3
fqMxlA6J/MHiDrmFP4IupJ0I/KhWqjC7Tz9DXCLnL1ZZvj7vt63k31r1JFKlfibk
ZYm1vC/Us6fZolROgiVJ/RosDAYJRG5ShoIrD9rlAoGAOtSAL8VtN84/TyRldwFp
4D2qR35ZXpVBLPgbPmkpgYZP/bDHP/09/JsDpNnMj0XHGyK86btwTIIDL/aPYHYa
dhsZuGxDkYtyHtvIVurYnK8jysH6Z3dmelgLsyQCydFrHB8wK/I97C/dG4idhChT
XZEIKnv1w/nL9/xdx5SxcFUCgYAJIoIIfF7rmjMX7K5ZUw3Y1hu/r/ajwBelrPWa
2DtonqPez/8Sp2FDiW1NyEteE8N0M+E9+QMy9m8RhF2bVNwDLT9cym0ealUNtLSm
TKiNo3h8yXzngsV5Ob0xV//xztoBml2Gc2vur8/1dBAGlTo1oFbrcgo7oN9l4xOQ
R4pyuQKBgQCabzWE8oaCf9CPS2NXQ54nUErzqdS5pJzkSZBNojvHsdkqUYo5bF8R
2jPdhm3mvCxdi43j5ikz5UsQhttIfWqwR1wPGWPDiIbvTuvpMebOQjBTtck5gg4I
tyc3IeJM4naD37s1VuLkcF+kmn4NHcg/u8U4az+PL3ehD+3YaqDJPQ==
-----END RSA PRIVATE KEY-----
```

```text
$ cat jenkins_agent.pub 
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCz0iFgYQnHW3CkBlmu+YZgPkjsE1iZhcaXQOj0PF+EzDUu45iyTB/DLoyHasnBLXmuTdqVMIgA4jWTVrwfAqPA0Z7FCQytqF1zcwnS1GDp6VlD9IWseMTP1IYzxz6PWC9pGn8JQ2gVEFp4gR48ei3QB8x1RWN+qTMpkxPefhbypPnjJfSaopzdWLFUTEPEY80GBKS/5070W+YMPHrFHepq7QOBagi7vqXvPdcpBRtVUes3a3Cewd1n17OUgtj3k/TqlBJHLd10xdxmA2ivLtexuHkzuCVU33aqxhUHNRgd3NLTm96DDPfqldOrZrFI6As/EzIky86kboOcfvFn/5mn liusen@centos7.lsieun.com
```

```text
# docker-compose.yaml
version: '3.8'
services:
  jenkins:
    image: jenkins/jenkins:lts
    privileged: true
    user: root
    ports:
     - 8080:8080
     - 50000:50000
    container_name: jenkins
    volumes:
      - ./jenkins_configuration:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock
  agent:
    image: jenkins/ssh-agent:jdk11
    privileged: true
    user: root
    container_name: agent
    expose:
      - 22
    environment:
      - JENKINS_AGENT_SSH_PUBKEY=ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCz0iFgYQnHW3CkBlmu+YZgPkjsE1iZhcaXQOj0PF+EzDUu45iyTB/DLoyHasnBLXmuTdqVMIgA4jWTVrwfAqPA0Z7FCQytqF1zcwnS1GDp6VlD9IWseMTP1IYzxz6PWC9pGn8JQ2gVEFp4gR48ei3QB8x1RWN+qTMpkxPefhbypPnjJfSaopzdWLFUTEPEY80GBKS/5070W+YMPHrFHepq7QOBagi7vqXvPdcpBRtVUes3a3Cewd1n17OUgtj3k/TqlBJHLd10xdxmA2ivLtexuHkzuCVU33aqxhUHNRgd3NLTm96DDPfqldOrZrFI6As/EzIky86kboOcfvFn/5mn liusen@centos7.lsieun.com
```

```text
docker compose up -d
```

## Ready to Go

```text
docker compose down
```

```text
$ docker compose up -d
[+] Running 9/9
 ⠿ agent Pulled                                                                                                                                                                                                46.3s
   ⠿ 001c52e26ad5 Pull complete                                                                                                                                                                                21.0s
   ⠿ a742729aeda6 Pull complete                                                                                                                                                                                21.0s
   ⠿ b8a932b7a7bf Pull complete                                                                                                                                                                                21.2s
   ⠿ ed07689b9017 Pull complete                                                                                                                                                                                21.3s
   ⠿ 4f4fb700ef54 Pull complete                                                                                                                                                                                21.3s
   ⠿ e9840a69be91 Pull complete                                                                                                                                                                                39.6s
   ⠿ 4217fbec670b Pull complete                                                                                                                                                                                39.7s
   ⠿ 9c343f215f74 Pull complete                                                                                                                                                                                39.7s
[+] Running 3/3
 ⠿ Network jenkins_default  Created                                                                                                                                                                             0.0s
 ⠿ Container agent          Started                                                                                                                                                                             0.5s
 ⠿ Container jenkins        Started
```

```text
$ docker exec -it bfb68 /bin/bash
```

```text
# java -version
openjdk version "11.0.12" 2021-07-20
OpenJDK Runtime Environment Temurin-11.0.12+7 (build 11.0.12+7)
OpenJDK 64-Bit Server VM Temurin-11.0.12+7 (build 11.0.12+7, mixed mode)
```

```text
# whereis java
java: /opt/java/openjdk/bin/java
```

## Reference

- [jenkins/jenkins](https://hub.docker.com/r/jenkins/jenkins)
- [How to Install and Run Jenkins With Docker Compose](https://www.cloudbees.com/blog/how-to-install-and-run-jenkins-with-docker-compose)

