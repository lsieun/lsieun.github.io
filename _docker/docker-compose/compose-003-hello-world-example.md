---
title: "HelloWorld Example"
sequence: "103"
---

第一步，创建 `test` 目录：

```text
$ mkdir test && cd test
```

第二步，添加 `compose.yaml` 文件：

```text
vi compose.yaml
```

内容如下：

```yaml
services:
  my-test:
    image: hello-world
```

第三步，启动：

```text
$ docker compose up
[+] Building 0.0s (0/0)                                                                                                                   
[+] Running 2/0
 ✔ Network test_default      Created                                                                                                 0.0s 
 ✔ Container test-my-test-1  Created                                                                                                 0.0s 
Attaching to test-my-test-1
test-my-test-1  | 
test-my-test-1  | Hello from Docker!
test-my-test-1  | This message shows that your installation appears to be working correctly.
...
```

第四步，查看 container：

```text
$ docker ps -a
CONTAINER ID   IMAGE         COMMAND    CREATED              STATUS                          PORTS     NAMES
e9adcf1b5ceb   hello-world   "/hello"   About a minute ago   Exited (0) About a minute ago             test-my-test-1
```
