---
title: "Intro"
sequence: "101"
---

Docker Compose makes it easier for users to orchestrate the processes of Docker containers,
including starting up, shutting down, and setting up intra-container linking and volumes.

## Docker and Docker Compose Concepts

Using Docker Compose requires a combination of a bunch of different Docker concepts in one,
so before we get started let's take a minute to review the various concepts involved.
If you're already familiar with Docker concepts like **volumes**, **links**, and **port forwarding**
then you might want to go ahead and skip on to the next section.

### Docker Images

**Each Docker container is a local instance of a Docker image.**
You can think of a Docker image as a complete Linux installation.
Usually a minimal installation contains only the bare minimum of packages needed to run the image.
These images use the kernel of the host system,
but since they are running inside a Docker container and only see their own file system,
it's perfectly possible to run a distribution like CentOS on an Ubuntu host (or vice-versa).

> Docker image --> Docker container

Most Docker images are distributed via the [Docker Hub](https://hub.docker.com/),
which is maintained by the Docker team.
Most popular open source projects have a corresponding image uploaded to the Docker Registry,
which you can use to deploy the software.
When possible, it's best to grab “official” images,
since they are guaranteed by the Docker team to follow Docker best practices.

> Docker images --> Docker Hub

### Communication Between Docker Images

Docker containers are isolated from the host machine,
meaning that by default the host machine has no access to the file system inside the Docker container,
nor any means of communicating with it via the network.
This can make configuring and working with the image running inside a Docker container difficult.

> Docker container --> communite ---> host machine

Docker has **three primary ways** to work around this.
**The first and most common** is to **have Docker specify environment variables**
that will be set inside the Docker container.
The code running inside the Docker container will then check the values of these environment variables on startup
and use them to configure itself properly.

> first: environment variables

Another commonly used method is a **Docker data volume**.
Docker volumes come in two flavors — **internal** and **shared**.

> second: Docker data volume = internal + shared

Specifying an **internal volume** just means that for a folder you specify for a particular Docker container,
the data will be persisted when the container is removed.
For example, if you wanted to make sure your log files persisted you might specify an internal `/var/log` volume.

> internal volume

A **shared volume** maps a folder inside a Docker container onto a folder on the host machine.
This allows you to easily share files between the Docker container and the host machine.

> shared volume

**The third way** to communicate with a Docker container is via the **network**.
Docker allows communication between different Docker containers via `links`,
as well as port forwarding, allowing you to forward ports from inside the Docker container to ports on the host server.
For example, you can create a link to allow your WordPress and MariaDB Docker containers
to talk to each other and use port-forwarding to expose WordPress to the outside world so that users can connect to it.

> third: network

## Reference

- [Compose file Overview](https://docs.docker.com/compose/compose-file/)
    - [Version and name top-level element](https://docs.docker.com/compose/compose-file/04-version-and-name/)
    - [Services top-level element](https://docs.docker.com/compose/compose-file/05-services/)
    - [Networks top-level element](https://docs.docker.com/compose/compose-file/06-networks/)
    - [Volumes top-level element](https://docs.docker.com/compose/compose-file/07-volumes/)
    - [Configs top-level element](https://docs.docker.com/compose/compose-file/08-configs/)
    - [Secrets top-level element](https://docs.docker.com/compose/compose-file/09-secrets/)
    - [Fragments](https://docs.docker.com/compose/compose-file/10-fragments/)
    - [Extensions](https://docs.docker.com/compose/compose-file/11-extension/)
    - [Interpolation](https://docs.docker.com/compose/compose-file/12-interpolation/)
    - [Merge and override](https://docs.docker.com/compose/compose-file/13-merge/)
