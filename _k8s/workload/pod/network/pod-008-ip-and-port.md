---
title: "Pod: IP + Port"
sequence: "108"
---

## Pod: IP + Port

### IP

```text
$ kubectl get pods -o wide
NAME        READY   STATUS    RESTARTS   AGE    IP               NODE               NOMINATED NODE   READINESS GATES
nginx-pod   1/1     Running   0          100m   10.244.167.203   worker02.k8s.lab   <none>           <none>
```

### Port

```text
$ kubectl describe pods nginx-pod
Name:             nginx-pod
Namespace:        default
Priority:         0
Service Account:  default
Node:             worker02.k8s.lab/192.168.80.232
Status:           Running
IP:               10.244.167.203
IPs:
  IP:  10.244.167.203
Containers:
  nginx-container:
    Container ID:   docker://0c5bceb80651732a7e9049482b750ed6731...
    Image:          nginx:1.25.0-bullseye
    Image ID:       docker-pullable://nginx@sha256:e7058572cd3be...
    Port:           80/TCP    # 这里是端口信息
    Host Port:      0/TCP
```

## Connecting

- node-to-pod
- pod-to-pod
- port forwarding

### Connecting to the pod from the worker nodes

The Kubernetes network model dictates

- that **each pod is accessible from any other pod** and 
- that **each node can reach any pod on any node in the cluster**.

```text
$ curl 10.244.167.203:80
```

### Connecting from a one-off client pod

Creating a pod just to see if it can access another pod is useful
when you're specifically testing pod-to-pod connectivity.

```text
$ kubectl run --image=curlimages/curl:8.2.0 -it --restart=Never --rm client-pod curl 10.244.167.203:80
```

The `-it` option attaches your console to the container's standard input and output,
the `--restart=Never` option ensures that the pod is considered Completed
when the `curl` command and its container terminate,
and the `--rm` options removes the pod at the end.
The name of the pod is `client-pod` and the command executed in its container is `curl 10.244.2.4:8080`.

```text
$ kubectl run --image=curlimages/curl:8.2.0 -it --restart=Never --rm client-pod /bin/sh
If you don't see a command prompt, try pressing enter.
~ $ curl 10.244.203.12:8080
Kiada version 0.1. Request processed by "kiada". Client IP: ::ffff:10.244.167.223
~ $ ifconfig
eth0      Link encap:Ethernet  HWaddr BA:6C:3F:16:8E:25  
          inet addr:10.244.167.223  Bcast:0.0.0.0  Mask:255.255.255.255
          UP BROADCAST RUNNING MULTICAST  MTU:1450  Metric:1
          RX packets:11 errors:0 dropped:0 overruns:0 frame:0
          TX packets:8 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000 
          RX bytes:1053 (1.0 KiB)  TX bytes:569 (569.0 B)

lo        Link encap:Local Loopback  
          inet addr:127.0.0.1  Mask:255.0.0.0
          UP LOOPBACK RUNNING  MTU:65536  Metric:1
          RX packets:0 errors:0 dropped:0 overruns:0 frame:0
          TX packets:0 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000 
          RX bytes:0 (0.0 B)  TX bytes:0 (0.0 B)
```

### Connecting to pods via kubectl port forwarding

During development, the easiest way to talk to applications running in your pods is
to use the `kubectl port-forward` command,
which allows you to communicate with a specific pod through a proxy bound to a network port on your local computer.

To open a communication path with a pod, you don't even need to look up the pod's IP,
as you only need to specify its name and the port.
The following command starts a proxy that forwards your computer's local port `8080` to the `kubia` pod's port `8080`:

```text
$ kubectl port-forward kiada 8080
Forwarding from 127.0.0.1:8080 -> 8080
Forwarding from [::1]:8080 -> 8080
```

```text
$ curl localhost:8080
Kiada version 0.1. Request processed by "kiada". Client IP: ::ffff:127.0.0.1
```
