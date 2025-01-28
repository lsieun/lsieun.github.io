---
title: "EMQX Installation on Linux"
sequence: "302"
---

## Start EMQX using systemctl

```text
$ sudo systemctl start emqx
```

Check if the service is working properly:

```text
$ sudo systemctl status emqx
```

## Start EMQX using tar.gz package

Switch to the directory where EMQX was unzipped and execute the following command to start EMQX:

```text
./bin/emqx start
```

In development mode, you can use the `console` command to start EMQX on the console
and view the startup and runtime logs printed to the console.

```text
./bin/emqx console
```

