---
title: "Pod Restart"
sequence: "102"
---

## Auto-Restart

### Regular Container

```text
$ kubectl apply -f pod.kiada-ssl.yaml
pod/kiada-ssl created
```

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
$ curl -X POST http://localhost:9901/quitquitquit
OK
```

### Init Containers

If **init containers** are defined in the pod and
one of the pod's **regular containers** is restarted,
**the init containers are not executed again.**

## Restart Policy

By default, Kubernetes restarts the container
regardless of whether the process in the container exits with a zero or non-zero exit code - 
in other words, whether the container completes successfully or fails.
This behavior can be changed by setting the `restartPolicy` field in the pod's `spec`.

> 默认情况 + 如何修改

Surprisingly, the **restart policy** is configured at the **pod level** and applies to all its containers.
It can't be configured for each container individually.

> 作用范围：pod 级别

<table>
    <thead>
    <tr>
        <th>Restart Policy</th>
        <th>Description</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>Always</td>
        <td>
            Container is restarted regardless of the exit code the process in the container terminates with.
            This is the default restart policy.
        </td>
    </tr>
    <tr>
        <td>OnFailure</td>
        <td>
            The container is restarted only if the process terminates with a non-zero exit code,
            which by convention indicates failure.
        </td>
    </tr>
    <tr>
        <td>Never</td>
        <td>The container is never restarted - not even when it fails.</td>
    </tr>
    </tbody>
</table>

## time delay

Understanding the time delay inserted before a container is restarted

If you call Envoy's `/quitquitquit` endpoint several times,
you'll notice that each time it takes longer to restart the container after it terminates.
The pod's status is displayed as either `NotReady` or `CrashLoopBackOff`.
Here's what it means.

As shown in the following figure, the first time a container terminates, it is restarted **immediately**.
The next time, however, Kubernetes waits **ten seconds** before restarting it again.
This delay is then doubled to **20, 40, 80 and then to 160 seconds** after each subsequent termination.
From then on, the delay is kept at **five minutes**.
This delay that doubles between attempts is called **exponential back-off**.

```text
exponential back-off: immediately --> 10s -> 20s -> 40s -> 80s -> 160s -> 5m(300s)
```

In the worst case, a container can therefore be prevented from starting for up to **five minutes**.

```text
worst case: 5m
```

**The delay is reset to zero** when the container has run successfully for 10 minutes.
If the container must be restarted later, it is restarted immediately.

```text

```
