---
title: "Dockerfile"
sequence: "101"
---

Docker can build images automatically by reading the instructions from a `Dockerfile`.
A `Dockerfile` is a text document
that contains all the commands a user could call on the command line to assemble an image.

## Example

File: `Dockerfile`

```text
FROM openjdk:8-jdk-alpine
LABEL org.opencontainers.image.authors="lsieun"
COPY target/docker-message-server-1.0.0.jar message-server-1.0.0.jar
ENTRYPOINT ["java","-jar","/message-server-1.0.0.jar"]
```

```text
docker build --tag=message-server:latest .
```

```text
docker inspect message-server
```

```text
docker run -p 8887:8888 message-server:latest
```

## Format

Here is the format of the `Dockerfile`:

```text
# Comment
INSTRUCTION arguments
```

The instruction is **not case-sensitive**.
However, convention is for them to be **UPPERCASE** to distinguish them from arguments more easily.

> 大小写：不区分大小写，但最好用大写

Docker runs instructions in a `Dockerfile` in order.
A Dockerfile must begin with a `FROM` instruction.
This may be after **parser directives**, **comments**, and **globally scoped `ARG`s**.
The `FROM` instruction specifies the **Parent Image** from which you are building.
`FROM` may only be preceded by one or more `ARG` instructions,
which declare arguments that are used in `FROM` lines in the `Dockerfile`.

Docker treats lines that begin with `#` as a comment,
unless the line is a valid **parser directive**.
A `#` marker anywhere else in a line is treated as an argument.
This allows statements like:

```text
# Comment
RUN echo 'we are running some # of cool things'
```

```text
IMAGE --> WORKDIR --> 
```

- File: `Dockerfile`

```text
FROM
WORKDIR
COPY
RUN
CMD
```

```text
FROM alpine
WORKDIR /app
COPY src/ /app
RUN echo "321" >> 1.txt
CMD tail -f 1.txt
```

```text
FROM mynexusrepo.com/python:3.7.1
ENV PYTHONUNBUFFERED=1
WORKDIR /code
COPY requirements.txt /code/
RUN pip install -r requirements.txt --default-timeout=1000 --no-cache-dir
COPY . /code/
CMD python /code/manage.py makemigrations && python /code/manage.py migrate && python /code/manage.py runserver 0.0.0.0:666
```

```text
docker build -t test .
docker run test
```

## Create a Dockerfile for an Image

```text
FROM ubuntu
MAINTAINER Rajesh kumar rajesh@devopsschool.com
RUN touch /opt/devopsschool.txt
```

## Create a docker image

```text
$ docker build -t devopsschool .
$ docker images
```

## Reference

- [Dockerfile reference](https://docs.docker.com/engine/reference/builder/)
- [Best practices for writing Dockerfiles](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
