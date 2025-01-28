---
title: "Docker Daemon 日志"
sequence: "102"
---

The daemon logs may help you diagnose problems.

## Log Locations

The logs may be saved in one of a few locations,
depending on the operating system configuration and the logging subsystem used:


- Linux: Use the command `journalctl -xu docker.service`
  (or read `/var/log/syslog` or `/var/log/messages`, depending on your Linux Distribution)

## Enable Debugging

There are two ways to enable debugging.
The recommended approach is to set the `debug` key to `true` in the `/etc/docker/daemon.json` file.
This method works for every Docker platform.

```json
{
  "debug": true
}
```

## View stack traces

The Docker daemon log can be viewed by using one of the following methods:

- By running `journalctl -u docker.service` on Linux systems using `systemctl`
- `/var/log/messages`, `/var/log/daemon.log`, or `/var/log/docker.log` on **older Linux systems**

```text
sudo less /var/log/messages | grep docker
```

## Reference

- [Read the daemon logs](https://docs.docker.com/config/daemon/logs/)
