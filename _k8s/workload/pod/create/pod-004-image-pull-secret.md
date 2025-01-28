---
title: "Image Pull Secrets"
sequence: "104"
---

In scenarios where we need to re-pull an image due to changes in credentials for accessing a private container registry,
Kubernetes allows us to specify image pull secrets.
When credentials change, creating a new image pull secret with updated credentials and
associating it with our deployment can trigger Kubernetes to re-pull the image.

Let's consider the following YAML file example that defines a secret:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: my-registry-secret
  type: kubernetes.io/dockerconfigjson
data:
  .dockerconfigjson: <base64-encoded credentials>
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  template:
    spec:
      containers:
        - name: my-container
          image: myregistry/my-image:latest
      imagePullSecrets:
        - name: my-registry-secret
```

## Reference

- [Image Pull Secrets](https://www.baeldung.com/ops/kubernetes-pull-image-again#image-pull-secrets)
