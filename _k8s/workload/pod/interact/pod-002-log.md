---
title: "Pod Log"
sequence: "102"
---

Instead of writing the log to a file,
containerized applications usually log to the standard output (`stdout`) and standard error streams (`stderr`).
This allows the container runtime to intercept the output,
store it in a consistent location (usually `/var/log/containers`) and
provide access to the log without having to know where each application stores its log files.

## Retrieving a pod's log with `kubectl logs`:

```text
$ kubectl logs kiada
```

```text
$ kubectl logs <pod-name> -c <container-name>
$ kubectl logs <pod-name> -c <container-name> --tail=<number-of-lines>
$ kubectl logs <pod-name> -c <container-name> --follow
```

## Streaming logs using `kubectl logs -f`:

```text
$ kubectl logs kiada -f
```

## Displaying the timestamp of each logged line:

```text
$ kubectl logs kiada --timestamps=true
2023-08-04T03:55:00.590306848Z Kiada - Kubernetes in Action Demo Application
2023-08-04T03:55:00.590637617Z ---------------------------------------------
2023-08-04T03:55:00.590663749Z Kiada 0.1 starting...
2023-08-04T03:55:00.590736855Z Local hostname is kiada
2023-08-04T03:55:00.590750163Z Listening on port 8080
2023-08-04T05:57:52.596180275Z Received request for / from ::ffff:192.168.80.131
2023-08-04T06:00:36.103858223Z Received request for / from ::ffff:10.244.167.220
2023-08-04T06:04:07.589356200Z Received request for / from ::ffff:10.244.167.223
2023-08-04T06:12:00.465000445Z Received request for / from ::ffff:127.0.0.1
```

You can display timestamps by only typing `--timestamps` without the value.
For boolean options, merely specifying the option name sets the option to `true`.
This applies to all kubectl options that take a `Boolean` value and default to `false`.

```text
$ kubectl logs kiada --timestamps
```

## Displaying recent logs

The first option is when you want to only display logs from the past several seconds, minutes or hours.

```text
$ kubectl logs kiada --since=2m
Received request for / from ::ffff:10.244.167.223
Received request for / from ::ffff:127.0.0.1
```

The other option is to display logs produced after a specific date and time using the `--since-time` option.
The time format to be used is RFC3339.

```text
$ kubectl logs kiada --since-time=2020-02-01T09:50:00Z
```

## Displaying the last several lines of the log

Instead of using time to constrain the output,
you can also specify how many lines from the end of the log you want to display.

```text
$ kubectl logs kiada --tail=10
```

## Understanding the availability of the pod's logs

Kubernetes keeps a separate log file for each container.
They are usually stored in `/var/log/containers` on the node that runs the container.

```text
$ ls /var/log/containers/
calico-kube-controllers-68878489c8-2px9q_calico-system_calico-kube-controllers-ba80c1e10ba194e944ff70086d852b936648a61aa9cef244a43026774faa7782.log
calico-kube-controllers-68878489c8-2px9q_calico-system_calico-kube-controllers-d555bc520d30e87d87591439bb3f4ca3d37acc3aece473e4b7ddc89dfd7e8879.log
calico-node-rmlgb_calico-system_calico-node-9338b9b391e3bcd1efcb58c0c2e971f4b28d975230acab6346a5265f716d77ee.log
calico-node-rmlgb_calico-system_calico-node-abcf767b1a11eace90b59bcfb95d125040278b1cf41a925d7eb68baf30684c66.log
```

**A separate file is created for each container.**
If the container is restarted, its logs are written to a new file.
Because of this, if the container is restarted while you're following its log with `kubectl logs -f`,
the command will terminate,
and you'll need to run it again to stream the new container's logs.

```text
container 容器重启怎么办？
```

The `kubectl logs` command displays only the logs of the current container.
To view the logs from the previous container, use the `--previous` (or `-p`) option.

```text
查看上一个 container 的日志
```

Depending on your cluster configuration,
the log files may also be rotated when they reach a certain size.
In this case, `kubectl logs` will only display the current log file.
When streaming the logs, you must restart the command to switch to the new file when the log is rotated.

When you delete a pod, all its log files are also deleted.
To make pods' logs available permanently, you need to set up a central, cluster-wide logging system.

```text
删除 Pod 对 log 的影响
```

## What about applications that write their logs to files?

If your application writes its logs to a file instead of stdout,
you may be wondering how to access that file.
Ideally, you'd configure the centralized logging system to collect the logs,
so you can view them in a central location,
but sometimes you just want to keep things simple and don't mind accessing the logs manually.

In the next two sections, you'll learn how to copy log and
other files from the container to your computer and in the opposite direction,
and how to run commands in running containers.
You can use either method to display the log files or any other file inside the container.

## Reference

- [How to View Logs of a Pod in Kubernetes?](https://www.baeldung.com/devops/kubernetes-pod-logs)
