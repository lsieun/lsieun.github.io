---
title: "SkyWalking UI Image"
sequence: "skywalking-ui"
---

## How to use this image

Start a container to connect oap server whose address is `oap:12800`

```text
$ docker run --name oap-ui --restart always -d -e SW_OAP_ADDRESS=http://oap:12800 apache/skywalking-ui
```

## Configuration

We could set up environment variables to configure this image.

- `SW_OAP_ADDRESS`: The address of OAP server. Default value is `oap:12800`.
- `SW_TIMEOUT`: Reading timeout. Default value is `20000` (millisecond).
