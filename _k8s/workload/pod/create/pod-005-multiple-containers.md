---
title: "Running multiple containers in a pod"
sequence: "105"
---

You can run a reverse proxy alongside the Node.js application in a **sidecar container**,
and let it handle HTTPS requests on behalf of the application.
A very popular software package that can provide this functionality is **Envoy**.

## Envoy

The Envoy proxy is a high-performance open source service proxy originally built by Lyft
that has since been contributed to the Cloud Native Computing Foundation.


```text
$ kubectl port-forward kiada-ssl 8080 8443 9901
Forwarding from 127.0.0.1:8080 -> 8080
Forwarding from [::1]:8080 -> 8080
Forwarding from 127.0.0.1:8443 -> 8443
Forwarding from [::1]:8443 -> 8443
Forwarding from 127.0.0.1:9901 -> 9901
Forwarding from [::1]:9901 -> 9901
```

```text
$ curl localhost:8080
Kiada version 0.2. Request processed by "kiada-ssl". Client IP: ::ffff:127.0.0.1
```

```text
$ curl https://localhost:8443 --insecure
Kiada version 0.2. Request processed by "kiada-ssl". Client IP: ::ffff:127.0.0.1
```

## Why use the --insecure option?

## Displaying logs of pods with multiple containers

The `kiada-ssl` pod contains two containers, so if you want to display the logs,
you must specify the name of the container using the `--container` or `-c` option.

```text
$ kubectl logs kiada-ssl -c kiada
```

```text
$ kubectl logs kiada-ssl -c envoy
```

## Running commands in containers of multi-container pods

If you'd like to run a shell or another command in one of the pod's containers using the `kubectl exec` command,
you also specify the container name using the `--container` or `-c` option.

```text
$ kubectl exec -it kiada-ssl -c envoy -- bash
```

If you don't provide the name, `kubectl exec` defaults to the first container specified in the pod manifest.

## Reference

- [Envoy](https://www.envoyproxy.io/)

