---
title: "DNS"
sequence: "dns"
---

```text
docker pull sameersbn/bind:latest
docker run --name bind -d --restart=always \
  --publish 53:53/tcp --publish 53:53/udp --publish 10000:10000/tcp \
  --volume /opt/bind:/data --env='WEBMIN_INIT_SSL_ENABLED=false' \
 --env='ROOT_PASSWORD=qwe123'  sameersbn/bind:latest
```

```text
> docker pull sameersbn/bind:9.16.1-20200524
> docker run --name dns-server -d --restart=always ^
  --publish 53:53/tcp --publish 53:53/udp --publish 10000:10000/tcp ^
  --volume D:/service/dns/data:/data ^
  --env='WEBMIN_INIT_SSL_ENABLED=false' ^
  --env='ROOT_PASSWORD=qwe123' ^
  sameersbn/bind:9.16.1-20200524
```

`root/password`

```text
$ docker pull ubuntu/bind9:9.18-22.04_edge
```


