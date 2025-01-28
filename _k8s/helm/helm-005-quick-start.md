---
title: "Helm Quick Start"
sequence: "105"
---

## Initialize a Helm Chart Repository

第 1 步，添加 repo：

```text
$ helm repo add bitnami https://charts.bitnami.com/bitnami
```

第 2 步，从 repo 中查找 chart：

```text
$ helm search repo bitnami
```

## Install an Example Chart

```text
$ helm repo update              # Make sure we get the latest list of charts
```

```text
$ helm pull bitnami/mysql
```

```text
$ helm show chart bitnami/mysql
$ helm show all bitnami/mysql
```

```text
$ helm install bitnami/mysql --generate-name
NAME: mysql-1688716507
LAST DEPLOYED: Fri Jul  7 15:55:08 2023
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
CHART NAME: mysql
CHART VERSION: 9.10.5
APP VERSION: 8.0.33
```

## Learn About Releases

```text
$ helm list
NAME            	NAMESPACE	REVISION	UPDATED                                	STATUS  	CHART       	APP VERSION
mysql-1688716507	default  	1       	2023-07-07 15:55:08.004831552 +0800 CST	deployed	mysql-9.10.5	8.0.33
```

The `helm list` (or `helm ls`) function will show you a list of all deployed releases.

```text
$ helm status mysql-1612624192
```

## Uninstall a Release

To uninstall a release, use the `helm uninstall` command:

```text
$ helm uninstall mysql-1688716507
```

