---
title: "Service 四种服务类型"
sequence: "104"
---

Kubernetes Service 有四种类型：`ClusterIP`，`NodePort`，`LoadBalancer` 和 `ExternalName`。

```text
ClusterIP --> NodePort --> LoadBalancer
```

## ClusterIP

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-cluster-ip-service
spec:
  type: ClusterIP # Optional field (default)
  clusterIP: 10.96.96.96 # within service cluster ip range
  selector:
    app: nginx
  ports:
    - name: http
      protocol: TCP
      port: 8080        # Service Port
      targetPort: 80    # Pod     Port
```

## NodePort

节点端口必须在 `30000`-`32767` 范围内

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-node-port-service
spec:
  type: NodePort
  selector:
    app: nginx
  ports:
    - name: http
      protocol: TCP
      port: 8080         # Service Port
      targetPort: 80     # Pod     Port
      nodePort: 30000    # Node    Port, 30000-32767, Optional field
```

## LoadBalancer

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-load-balancer-service
spec:
  type: LoadBalancer
  clusterIP: 10.96.96.96
  loadBalancerIP: 123.123.123.123
  selector:
    app: web
  ports:
    - name: http
      protocol: TCP
      port: 80            # Service Port
      targetPort: 8080    # Pod     Port
```

## ExternalName

```yaml
apiVersion: v1
kind: Service
metadata:
  name: svc-app
spec:
  type: ExternalName
  externalName: svc-mysql.ns-db.svc.cluster.local
```
