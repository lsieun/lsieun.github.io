---
title: "Attaching to a running container"
sequence: "105"
---

The `kubectl attach` command is another way to interact with a running container.
It attaches itself to the standard input, output and error streams of
the main process running in the container.
Normally, you only use it to interact with applications that read from the standard input.

## Using kubectl attach to see what the application prints to standard output

Attach to your kiada pod by running the following command:

```text
$ kubectl attach kiada
```

```text
$ kubectl port-forward kiada-stdin 8888:8080
Forwarding from 127.0.0.1:8888 -> 8080
Forwarding from [::1]:8888 -> 8080
```

```text
$ kubectl attach -i kiada-stdin
```

The `-i` option instructs `kubectl` to pass its standard input to the container.

Like the `kubectl exec` command, `kubectl attach` also supports the `--tty` or `-t` option,
which indicates that the standard input is a terminal (TTY),
but the container must be configured to allocate a terminal through the tty field in the container definition.

An additional field in the container definition, `stdinOnce`,
determines whether the standard input channel is closed when the attach session ends.
It's set to `false` by default, which allows you to use the standard input in every kubectl attach session.
If you set it to `true`, standard input remains open only during the first session.

