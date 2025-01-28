---
title: "Docker Configuration files"
sequence: "106"
---

By default, the Docker command line stores its configuration files in a directory
called `.docker` within your `$HOME` directory.

Docker manages most of the files in the configuration directory, and you should not modify them.
However, you can modify the `config.json` file to control certain aspects of how the `docker` command behaves.

You can modify the `docker` command behavior using environment variables or command-line options.
You can also use options within `config.json` to modify some of the same behavior.
If an environment variable and the `--config` flag are set, the flag takes precedent over the environment variable.
Command line options override environment variables and
environment variables override properties you specify in a `config.json` file.

```text
command line option > environment variable > config.json
```

## docker login

```text
$ docker login docker.lan.net:8082
$ docker login docker.lan.net:8083
$ cat ~/.docker/config.json 
```

```text
{
    "auths": {
        "docker.lan.net:8082": {
            "auth": "YWRtaW46MTIzNDU2"
        },
        "docker.lan.net:8083": {
            "auth": "YWRtaW46MTIzNDU2"
        }
    }
}
```

```text
admin:123456 --> Base64 --> YWRtaW46MTIzNDU2
```

## Reference

- [Configuration files](https://docs.docker.com/engine/reference/commandline/cli/#configuration-files)
