---
title: "Docker Logs"
sequence: "101"
---

Where are Docker container logs stored?
There's a short answer, and a long answer.
The short answer, that will satisfy your needs in the vast majority of cases, is:

```text
/var/lib/docker/containers/<container_id>/<container_id>-json.log
```

## Where Are Docker Container Logs Stored by Default?

By default, Docker containers emit logs to the `stdout` and `stderr` output streams.
**Containers are stateless**, and **the logs are stored on the Docker host in JSON files by default.**

## Why are logs stored in JSON files?

**The default logging driver is `json-file`.**

## What's a logging driver?

A logging driver is a mechanism for getting info from your running containers.
Here's a more elaborate explanation from the [Docker docs](https://docs.docker.com/config/containers/logging/configure/).
There are several different log drivers you can use except for
the default `json-file`, like `syslog`, `journald`, `fluentd`, or `logagent`.

## How to find the logs?

These logs are emitted from output streams, annotated with the **log origin**,
either `stdout` or `stderr`, and a **timestamp**.
Each log file contains information about only one container and is in JSON format.
**Remember, one log file per container.**
You find these JSON log files in the `/var/lib/docker/containers/` directory on a Linux Docker host.
The `<container_id>` here is the id of the running container.

```text
/var/lib/docker/containers/<container_id>/<container_id>-json.log
```

**It's dangerous to keep logs on the Docker host**
because they can build up over time and eat into your disk space.

## Debugging Docker Issues with Container Logs

Docker has a dedicated API for working with logs.
But, keep in mind, it will only work if you use the `json-file` log driver.
I strongly recommend not changing the log driver! Let's start debugging.

First of all, to list all running containers, use the `docker ps` command.

```text
docker ps
```

Then, with the `docker logs` command you can list the logs for a particular container.

```text
docker logs <container_id>
```

Most of the time you'll end up tailing these logs in real time, or checking the last few logs lines.
Using the `--follow` or `-f` flag will `tail -f` (follow) the Docker container logs:

```text
docker logs <container_id> -f
```

The `--tail` flag will show the last number of log lines you specify:

```text
docker logs <container_id> --tail N
```

The `-t` or `--timestamp` flag will show the timestamps of the log lines:

```text
docker logs <container_id> -t
```

The `--details` flag will show extra details about the log lines:

```text
docker logs <container_id> --details
```

But what if you only want to see specific logs? Luckily, `grep` works with Docker logs as well.

```text
docker logs <container_id> | grep pattern
```

This command will only show errors:

```text
docker logs <container_id> | grep -i error
```

Once an application starts growing, you tend to start using Docker Compose.
Don't worry, it has a logs command as well.

```text
docker-compose logs
```

This will display the logs from all services in the application defined in the Docker Compose configuration file.

## Reference

- [Where Are Docker Container Logs Stored?](https://sematext.com/blog/docker-logs-location/)
- [View container logs](https://docs.docker.com/config/containers/logging/)
- [Configure logging drivers](https://docs.docker.com/config/containers/logging/configure/)
