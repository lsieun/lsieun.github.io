---
title: "Init Demo"
sequence: "101"
---

## docker_entrypoint.sh

```bash
#!/bin/sh

steps=${1:-5}

echo "Initialization started..."

for i in $(seq 1 $steps); do
  echo "Performing initialization procedure $i/$steps"
  sleep 1
done

echo "Initialization complete!"

```

## Dockerfile

```text
FROM busybox
COPY docker_entrypoint.sh /docker_entrypoint.sh
ENTRYPOINT ["/docker_entrypoint.sh"]
```

## Build

```text
$ chmod +x docker_entrypoint.sh
$ docker build -t init-demo:latest .
$ docker tag init-demo:latest registry.lsieun.cn/lsieun/kiada:0.1
$ docker push registry.lsieun.cn/lsieun/kiada:0.1
```
