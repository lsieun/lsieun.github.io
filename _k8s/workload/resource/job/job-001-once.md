---
title: "一次性任务 Job"
sequence: "101"
---

Job 会创建一个或者多个 Pod，并将继续重试 Pod 的执行，直到指定数量的 Pod 成功终止。

- 随着 Pod 成功结束，Job 跟踪记录成功完成的 Pod 个数。 当数量达到指定的成功个数阈值时，**任务（即 Job）结束**。
- **删除 Job** 的操作会清除所创建的全部 Pod。
- **挂起 Job** 的操作会删除 Job 的所有活跃 Pod，直到 Job 被再次恢复执行。

一种简单的使用场景下，你会创建一个 Job 对象以便以一种可靠的方式运行某 Pod 直到完成。
当第一个 Pod 失败或者被删除（比如因为节点硬件失效或者重启）时，Job 对象会启动一个新的 Pod。
你也可以使用 Job 以并行的方式运行多个 Pod。

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: job-echo
  namespace: default
  labels:
    job-name: job-echo
spec:
  suspend: true                   # A
  ttlSecondsAfterFinished: 100    # B
  backoffLimit: 4    # C
  completions: 2     # C
  parallelism: 2     # C 
  template:
    spec:
      containers:
        - command:
            - echo
            - Hello, Job
          image: busybox:latest
          imagePullPolicy: Always
          name: echo
          resources: { }
      restartPolicy: Never
```

```text
$ kubectl apply -f job-echo.yaml
```

- A: `suspend` 在 `1.21+` 版本生效，其值为 `ture` 代表挂起 Job，`false` 代表 Job 立即执行。
- B: `ttlSecondsAfterFinished` 表示 Job 在执行结束之后（状态为 Completed 或 Failed ）自动清理。
  设置为 `0` 表示执行结束立即删除，不设置则不会清除，需要开启 `TTLAfterFinished` 特性。
- C:
  - `backoffLimit`：如果任务执行失败，失败多少次后不再执行
  - `completions`：有多少个 Pod 执行成功，认为任务是成功的，为空默认和 parallelism 数值一样
  - `parallelism`：并行执行任务的数量，如果 parallelism 数值大于未完成任务数，只会创建未完成的数量；
    比如 completions 是 4，并发是 3，第一次会创建 3 个 Pod 执行任务，第二次只会创建一个 Pod 执行任务

```text
$ kubectl get jobs
NAME       COMPLETIONS   DURATION   AGE
job-echo   0/2                      16s

$ kubectl describe jobs job-echo 
Name:             job-echo
Namespace:        default
Selector:         batch.kubernetes.io/controller-uid=7fffadaa-9b76-4f67-9962-7fbd36b4f6e0
Labels:           job-name=job-echo
Annotations:      batch.kubernetes.io/job-tracking: 
Parallelism:      2
Completions:      2
Completion Mode:  NonIndexed
Pods Statuses:    0 Active (0 Ready) / 0 Succeeded / 0 Failed
Pod Template:
  Labels:  batch.kubernetes.io/controller-uid=7fffadaa-9b76-4f67-9962-7fbd36b4f6e0
           batch.kubernetes.io/job-name=job-echo
           controller-uid=7fffadaa-9b76-4f67-9962-7fbd36b4f6e0
           job-name=job-echo
  Containers:
   echo:
    Image:      busybox:latest
    Port:       <none>
    Host Port:  <none>
    Command:
      echo
      Hello, Job
    Environment:  <none>
    Mounts:       <none>
  Volumes:        <none>
Events:
  Type    Reason     Age   From            Message
  ----    ------     ----  ----            -------
  Normal  Suspended  52s   job-controller  Job suspended
```

激活运行 job-echo：

```text
$ kubectl patch job/job-echo --type=strategic --patch '{"spec":{"suspend":false}}'
```

```text
$ kubectl get jobs
NAME       COMPLETIONS   DURATION   AGE
job-echo   2/2           3s         5m25s
```

```text
$ kubectl describe jobs job-echo 
Name:             job-echo
Namespace:        default
Selector:         batch.kubernetes.io/controller-uid=7fffadaa-9b76-4f67-9962-7fbd36b4f6e0
Labels:           job-name=job-echo
Annotations:      batch.kubernetes.io/job-tracking: 
Parallelism:      2
Completions:      2
Completion Mode:  NonIndexed
Start Time:       Fri, 25 Aug 2023 18:52:11 +0800
Completed At:     Fri, 25 Aug 2023 18:52:14 +0800
Duration:         3s
Pods Statuses:    0 Active (0 Ready) / 2 Succeeded / 0 Failed
Pod Template:
  Labels:  batch.kubernetes.io/controller-uid=7fffadaa-9b76-4f67-9962-7fbd36b4f6e0
           batch.kubernetes.io/job-name=job-echo
           controller-uid=7fffadaa-9b76-4f67-9962-7fbd36b4f6e0
           job-name=job-echo
  Containers:
   echo:
    Image:      busybox:latest
    Port:       <none>
    Host Port:  <none>
    Command:
      echo
      Hello, Job
    Environment:  <none>
    Mounts:       <none>
  Volumes:        <none>
Events:
  Type    Reason            Age    From            Message
  ----    ------            ----   ----            -------
  Normal  Suspended         5m35s  job-controller  Job suspended
  Normal  SuccessfulCreate  14s    job-controller  Created pod: job-echo-vcphr    # A
  Normal  SuccessfulCreate  14s    job-controller  Created pod: job-echo-wcgxs    # A
  Normal  Resumed           14s    job-controller  Job resumed                    # A
  Normal  Completed         11s    job-controller  Job completed                  # A
```

```text
$ kubectl get pods
NAME             READY   STATUS      RESTARTS   AGE
job-echo-vcphr   0/1     Completed   0          29s
job-echo-wcgxs   0/1     Completed   0          29s

# 等待 100 秒之后
$ kubectl get pods
No resources found in default namespace.
```
