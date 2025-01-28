---
title: "YAML 创建"
sequence: "103"
---

## Example

### Deployment

File: `deploy-nginx.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: deploy-nginx
spec:
  selector:
    matchLabels:
      app: nginx
  replicas: 4
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: container-nginx
          image: nginx:1.25.0-bullseye
          ports:
            - containerPort: 80
```

```text
$ kubectl apply -f deploy-nginx.yaml
```

```text
$ kubectl get deployments
NAME           READY   UP-TO-DATE   AVAILABLE   AGE
deploy-nginx   4/4     4            4           81s
```

### Service

File: `svc-nginx.yaml`

```yaml
apiVersion: v1
kind: Service
metadata:
  name: svc-nginx
spec:
  type: NodePort
  selector: 
    app: nginx
  ports:
    - port: 8000
      targetPort: 80
      nodePort: 30000
```

注意：

- `spec.ports.port`: Service Port
- `spec.ports.targetPort`: Pod/Container Port
- `spec.ports.nodePort`: Node Port

```text
$ kubectl apply -f svc-nginx.yaml
```

```text
$ kubectl get services -o wide
NAME         TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE     SELECTOR
kubernetes   ClusterIP   10.96.0.1        <none>        443/TCP          9d      <none>
svc-nginx    NodePort    10.107.181.221   <none>        8000:30000/TCP   3m43s   app=nginx    # 注意，这里的 selector
```

```text
$ curl 10.107.181.221:8000
```

浏览器访问：

```text
http://192.168.80.131:30000/
http://192.168.80.231:30000/
http://192.168.80.232:30000/
```

```text
$ kubectl describe services svc-nginx
Name:                     svc-nginx
Namespace:                default
Labels:                   <none>
Annotations:              <none>
Selector:                 app=nginx
Type:                     NodePort
IP Family Policy:         SingleStack
IP Families:              IPv4
IP:                       10.107.181.221
IPs:                      10.107.181.221
Port:                     <unset>  8000/TCP
TargetPort:               80/TCP
NodePort:                 <unset>  30000/TCP
Endpoints:                10.244.167.206:80,10.244.167.207:80,10.244.203.14:80 + 1 more...    # 注意，这里是四个
Session Affinity:         None
External Traffic Policy:  Cluster
Events:                   <none>
```

```text
$ kubectl scale deploy deploy-nginx --replicas=2
```

```text
$ kubectl describe services svc-nginx
Name:                     svc-nginx
Namespace:                default
Labels:                   <none>
Annotations:              <none>
Selector:                 app=nginx
Type:                     NodePort
IP Family Policy:         SingleStack
IP Families:              IPv4
IP:                       10.107.181.221
IPs:                      10.107.181.221
Port:                     <unset>  8000/TCP
TargetPort:               80/TCP
NodePort:                 <unset>  30000/TCP
Endpoints:                10.244.167.207:80,10.244.203.14:80    # 注意，这里变成了两个
Session Affinity:         None
External Traffic Policy:  Cluster
Events:                   <none>
```

```text
$ sudo kubeadm config view --kubeconfig=~/kubeconfig.yaml
```
