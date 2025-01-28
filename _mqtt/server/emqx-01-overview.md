---
title: "EMQX Overview"
sequence: "301"
---

## 下载

```text
https://www.emqx.io/zh/downloads
```

## Start EMQX

After the installation, you can start EMQX through the command of `systemctl` or `emqx`.

After EMQX is started successfully, you can visit `http://localhost:18083/` (opens new window)
(replace localhost with your actual IP address) through a browser to access EMQX Dashboard management console
for device connection and related indicator monitoring and management.

### Start EMQX in the background

Below command starts EMQX in background (daemon mode)

```text
emqx start
```

After the startup is successful, you can use the `emqx ping` command to check the running status of the node.
If pong is returned, it means the running status is OK:

```text
$ emqx ping
pong
```

## Reference

- [EMQX](https://www.emqx.io/)
  - [Docs](https://www.emqx.io/docs/en/latest/)
  - [EMQX 概览](https://www.emqx.io/docs/zh/v5.0/deploy/install-introduction.html)
