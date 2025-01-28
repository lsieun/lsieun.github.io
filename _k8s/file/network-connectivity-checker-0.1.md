---
title: "network-connectivity-checker-0.1"
sequence: "103"
---

## docker_entrypoint.sh

```text
#!/bin/sh

host=${1:-223.5.5.5}
echo "Checking network connectivity to ${host} ..."

ping ${host} -c 1 >/dev/null 2>/dev/null
pingExitCode=$?

if [ $pingExitCode = 0 ]; then
  echo "Host appears to be reachable"
  exit 0
else
  echo "Host unreachable!"
  exit 1
fi
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
$ docker build -t network-connectivity-checker:latest .
[+] Building 0.3s (7/7) FINISHED                                                                                                                                                                                                            docker:default
 => [internal] load .dockerignore                                                                                                                                                                                                                     0.0s
 => => transferring context: 2B                                                                                                                                                                                                                       0.0s
 => [internal] load build definition from Dockerfile                                                                                                                                                                                                  0.0s
 => => transferring dockerfile: 194B                                                                                                                                                                                                                  0.0s
 => [internal] load metadata for docker.io/library/busybox:latest                                                                                                                                                                                     0.1s
 => [internal] load build context                                                                                                                                                                                                                     0.0s
 => => transferring context: 374B                                                                                                                                                                                                                     0.0s
 => [1/2] FROM docker.io/library/busybox@sha256:1b0a26bd07a3d17473d8d8468bea84015e27f87124b283b91d781bce13f61370                                                                                                                                      0.2s
 => => resolve docker.io/library/busybox@sha256:1b0a26bd07a3d17473d8d8468bea84015e27f87124b283b91d781bce13f61370                                                                                                                                      0.0s
 => => extracting sha256:71d064a1ac7d46bdcac82ea768aba4ebbe2a05ccbd3a4a82174c18cf51b67ab7                                                                                                                                                             0.1s
 => => sha256:1b0a26bd07a3d17473d8d8468bea84015e27f87124b283b91d781bce13f61370 528B / 528B                                                                                                                                                            0.0s
 => => sha256:b539af69bc01c6c1c1eae5474a94b0abaab36b93c165c0cf30b7a0ab294135a3 1.46kB / 1.46kB                                                                                                                                                        0.0s
 => => sha256:71d064a1ac7d46bdcac82ea768aba4ebbe2a05ccbd3a4a82174c18cf51b67ab7 2.59MB / 2.59MB                                                                                                                                                        0.0s
 => [2/2] COPY docker_entrypoint.sh /docker_entrypoint.sh                                                                                                                                                                                             0.0s
 => exporting to image                                                                                                                                                                                                                                0.0s
 => => exporting layers                                                                                                                                                                                                                               0.0s
 => => writing image sha256:95b22be1111532cfa58f13072bd67ac8c43668a4ed6c8bf52a9ea2e33db63253                                                                                                                                                          0.0s
 => => naming to docker.io/library/network-connectivity-checker:latest
```

```text
$ docker tag network-connectivity-checker:latest registry.lsieun.cn/lsieun/network-connectivity-checker:0.1
$ docker push registry.lsieun.cn/lsieun/network-connectivity-checker:0.1
```
