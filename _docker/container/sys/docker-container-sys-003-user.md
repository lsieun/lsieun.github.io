---
title: "Docker User"
sequence: "103"
---

The default user within a container is `root` (`uid = 0`).
You can set a default user to run the first process with the Dockerfile `USER` instruction.

```text
FROM debian:stretch
RUN groupadd -g 999 appuser && \
    useradd -r -u 999 -g appuser appuser
USER appuser
CMD ["cat", "/tmp/secrets.txt"]
```

When starting a container, you can override the USER instruction by passing the `-u` option.

```text
-u="", --user="": Sets the username or UID used and optionally the groupname or GID for the specified command.
```

The followings examples are all valid:

```text
--user=[ user | user:group | uid | uid:gid | user:gid | uid:group ]
```

Note: If you pass a numeric user ID, it must be in the range of 0-2147483647.
If you pass a username, the user must exist in the container.

## Reference

- [docker run - User](https://docs.docker.com/engine/reference/run/#user)
- [为什么bitnami 安装的软件进入容器，用户名都是I have no name](https://blog.csdn.net/MyySophia/article/details/128936545)
- [Work With Non-Root Containers for Bitnami Applications](https://docs.bitnami.com/tutorials/work-with-non-root-containers)
- [Why non-root containers are important for security](https://docs.bitnami.com/tutorials/why-non-root-containers-are-important-for-security)
- [Understanding how uid and gid work in Docker containers](https://medium.com/@mccode/understanding-how-uid-and-gid-work-in-docker-containers-c37a01d01cf)
- [Processes In Containers Should Not Run As Root](https://medium.com/@mccode/processes-in-containers-should-not-run-as-root-2feae3f0df3b)
- [Just say no to root (in containers)](https://opensource.com/article/18/3/just-say-no-root-containers)
- [Running a Docker container as a non-root user](https://medium.com/redbubble/running-a-docker-container-as-a-non-root-user-7d2e00f8ee15)
- [How to Run a More Secure Non-Root User Container](https://projectatomic.io/blog/2016/01/how-to-run-a-more-secure-non-root-user-container/)
- []()


