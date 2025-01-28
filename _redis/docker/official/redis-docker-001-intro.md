---
title: "Redis Docker"
sequence: "101"
---

## 镜像

The `redis` images come in many flavors, each designed for a specific use case.

### Debian


```text
redis:<version>
```

This is the defacto image.
If you are unsure about what your needs are, you probably want to use this one.

```text
如果不确定，就使用这个版本
```

It is designed to be used both as a throw away container
(mount your source code and start the container to start your app),
as well as the base to build other images off of.

```text
两个用途：throw away container + the base to build other images
```

Some of these tags may have names like `bullseye` in them.
These are the suite code names for releases of `Debian` and indicate which release the image is based on.
If your image needs to install any additional packages beyond what comes with the image,
you'll likely want to specify one of these explicitly to minimize breakage when there are new releases of Debian.

```text
Debian 版本的标签
```

- 12: bookworm
- 11: bullseye
- 10: buster
- 09: stretch
- 08: jessie
- 07: wheezy
- 06: squeeze
- 05: lenny
- 04: etch

### Alpine

```text
redis:<version>-alpine
```

This image is based on the popular `Alpine` Linux project, available in the alpine official image.
Alpine Linux is much smaller than most distribution base images (~5MB),
and thus leads to much slimmer images in general.

```text
特点：体积小
```

This variant is useful when final image size being as small as possible is your primary concern.
The main caveat to note is that it does use `musl libc` instead of `glibc and friends`,
so software will often run into issues depending on the depth of their `libc` requirements/assumptions.

```text
需要注意的地方：libc 的依赖不同
```

To minimize image size,
it's uncommon for additional related tools (such as `git` or `bash`) to be included in Alpine-based images.
Using this image as a base, add the things you need in your own `Dockerfile`.

```text
不包含的工具：git、bash
```

## Reference

- [redis](https://hub.docker.com/_/redis)
- [Redis cluster and sentinel with docker-From Zero to Hero -part III](https://blog.devops.dev/redis-cluster-and-sentinel-with-docker-from-zero-to-hero-part-iv-63ba9d196cc3)
