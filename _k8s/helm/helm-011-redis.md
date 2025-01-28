---
title: "Helm: Redis"
sequence: "111"
---

搜索 Redis

```text
$ helm search repo redis
```

查看安装说明：

```text
$ helm show readme bitnami/redis
```

拉取 `bitnami/redis`：

```text
$ helm pull bitnami/redis
```

```text
$ tar -zxvf redis-17.11.7.tgz
```

## 修改 `values.yaml`

- 第 22 行，修改 `global.storageClass` 为 `managed-nfs-storage`
- 第 24 行，设置 `global.redis.password` 密码：`myPass`
- 第 119 行，修改集群架构 `architecture`，默认是主从（replication，3 个节点），可以修改为 standalone 单机模型
- 修改实例存储大小
    - 第 454 行，将 `master.persistence.size` 为 `100Mi`
    - 第 871 行，将 `replica.persistence.size` 为 `100Mi`
- 第 907 行，修改 `replica.service.nodePorts.redis` 向外暴露端口 `32000`，范围：`30000`~`32767`

## 安装

创建命名空间

```text
$ kubectl create namespace redis
```

```text
$ helm install redis-release ./redis/ -n redis
```

```text
$ kubectl exec -it redis-release-master-0 -n redis -- /bin/bash
I have no name!@redis-release-master-0:/$ redis-cli 
127.0.0.1:6379> auth myPass
OK
127.0.0.1:6379> set username tomcat
OK
127.0.0.1:6379> get username
"tomcat"
```

```text
$ kubectl exec -it redis-release-replicas-0 -n redis -- /bin/bash
I have no name!@redis-release-replicas-0:/$ redis-cli
127.0.0.1:6379> auth myPass
OK
127.0.0.1:6379> get username
"tomcat"
127.0.0.1:6379> set username jerry
(error) READONLY You can't write against a read only replica.
```

## 升级与回滚

### 升级

要想升级 chart 可以修改本地的 chart 配置并执行：

```text
helm upgrade [RELEASE] [CHART] [flags]
```

```text
helm upgrade redis-release ./redis --namespace redis
```

### 回滚

使用 `helm ls` 的命令，查看当前运行的 chart 的 release 版本:

```text
$ helm ls --namespace redis
NAME         	NAMESPACE	REVISION	UPDATED                                	STATUS  	CHART        	APP VERSION
redis-release	redis    	1       	2023-07-08 22:47:33.394251993 +0800 CST	deployed	redis-17.11.7	7.0.11
```

使用下面的命令回滚到历史版本：

```text
helm rollback <RELEASE> [REVISION] [flags]
```

查看历史：

```text
$ helm history redis-release -n redis
REVISION	UPDATED                 	STATUS    	CHART        	APP VERSION	DESCRIPTION     
1       	Sat Jul  8 22:47:33 2023	superseded	redis-17.11.7	7.0.11     	Install complete
2       	Tue Jul 11 08:03:01 2023	deployed  	redis-17.11.7	7.0.11     	Upgrade complete
```

回退到上一版本：

```text
$ helm rollback redis-release -n redis
Rollback was a success! Happy Helming!
```

```text
$ helm history redis-release -n redis
REVISION	UPDATED                 	STATUS    	CHART        	APP VERSION	DESCRIPTION     
1       	Sat Jul  8 22:47:33 2023	superseded	redis-17.11.7	7.0.11     	Install complete
2       	Tue Jul 11 08:03:01 2023	superseded	redis-17.11.7	7.0.11     	Upgrade complete
3       	Tue Jul 11 08:08:41 2023	deployed  	redis-17.11.7	7.0.11     	Rollback to 1
```

回退到指定版本：

```text
$ helm rollback redis-release 2 -n redis
Rollback was a success! Happy Helming!
```

```text
$ helm history redis-release -n redis
REVISION	UPDATED                 	STATUS    	CHART        	APP VERSION	DESCRIPTION     
1       	Sat Jul  8 22:47:33 2023	superseded	redis-17.11.7	7.0.11     	Install complete
2       	Tue Jul 11 08:03:01 2023	superseded	redis-17.11.7	7.0.11     	Upgrade complete
3       	Tue Jul 11 08:08:41 2023	superseded	redis-17.11.7	7.0.11     	Rollback to 1   
4       	Tue Jul 11 08:11:47 2023	deployed  	redis-17.11.7	7.0.11     	Rollback to 2
```

## 卸载

```text
helm delete redis-release -n redis
```

```text
$ helm list -n redis
NAME         	NAMESPACE	REVISION	UPDATED                                	STATUS  	CHART        	APP VERSION
redis-release	redis    	4       	2023-07-11 08:11:47.627142407 +0800 CST	deployed	redis-17.11.7	7.0.11
```

```text
$ helm delete redis-release -n redis
release "redis-release" uninstalled
```

但是，PVC 还存在着。原因是当 Deployment 或 StatefulSet 被删除之后，它们的 Application 虽然被删除了，但是 Data 需要保留下来。

```text
$ kubectl get pvc -n redis
NAME                                  STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS          AGE
redis-data-redis-release-master-0     Bound    pvc-31409cb5-cc3c-4285-b585-77d91dca9eda   100Mi      RWO            managed-nfs-storage   2d9h
redis-data-redis-release-replicas-0   Bound    pvc-429566a0-d7ab-4e2b-b552-c2ac9805d9a6   100Mi      RWO            managed-nfs-storage   2d9h
redis-data-redis-release-replicas-1   Bound    pvc-cec51813-f475-4425-b9b9-623cfe4e7511   100Mi      RWO            managed-nfs-storage   2d9h
redis-data-redis-release-replicas-2   Bound    pvc-2b515603-6fa2-49ca-a961-618216bd1a62   100Mi      RWO            managed-nfs-storage   2d9h

$ kubectl get pv -n redis
NAME                                       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM                                       STORAGECLASS          REASON   AGE
pvc-2b515603-6fa2-49ca-a961-618216bd1a62   100Mi      RWO            Delete           Bound    redis/redis-data-redis-release-replicas-2   managed-nfs-storage            2d9h
pvc-31409cb5-cc3c-4285-b585-77d91dca9eda   100Mi      RWO            Delete           Bound    redis/redis-data-redis-release-master-0     managed-nfs-storage            2d9h
pvc-429566a0-d7ab-4e2b-b552-c2ac9805d9a6   100Mi      RWO            Delete           Bound    redis/redis-data-redis-release-replicas-0   managed-nfs-storage            2d9h
pvc-852e7e0a-af79-4d22-bd4e-a8bfc74bcdd5   100Mi      RWX            Delete           Bound    default/test-claim                          managed-nfs-storage            2d12h
pvc-cec51813-f475-4425-b9b9-623cfe4e7511   100Mi      RWO            Delete           Bound    redis/redis-data-redis-release-replicas-1   managed-nfs-storage            2d9h
```

```text
$ kubectl delete pvc redis-data-redis-release-master-0 -n redis
persistentvolumeclaim "redis-data-redis-release-master-0" deleted
```
