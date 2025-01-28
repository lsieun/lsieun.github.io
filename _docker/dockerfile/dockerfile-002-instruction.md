---
title: "Instruction"
sequence: "102"
---

Docker runs **instructions** in a `Dockerfile` **in order**.

## ADD

ADD has two forms:

```text
ADD [--chown=<user>:<group>] [--chmod=<perms>] [--checksum=<checksum>] <src>... <dest>
ADD [--chown=<user>:<group>] [--chmod=<perms>] ["<src>",... "<dest>"]
```

The latter form is required for paths containing **whitespace**.

> 如果路径中有空格，要使用第二种方式

The `ADD` instruction copies **new files, directories or remote file URLs** from `<src>` and
adds them to the filesystem of the image at the path `<dest>`.

### wildcard

Each `<src>` may contain **wildcards** and matching will be done using Go's `filepath.Match` rules.

To add all files starting with “hom”:

```text
ADD hom* /mydir/
```

In the example below, `?` is replaced with any single character, e.g., “home.txt”.

```text
ADD hom?.txt /mydir/
```

The `<dest>` is **an absolute path**, or **a path relative** to `WORKDIR`,
into which the source will be copied inside the destination container.

## CMD

The `CMD` instruction has three forms:

- `CMD ["executable","param1","param2"]` (exec form, this is the **preferred form**)
- `CMD ["param1","param2"]` (as default parameters to `ENTRYPOINT`)
- `CMD command param1 param2` (shell form)

> The `exec` form is parsed as a JSON array,
> which means that you must use double-quotes (`"`) around words not single-quotes (`'`).

There can only be one `CMD` instruction in a `Dockerfile`.
If you list more than one `CMD` then only the last `CMD` will take effect.

> 只有一个 CMD

**The main purpose of a `CMD` is to provide defaults for an executing container.**
These defaults can include an `executable`, or they can omit the executable,
in which case you must specify an `ENTRYPOINT` instruction as well.

### CMD VS RUN

Do not confuse `RUN` with `CMD`.
`RUN` actually runs a command and commits the result;
`CMD` does not execute anything at **build time**, but specifies the intended command for **the image**.

## COPY

COPY has two forms:

```text
COPY [--chown=<user>:<group>] [--chmod=<perms>] <src>... <dest>
COPY [--chown=<user>:<group>] [--chmod=<perms>] ["<src>",... "<dest>"]
```

This latter form is required for paths containing **whitespace**.

The `COPY` instruction copies **new files or directories** from `<src>` and
adds them to the filesystem of the container at the path `<dest>`.

### ADD VS COPY

ADD 和 COPY 都是 Dockerfile 中常用的指令，它们主要用来将本地主机上的文件复制到 Docker 镜像中。

ADD 指令除了复制本地文件，还支持在复制过程中自动解压缩 tar 包并能够将 URL 文件下载并复制到 Docker 镜像中。
当使用 ADD 指令复制文件时，Docker 会自动尝试解压缩文件，这有时可能会导致不必要的麻烦。
同时，由于 ADD 指令还包含诸如下载和解压缩等操作，因此构建时的速度也会比 COPY 指令慢一些。

COPY 指令用于从构建上下文中复制文件到容器中，其不包含 ADD 指令的那些额外功能。
在复制文件时不会执行任何解压操作。
**因此，建议优先使用 COPY 指令，并且只有当确实需要 ADD 的额外功能时才使用它。**

因此，总的来说，有一些明显的区别：

- ADD 命令可以自动处理 URL，解压缩本地文件，所以具有更多的功能；
- COPY 命令只是复制本地文件，不做其他特殊处理，因此构建速度可能会更快，同时更推荐使用 COPY 命令。

## ENTRYPOINT

An `ENTRYPOINT` allows you to configure a container that will run as an executable.

ENTRYPOINT has two forms:

The **exec** form, which is the preferred form:

```text
ENTRYPOINT ["executable", "param1", "param2"]
```

The `shell` form:

```text
ENTRYPOINT command param1 param2
```

### Understand how CMD and ENTRYPOINT interact

Both `CMD` and `ENTRYPOINT` instructions define what command gets executed when running a container.
There are few rules that describe their co-operation.

- `Dockerfile` should specify at least one of `CMD` or `ENTRYPOINT` commands.
- `ENTRYPOINT` should be defined when using the container as an executable.
- `CMD` should be used as a way of defining default arguments for an `ENTRYPOINT` command or
  for executing an ad-hoc command in a container.
- `CMD` will be overridden when running the container with alternative arguments.

## ENV

```text
ENV <key>=<value> ...
```

The `ENV` instruction sets the environment variable `<key>` to the value `<value>`.

> 作用

This value will be in the environment for all subsequent instructions in the **build stage** and
**can be replaced** inline in many as well.

> 作用范围 + 可以被替换

### quotes + backslashes

The value will be interpreted for other environment variables,
so **quote characters** will be removed if they are not escaped.
Like command line parsing, **quotes** and **backslashes** can be used to include spaces within values.

