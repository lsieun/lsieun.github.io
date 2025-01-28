---
title: "Image: build + tag"
sequence: "103"
---

## docker build

```text
docker build -t xxyyzz:1.5 .
```

```text
$ docker build --tag auth-service:latest .
```

## docker tag

```text
$ docker tag --help

Usage:  docker tag SOURCE_IMAGE[:TAG] TARGET_IMAGE[:TAG]

Create a tag TARGET_IMAGE that refers to SOURCE_IMAGE
```

## Reference

- [stefanvangastel/docker-load-and-push.sh](https://gist.github.com/stefanvangastel/d6b5b38e8716ea102b651c67c100225f)
