---
title: "Helm Command"
sequence: "104"
---

## Repo

### Working with Repositories

Helm 3 no longer ships with a default chart repository.

查看仓库列表：

```text
$ helm repo list
```

添加仓库：

```text
helm repo add [NAME] [URL] [flags]
```

```text
$ helm repo add dev https://example.com/dev-charts
```

更新仓库：

```text
helm repo update [REPO1 [REPO2 ...]] [flags]
```

删除仓库：

```text
helm repo remove [REPO1 [REPO2 ...]] [flags]
```

## Repo + Chart

### helm search: Finding Charts

Helm comes with a powerful `search` command.
It can be used to search two different types of source:

- `helm search hub` searches [the Artifact Hub][artifacthub-url],
  which lists helm charts from dozens of different repositories.
- `helm search repo` searches the repositories that you have added to your local helm client (with `helm repo add`).
  This search is done over local data, and no public network connection is needed.

```text
$ helm search hub wordpress
```

```text
$ helm repo add brigade https://brigadecore.github.io/charts
$ helm search repo brigade
$ helm search repo kash
```

```text
$ helm repo add bitnami https://charts.bitnami.com/bitnami
$ helm repo add azure https://mirror.azure.cn/kubernetes/charts
$ helm repo add brigade https://brigadecore.github.io/charts
$ helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
```

在 `~/.cache/helm/repository` 目录，会下载一个 `bitnami-index.yaml` 文件。

```text

```

通过 `helm repo add` 命令添加的仓库索引文件通常不会经常更新，除非你运行 `helm repo update` 命令手动更新索引文件。

```text
$ helm search repo redis
NAME                 	CHART VERSION	APP VERSION	DESCRIPTION                                       
bitnami/redis        	17.11.7      	7.0.11     	Redis(R) is an open source, advanced key-value ...
bitnami/redis-cluster	8.6.6        	7.0.11     	Redis(R) is an open source, scalable, distribut...
```

Search is a good way to find available packages.
Once you have found a package you want to install, you can use `helm install` to install it.

[artifacthub-url]: https://artifacthub.io/

### pull

```text
$ helm pull bitnami/redis
```

```text
Repo --> helm pull --> Chart
```

## Chart

### show

```text
Usage:
  helm show [command]

Aliases:
  show, inspect

Available Commands:
  all         show all information of the chart
  chart       show the chart's definition
  crds        show the chart's CRDs
  readme      show the chart's README
  values      show the chart's values
```

### Customizing the Chart Before Installing

Installing the way we have here will only use the default configuration options for this chart.
Many times, you will want to customize the chart to use your preferred configuration.

To see what options are configurable on a chart, use `helm show values`:

```text
$ helm show values bitnami/wordpress
```

You can then override any of these settings in a YAML formatted file, and then pass that file during installation.

```text
$ echo '{mariadb.auth.database: user0db, mariadb.auth.username: user0}' > values.yaml
$ helm install -f values.yaml bitnami/wordpress --generate-name
```

The above will create a default MariaDB user with the name `user0`,
and grant this user access to a newly created `user0db` database,
but will accept all the rest of the defaults for that chart.

There are two ways to pass configuration data during install:

- `--values` (or `-f`): Specify a YAML file with overrides.
  This can be specified multiple times and the rightmost file will take precedence
- `--set`: Specify overrides on the command line.

If both are used, `--set` values are merged into `--values` with higher precedence.
Overrides specified with `--set` are persisted in a `ConfigMap`.

- Values that have been `--set` can be viewed for a given release with `helm get values <release-name>`.
- Values that have been `--set` can be cleared by running `helm upgrade` with `--reset-values` specified.

## Chart + Release

### Installing a Package

To install a new package, use the `helm install` command.
At its simplest, it takes two arguments:
**A release name** that you pick, and **the name of the chart** you want to install.

```text
helm install [NAME] [CHART] [flags]
```

```text
$ helm repo update              # Make sure we get the latest list of charts
$ helm install bitnami/mysql --generate-name
NAME: mysql-1612624192
LAST DEPLOYED: Sat Feb  6 16:09:56 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES: ...
```

In the example above, the `bitnami/mysql` chart was released, and the name of our new release is `mysql-1612624192`.

### Resources Installation Order

During installation, the helm client will print useful information about
which resources were created,
what the state of the release is,
and also whether there are additional configuration steps you can or should take.

Helm installs resources in the following order:

- Namespace
- NetworkPolicy
- ResourceQuota
- LimitRange
- PodSecurityPolicy
- PodDisruptionBudget
- ServiceAccount
- Secret
- SecretList
- ConfigMap
- StorageClass
- PersistentVolume
- PersistentVolumeClaim
- CustomResourceDefinition
- ClusterRole
- ClusterRoleList
- ClusterRoleBinding
- ClusterRoleBindingList
- Role
- RoleList
- RoleBinding
- RoleBindingList
- Service
- DaemonSet
- Pod
- ReplicationController
- ReplicaSet
- Deployment
- HorizontalPodAutoscaler
- StatefulSet
- Job
- CronJob
- Ingress
- APIService

### Exit

**Helm does not wait until all the resources are running before it exits.**
Many charts require Docker images that are over 600M in size, and may take a long time to install into the cluster.


## Release

### Track Release State

To keep track of a release's state, or to re-read configuration information, you can use `helm status`:

```text
$ helm status happy-panda
```

### Uninstalling a Release

When it is time to uninstall a release from the cluster, use the `helm uninstall` command:

```text
$ helm uninstall happy-panda
```

This will remove the release from the cluster.
You can see all of your currently deployed releases with the `helm list` command:

```text
$ helm list
```

### Upgrading a Release

When a new version of a chart is released, or when you want to change the configuration of your release,
you can use the `helm upgrade` command.

An upgrade takes an existing release and upgrades it according to the information you provide.
Because Kubernetes charts can be large and complex, Helm tries to perform the least invasive upgrade.
It will only update things that have changed since the last release.

```text
$ helm upgrade -f panda.yaml happy-panda bitnami/wordpress
```

### Recovering on Failure

Now, if something does not go as planned during a release,
it is easy to roll back to a previous release using `helm rollback [RELEASE] [REVISION]`.

```text
$ helm rollback happy-panda 1
```

A release version is an incremental revision.
Every time an `install`, `upgrade`, or `rollback` happens, the revision number is incremented by 1.
The first revision number is always 1.
And we can use `helm history [RELEASE]` to see revision numbers for a certain release.

## Reference

- [Using Helm](https://helm.sh/docs/intro/using_helm/)

