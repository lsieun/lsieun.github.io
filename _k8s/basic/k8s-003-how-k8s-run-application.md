---
title: "K8s 如何运行 Application"
sequence: "103"
---

![](/assets/images/k8s/deploy-an-application-to-k8s.png)

These actions take place when you deploy the application:

1. You submit the application manifest to the Kubernetes API.
   The API Server writes the objects defined in the manifest to **etcd**.
2. A controller notices the newly created objects and creates several new
   objects - one for each application instance.
3. The **Scheduler** assigns a node to each instance.
4. The **Kubelet** notices that an instance is assigned to the **Kubelet**'s node.
   It runs the application instance via the Container Runtime.
5. The Kube Proxy notices that the application instances are ready to
   accept connections from clients and configures a load balancer for them.
6. The Kubelets and the Controllers monitor the system and keep the applications running.
