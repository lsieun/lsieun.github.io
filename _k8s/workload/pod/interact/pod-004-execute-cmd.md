---
title: "Executing commands in running containers"
sequence: "104"
---

## Invoking a single command in the container

```text
$ kubectl exec kiada -- ps aux
USER        PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root          1  0.0  0.9 585196 37152 ?        Ssl  03:55   0:00 node app.js
root         30  0.0  0.0   7632  2720 ?        Rs   06:54   0:00 ps aux
```

```text
$ kubectl exec kiada -- curl -s localhost:8080
Kiada version 0.1. Request processed by "kiada". Client IP: ::ffff:127.0.0.1
```

### Why use a double dash in the kubectl exec command?

The double dash (`--`) in the command delimits **kubectl arguments** from the
**command to be executed in the container**.
The use of the double dash isn't necessary if the command has no arguments that begin with a dash.

If you omit the double dash in the previous example,
the `-s` option is interpreted as an option for `kubectl exec` and results in the following misleading error:

```text
$ kubectl exec kiada curl -s localhost:8080
The connection to the server localhost:8080 was refused - did you specify the right host or port?
```

This may look like the Node.js server is refusing to accept the connection, but the issue lies elsewhere.
The `curl` command is never executed.
The error is reported by kubectl itself when it tries to talk to the Kubernetes API server at `localhost:8080`,
which isn't where the server is.
If you run the kubectl options command,
you'll see that the `-s` option can be used to specify the address and port of the Kubernetes API server.
Instead of passing that option to `curl`, kubectl adopted it as its own.
Adding the double dash prevents this.

## Running an interactive shell in the container

```text
$ kubectl exec -it kiada -- bash
```

The `-it` is short for two options: `-i` and `-t`,
which indicate that you want to execute the bash command interactively
by passing the standard input to the container and marking it as a terminal (TTY).

### Not all containers allow you to run shells

The container image of your application contains many important debugging tools,
but this isn't the case with every container image.
To keep images small and improve security in the container,
most containers used in production don't contain any binary files other than those required for the
container's primary process.
This significantly reduces the attack surface,
but also means that you can't run shells or other tools in production containers.
Fortunately, a new Kubernetes feature called **ephemeral containers**
allows you to debug running containers by attaching a debug container to them.
