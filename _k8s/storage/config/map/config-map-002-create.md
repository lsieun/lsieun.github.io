---
title: "ConfigMap 创建"
sequence: "102"
---

## 如何创建 ConfigMap？

尽管主要用于配置在 Pod 中运行的容器的设置，但 ConfigMap 也被系统的其他部分使用，因为它们可以作为数据卷挂载。
它们可以用作符合相应 ConfigMap 中设置的参数的附加组件或运算符。

创建 ConfigMap 时需要考虑以下事项：

- 存储在 ConfigMap 中的信息未加密。因此，ConfigMaps 不应该被用来存储机密信息
- ConfigMap 文件大小不应超过 1MB
- ConfigMap 对象名称必须是有效的 DNS 子域名。
- ConfigMaps 驻留在 Namespace 中，只有驻留在同一 Namespace 中的 pod 才能引用它们。
- ConfigMaps 不能用于静态 pod。

## 创建 ConfigMap

使用 `kubectl create configmap -h` 查看示例，构建 ConfigMap 对象

```text
$ kubectl create configmap -h
```

```text
# Create a new config map named my-config based on folder bar
kubectl create configmap my-config --from-file=path/to/bar

# Create a new config map named my-config with specified keys instead of file basenames on disk
kubectl create configmap my-config --from-file=key1=/path/to/bar/file1.txt --from-file=key2=/path/to/bar/file2.txt

# Create a new config map named my-config with key1=config1 and key2=config2
kubectl create configmap my-config --from-literal=key1=config1 --from-literal=key2=config2

# Create a new config map named my-config from the key=value pairs in the file
kubectl create configmap my-config --from-file=path/to/bar

# Create a new config map named my-config from an env file
kubectl create configmap my-config --from-env-file=path/to/foo.env --from-env-file=path/to/bar.env
```

### 利用 YAML 文件创建

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: game-demo
data:
  # property-like keys; each key maps to a simple value
  player_initial_lives: "3"
  ui_properties_file_name: "user-interface.properties"
  # file-like keys
  game.properties: |
    enemy.types=aliens,monsters
    player.maximum-lives=5    
  user-interface.properties: |
    color.good=purple
    color.bad=yellow
    allow.textmode=true
```

```text
$ kubectl apply -f game-demo.yaml
```

```text
$ kubectl get configmaps 
NAME               DATA   AGE
game-demo          4      13s
kube-root-ca.crt   1      21d
```

```text
$ kubectl describe configmaps game-demo 
Name:         game-demo
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
user-interface.properties:
----
color.good=purple
color.bad=yellow
allow.textmode=true

game.properties:
----
enemy.types=aliens,monsters
player.maximum-lives=5    

player_initial_lives:
----
3
ui_properties_file_name:
----
user-interface.properties

BinaryData
====

Events:  <none>
```

### 从 Directory 读取

可以从同一目录中的多个文件创建 ConfigMap。
使用这种方法，只有目录中的常规文件被打包到新的 ConfigMap 中，而忽略任何其他条目（例如子目录、符号链接、管道、设备等）。

```text
$ mkdir test
$ tee test/db.properties <<EOF
username=tomcat
password=123456
EOF
$ tee test/redis.properties <<EOF 
host=127.0.0.1
port=6379
EOF
```

```text
$ kubectl create configmap my-config-from-dir --from-file=/home/devops/k8s/config/test
```

```text
$ kubectl get configmap
```

```text
$ kubectl describe configmap my-config-from-dir
Name:         my-config-from-dir
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
db.properties:
----
username=tomcat
password=123456

redis.properties:
----
host=127.0.0.1
port=6379


BinaryData
====

Events:  <none>
```

### 从 File 读取

可以使用 kubectl create configmap 从单个文件或任何纯文本格式的多个文件创建 ConfigMap。

File: `test/application.yaml`

```text
$ tee test/application.yaml <<EOF
spring:
  application:
    name: what-are-you-doing
server:
  port: 1234
EOF
```

```text
$ kubectl create configmap my-config-from-file-1 --from-file=test/application.yaml
```

```text
$ kubectl describe configmap my-config-from-file-1
Name:         my-config-from-file-1
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
application.yaml:
----
spring:
  application:
    name: what-are-you-doing
server:
  port: 1234


BinaryData
====

Events:  <none>
```

```text
$ kubectl create configmap my-config-from-file-2 --from-file=my-app-config=test/application.yaml
```

```text
$ kubectl get configmap
```

```text
$ kubectl describe configmap my-config-from-file-2
Name:         my-config-from-file-2
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
my-app-config:
----
spring:
  application:
    name: what-are-you-doing
server:
  port: 1234


BinaryData
====

Events:  <none>
```

### 从 Command Line 读取

```text
$ kubectl create configmap my-config-from-cmd --from-literal=username=tomcat --from-literal=password=123456
```

```text
$ kubectl describe configmap my-config-from-cmd
Name:         my-config-from-cmd
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
password:
----
123456
username:
----
tomcat

BinaryData
====

Events:  <none>
```

### 从生成器创建一个 ConfigMap

从 Kubernetes 1.14 版及更高版本开始，可以使用 kubectl 通过 Kustomize 管理对象：
一种旨在自定义 Kubernetes 配置的工具。
它的功能之一是 configMapGenerator，它从文件或文字生成 ConfigMap。

ConfigMap 可以使用生成器创建，然后应用于在 ApiServer 上创建对象。您应该在目录内的 `customization.yaml` 中指定生成器。

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: my-namespace
configMapGenerator:
  - name: my-map
files:
  - data/file1.json
```
