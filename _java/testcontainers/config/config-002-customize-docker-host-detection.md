---
title: "Configuration locations"
sequence: "102"
---

Testcontainers will attempt to detect the Docker environment and configure everything to work automatically.

For advanced users, the Docker host connection can be configured via configuration in `~/.testcontainers.properties`.
Note that these settings require use of the `EnvironmentAndSystemPropertyClientProviderStrategy`.
The example below illustrates usage:

```text
docker.client.strategy=org.testcontainers.dockerclient.EnvironmentAndSystemPropertyClientProviderStrategy
docker.host=tcp\://my.docker.host\:1234     # Equivalent to the DOCKER_HOST environment variable. Colons should be escaped.
docker.tls.verify=1                         # Equivalent to the DOCKER_TLS_VERIFY environment variable
docker.cert.path=/some/path                 # Equivalent to the DOCKER_CERT_PATH environment variable
```

In addition, you can deactivate this behaviour by specifying:

```text
dockerconfig.source=autoIgnoringUserProperties # 'auto' by default
```
