---
title: "SSL Properties"
sequence: "ssl"
---

## ssl

| Name                                 | Description                                                     | Default Value |
|--------------------------------------|-----------------------------------------------------------------|---------------|
| `server.ssl.certificate`             | Path to a PEM-encoded SSL certificate file.                     |               |
| `server.ssl.certificate-private-key` | Path to a PEM-encoded private key file for the SSL certificate. |               |

To enable SSL support in our Spring Boot application,
we need to set the `server.ssl.enabled` property to `true` and define an SSL protocol:

```text
server.ssl.enabled=true
server.ssl.protocol=TLS
```

We should also configure the **password**, **type**, and **path to the key store** that holds the certificate:

```text
server.ssl.key-store-password=my_password
server.ssl.key-store-type=keystore_type
server.ssl.key-store=keystore-path
```

And we must also define the alias that identifies our key in the key store:

```text
server.ssl.key-alias=tomcat
```

