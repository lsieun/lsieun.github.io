---
title: "重复性任务 CronJob"
sequence: "102"
---

CronJob 用于执行排期操作，例如备份、生成报告等。
一个 CronJob 对象就像 Unix 系统上的 crontab（cron table）文件中的一行。
它用 Cron 格式进行编写，并周期性地在给定的调度时间执行 Job。

## 编写 CronJob 声明信息

Cron 时间表语法

`.spec.schedule` 字段是必需的。该字段的值遵循 Cron 语法：

```text
# ┌───────────── 分钟 (0 - 59)
# │ ┌───────────── 小时 (0 - 23)
# │ │ ┌───────────── 月的某天 (1 - 31)
# │ │ │ ┌───────────── 月份 (1 - 12)
# │ │ │ │ ┌───────────── 周的某天 (0 - 6)（周日到周一；在某些系统上，7 也是星期日）
# │ │ │ │ │                          或者是 sun，mon，tue，web，thu，fri，sat
# │ │ │ │ │
# │ │ │ │ │
# * * * * *
```

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: cron-job-echo
spec:
  schedule: "* * * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
            - name: cron-job-echo
              image: busybox:latest
              imagePullPolicy: IfNotPresent
              command:
                - /bin/sh
                - -c
                - date; echo Hello from the Kubernetes cluster
          restartPolicy: OnFailure
```

```text
$ kubectl apply -f cron-job-echo.yaml
```

```text
$ kubectl get cronjobs
NAME            SCHEDULE    SUSPEND   ACTIVE   LAST SCHEDULE   AGE
cron-job-echo   * * * * *   False     0        <none>          15s
                            # A
```

```text
$ kubectl describe cronjobs cron-job-echo 
Name:                          cron-job-echo
Namespace:                     default
Labels:                        <none>
Annotations:                   <none>
Schedule:                      * * * * *
Concurrency Policy:            Allow
Suspend:                       False
Successful Job History Limit:  3
Failed Job History Limit:      1
Starting Deadline Seconds:     <unset>
Selector:                      <unset>
Parallelism:                   <unset>
Completions:                   <unset>
Pod Template:
  Labels:  <none>
  Containers:
   cron-job-echo:
    Image:      busybox:latest
    Port:       <none>
    Host Port:  <none>
    Command:
      /bin/sh
      -c
      date; echo Hello from the Kubernetes cluster
    Environment:     <none>
    Mounts:          <none>
  Volumes:           <none>
Last Schedule Time:  Fri, 25 Aug 2023 19:11:00 +0800
Active Jobs:         <none>
Events:
  Type    Reason            Age    From                Message
  ----    ------            ----   ----                -------
  Normal  SuccessfulCreate  3m29s  cronjob-controller  Created job cron-job-echo-28216028
  Normal  SawCompletedJob   3m26s  cronjob-controller  Saw completed job: cron-job-echo-28216028, status: Complete
  Normal  SuccessfulCreate  2m29s  cronjob-controller  Created job cron-job-echo-28216029
  Normal  SawCompletedJob   2m27s  cronjob-controller  Saw completed job: cron-job-echo-28216029, status: Complete
  Normal  SuccessfulCreate  89s    cronjob-controller  Created job cron-job-echo-28216030
  Normal  SawCompletedJob   86s    cronjob-controller  Saw completed job: cron-job-echo-28216030, status: Complete
  Normal  SuccessfulCreate  29s    cronjob-controller  Created job cron-job-echo-28216031
  Normal  SawCompletedJob   26s    cronjob-controller  Saw completed job: cron-job-echo-28216031, status: Complete
  Normal  SuccessfulDelete  26s    cronjob-controller  Deleted job cron-job-echo-28216028
```

```text
$ kubectl patch cronjobs/cron-job-echo --type=strategic --patch '{"spec":{"suspend":true}}'
cronjob.batch/cron-job-echo patched

$ kubectl get cronjobs
NAME            SCHEDULE    SUSPEND   ACTIVE   LAST SCHEDULE   AGE
cron-job-echo   * * * * *   True      0        49s             5m46s
                            # A
```
