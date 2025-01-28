---
title: "Liveness Probe"
sequence: "104"
---

## Liveness Probe

Kubernetes can be configured to check whether an application is still alive by defining a **liveness probe**.
You can specify a liveness probe for each container in the pod.
Kubernetes runs the probe periodically to ask the application if it's still alive and well.
If the application doesn't respond, an error occurs, or the response is negative,
the container is considered unhealthy and is terminated.
The container is then restarted if the restart policy allows it.

Liveness probes can only be used in the pod's **regular containers**.
They can't be defined in **init containers**.

```text
适用范围：regular containers
```

## Types of liveness probes

Kubernetes can probe a container with one of the following three mechanisms:

- An HTTP GET probe sends a GET request to the container's IP address,
  on the network port and path you specify. If the probe receives a
  response, and the response code doesn't represent an error (in other
  words, if the HTTP response code is 2xx or 3xx), the probe is considered
  successful. If the server returns an error response code, or if it doesn't
  respond in time, the probe is considered to have failed.

- A TCP Socket probe attempts to open a TCP connection to the specified
  port of the container. If the connection is successfully established, the
  probe is considered successful. If the connection can't be established in
  time, the probe is considered failed.

- An Exec probe executes a command inside the container and checks the
  exit code it terminates with. If the exit code is zero, the probe is
  successful. A non-zero exit code is considered a failure. The probe is
  also considered to have failed if the command fails to terminate in time.


## Creating an HTTP GET liveness probe

File: `pod.kiada-liveness.yaml`

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: kiada-liveness
spec:
  containers:
  - name: kiada
    image: lsieun/kiada:0.2
    ports:
    - name: http
      containerPort: 8080
    livenessProbe:
      httpGet:
        path: /
        port: 8080
  - name: envoy
    image: lsieun/kiada-ssl-proxy:0.1
    imagePullPolicy: Always
    ports:
    - name: https
      containerPort: 8443
    - name: admin
      containerPort: 9901
    livenessProbe:
      httpGet:
        path: /ready
        port: admin
      initialDelaySeconds: 10
      periodSeconds: 5
      timeoutSeconds: 2
      failureThreshold: 3
```

```text
$ kubectl apply -f pod.kiada-liveness.yaml
$ kubectl port-forward kiada-liveness 8080 8443 9901
```

```text
$ kubectl logs kiada-liveness -c kiada -f
```

The liveness probe for the `envoy` container is configured to send HTTP
requests to Envoy's administration interface,
which doesn't log HTTP requests to the standard output,
but to the file `/tmp/envoy.admin.log` in the container's filesystem.
To display the log file, you use the following command:

```text
$ kubectl exec kiada-liveness -c envoy -- tail -f /tmp/envoy.admin.log
```

### Observing the liveness probe fail

```text
$ kubectl get events -w
```

```text
$ curl -X POST localhost:9901/healthcheck/fail
```

```text
$ curl -X POST localhost:9901/healthcheck/ok
```

```text
$ kubectl get po kiada-liveness
```

```text
$ kubectl describe pods kiada-liveness
```

```text
$ kubectl logs kiada-liveness -c envoy -p
$ kubectl logs kiada-liveness -c envoy --previous
```