```text
ENV MY_NAME="John Doe"
ENV MY_DOG=Rex\ The\ Dog
ENV MY_CAT=fluffy
```

### multiple environment-variables

The `ENV` instruction allows for multiple `<key>=<value> ...` variables to be set at one time:

```text
ENV MY_NAME="John Doe" MY_DOG=Rex\ The\ Dog \
    MY_CAT=fluffy
```

### replace

The environment variables set using `ENV` will persist when a container is run from the resulting image.
You can view the values using `docker inspect`, and change them using:

```text
docker run --env <key>=<value>
```

### Alternative syntax

The `ENV` instruction also allows an alternative syntax `ENV <key> <value>`, omitting the `=`. For example:

```text
ENV MY_VAR my-value
```

This syntax **does not allow for multiple environment-variables** to be set in a single `ENV` instruction,
and can be confusing.

**The alternative syntax is supported for backward compatibility,
but discouraged for the reasons outlined above,
and may be removed in a future release.**

## EXPOSE

```text
EXPOSE <port> [<port>/<protocol>...]
```

The `EXPOSE` instruction informs Docker that the container listens on the specified network ports at runtime.
You can specify whether the port listens on `TCP` or `UDP`, and the default is `TCP` if the protocol is not specified.

## FROM

A `Dockerfile` must begin with a `FROM` instruction. 

```text
FROM [--platform=<platform>] <image> [AS <name>]
FROM [--platform=<platform>] <image>[:<tag>] [AS <name>]
FROM [--platform=<platform>] <image>[@<digest>] [AS <name>]
```

- `ARG` is the only instruction that may precede `FROM` in the `Dockerfile`.
- `FROM` can appear multiple times within a single `Dockerfile` to create multiple images or
  use one build stage as a dependency for another.
  Each `FROM` instruction clears any state created by previous instructions.
- Optionally a name can be given to a new build stage by adding `AS name` to the `FROM` instruction.
  The name can be used in subsequent `FROM` and `COPY --from=<name>` instructions
  to refer to the image built in this stage.

```text
FROM eclipse-temurin:17-jdk-jammy as builder
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} application.jar
RUN java -Djarmode=layertools -jar application.jar extract

FROM eclipse-temurin:17-jdk-jammy
COPY --from=builder dependencies/ ./
COPY --from=builder snapshot-dependencies/ ./
COPY --from=builder spring-boot-loader/ ./
COPY --from=builder application/ ./
ENTRYPOINT ["java", "org.springframework.boot.loader.JarLauncher"]
```

### Understand how ARG and FROM interact

`FROM` instructions support variables that are declared by any `ARG` instructions that occur before the first `FROM`.

```text
ARG  CODE_VERSION=latest
FROM base:${CODE_VERSION}
CMD  /code/run-app

FROM extras:${CODE_VERSION}
CMD  /code/run-extras
```

An `ARG` declared before a `FROM` is outside a build stage, so it can't be used in any instruction after a `FROM`.
To use the default value of an `ARG` declared before the first `FROM`
use an `ARG` instruction without a value inside a build stage:

```text
ARG VERSION=latest
FROM busybox:$VERSION
ARG VERSION
RUN echo $VERSION > image_version
```

## MAINTAINER (deprecated)

```text
MAINTAINER <name>
```

The `MAINTAINER` instruction sets the `Author` field of the generated images.

The `LABEL` instruction is a much more flexible version of this, and you should use it instead,
as it enables setting any metadata you require, and can be viewed easily,
for example with `docker inspect`.

To set a label corresponding to the `MAINTAINER` field you could use:

```text
LABEL org.opencontainers.image.authors="SvenDowideit@home.org.au"
```

## RUN

RUN has 2 forms:

- `RUN <command>` (shell form, the command is run in a shell, which by default is `/bin/sh -c` on Linux or `cmd /S /C` on Windows)
- `RUN ["executable", "param1", "param2"]` (exec form)

## WORKDIR

```text
WORKDIR /path/to/workdir
```

The `WORKDIR` instruction sets the working directory
for any `RUN`, `CMD`, `ENTRYPOINT`, `COPY` and `ADD` instructions
that follow it in the `Dockerfile`.

> 受到影响的 Instruction 有哪些

**If the `WORKDIR` doesn't exist, it will be created**
even if it's not used in any subsequent `Dockerfile` instruction.

> 如果不存在，就会创建

The `WORKDIR` instruction can resolve environment variables previously set using `ENV`.
You can only use environment variables explicitly set in the `Dockerfile`. For example:

> WORKDIR + ENV

```text
ENV DIRPATH=/path
WORKDIR $DIRPATH/$DIRNAME
RUN pwd
```

If not specified, the default working directory is `/`.
In practice, if you aren't building a Dockerfile from scratch (`FROM scratch`),
the `WORKDIR` may likely be set by the base image you're using.

> 默认值

Therefore, to avoid unintended operations in unknown directories,
it is best practice to set your `WORKDIR` explicitly.

> 最佳实践
