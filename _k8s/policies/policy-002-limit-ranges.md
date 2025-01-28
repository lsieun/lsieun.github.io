---
title: "Limit Ranges"
sequence: "102"
---

By default, containers run with **unbounded compute resources** on a Kubernetes cluster.
Using Kubernetes resource quotas,
administrators (also termed cluster operators) can restrict consumption and creation of cluster resources
(such as CPU time, memory, and persistent storage) within a specified namespace.

Within a namespace, a Pod can consume as much CPU and memory as is allowed by the `ResourceQuotas`
that apply to that namespace.
As a **cluster operator**, or as a namespace-level administrator,
you might also be concerned about making sure that a single object
cannot monopolize all available resources within a namespace.

A `LimitRange` is a policy to constrain the resource allocations (limits and requests)
that you can specify for each applicable object kind (such as Pod or PersistentVolumeClaim) in a namespace.

A `LimitRange` provides constraints that can:

- Enforce minimum and maximum **compute resources usage** per `Pod` or `Container` in a namespace.
- Enforce minimum and maximum **storage request** per `PersistentVolumeClaim` in a namespace.
- Enforce a ratio between **request** and **limit** for a resource in a namespace.
- Set **default request/limit** for **compute resources** in a namespace and automatically inject them to `Containers` at runtime.

For example, you define a `LimitRange` with this manifest:

```yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: cpu-resource-constraint
spec:
  limits:
    - default: # this section defines default limits
        cpu: 500m
      defaultRequest: # this section defines default requests
        cpu: 500m
      max: # max and min define the limit range
        cpu: "1"
      min:
        cpu: 100m
      type: Container
```

along with a Pod that declares a CPU resource request of `700m`, but not a limit:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: example-conflict-with-limitrange-cpu
spec:
  containers:
    - name: demo
      image: google_containers/pause:3.9
      resources:
        requests:
          cpu: 700m
```

