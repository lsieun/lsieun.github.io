---
title: "Postgresql"
sequence: "postgresql"
---

查询postgresql镜像

```text
docker search postgres
```

```text
$ docker search postgres
NAME                                        DESCRIPTION                                     STARS     OFFICIAL   AUTOMATED
postgres                                    The PostgreSQL object-relational database sy…   11242     [OK]       
bitnami/postgresql                          Bitnami PostgreSQL Docker Image                 149                  [OK]
circleci/postgres                           The PostgreSQL object-relational database sy…   29                   
ubuntu/postgres                             PostgreSQL is an open source object-relation…   19                   
bitnami/postgresql-repmgr                                                                   18                   
rapidfort/postgresql                        RapidFort optimized, hardened image for Post…   15                   
bitnami/postgres-exporter                                                                   7                    
clearlinux/postgres                         PostgreSQL object-relational database system…   2                    
cimg/postgres                                                                               1                    
ibmcom/postgresql-s390x                                                                     1                    
vmware/postgresql-photon                                                                    0                    
ibmcom/postgresql                                                                           0                    
vmware/postgresql                                                                           0                    
rapidfort/postgresql12-ib                   RapidFort optimized, hardened image for Post…   0                    
circleci/postgres-script-enhance            Postgres with one change: Run all scripts un…   0                    
pachyderm/postgresql                                                                        0                    
objectscale/postgresql-repmgr                                                               0                    
circleci/postgres-upgrade                   This image is for internal use                  0                    
drud/postgres                                                                               0                    
cockroachdb/postgres-test                   An environment to run the CockroachDB accept…   0                    [OK]
aggipp/postgres-ssh                                                                         0                    
silintl/postgresql-backup-restore           PostgreSQL backup/restore container             0                    [OK]
airbyte/postgres-singer-source-abprotocol                                                   0                    
ibmcom/postgresql-amd64                                                                     0                    
ibmcom/postgresql-ppc64le
```

拉取镜像文件：

```text
docker pull postgres
```

镜像文件是否成功拉取：

```text
docker images
```

创建挂载文件夹：

```text
sudo mkdir -p /opt/postgresql/data
```

在`/opt/data/`目录下创建挂载文件夹

启动docker镜像：

```text
docker run --name postgres \
-e POSTGRES_PASSWORD=password \
-p 5432:5432 \
-v /opt/data/postgresql:/var/lib/postgresql/data \
-d postgres
```

`--restart=always`表示容器退出时,docker会总是自动重启这个容器；
–name: 指定创建的容器的名字；
-e POSTGRES_PASSWORD=password: 设置环境变量，指定数据库的登录口令为password；
-p 5432:5432: 端口映射将容器的5432端口映射到外部机器的5432端口；

-v  /data/postgresql:/var/lib/postgresql/data   将运行镜像的/var/lib/postgresql/data目录挂载到宿主机/data/postgresql目录
-d postgres:11.4: 指定使用postgres:11.4作为镜像。

```text
docker run --name postgresql \
-e POSTGRES_USER=myusername -e POSTGRES_PASSWORD=mypassword \
-p 5432:5432 \
-v /opt/postgresql/data:/var/lib/postgresql/data \
-d postgres
```

Now, execute `docker ps -a` to check the status of the newly created PostgreSQL container. 

```text
$ docker ps -a
CONTAINER ID   IMAGE         COMMAND                  CREATED         STATUS                   PORTS                                       NAMES
e910c6db1434   postgres      "docker-entrypoint.s…"   9 seconds ago   Up 8 seconds             0.0.0.0:5432->5432/tcp, :::5432->5432/tcp   postgresql
```

For starting the Docker Container:

```text
docker start postgresqldb
```

For stopping the Docker Container:

```text
docker stop postgresqldb
```

## Install PGAdmin on Docker

At this stage of setting up the Docker PostgreSQL Environment,
your PostgreSQL is active and running on the respective ports.
Now, you have to install the PGAdmin, a web-based GUI tool used to manage PostgreSQL databases and services.
You can install PGAdmin to check whether your Docker Containers are working fine and
execute SQL queries on databases present in PostgreSQL.

Execute the pull command to start PGAdmin.

```text
docker pull dpage/pgadmin4:latest
```

After downloading the image, run the container by executing the command given below.

```text
docker run --name my-pgadmin -p 82:80 \
-e 'PGADMIN_DEFAULT_EMAIL=user@domain.local' \
-e 'PGADMIN_DEFAULT_PASSWORD=postgresmaster'\
-d dpage/pgadmin4
```

In the above-given command, `my-pgadmin` is the name of the Docker PostgreSQL PGAdmin Container.
`PGADMIN_DEFAULT_EMAIL` and `PGADMIN_DEFAULT_PASSWORD` are the username and password
for the Docker PostgreSQL container, respectively.

## Reference

- [postgres](https://hub.docker.com/_/postgres)
