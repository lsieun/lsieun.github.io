---
title: "Installation"
sequence: "102"
---

## Install Docker Compose

In order to get the latest release, take the lead of the [Docker docs](https://docs.docker.com/compose/install/) and
install Docker Compose from the binary in Docker's GitHub repository.

Check the [current release](https://github.com/docker/compose/releases) and if necessary, update it in the command below:

```text
sudo curl -L "https://github.com/docker/compose/releases/download/$(curl https://github.com/docker/compose/releases | grep -m1 '<a href="/docker/compose/releases/download/' | grep -o 'v[0-9:].[0-9].[0-9]')/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

```text
sudo curl -L "https://github.com/docker/compose/releases/download/2.6.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

Next, set the permissions to make the binary executable:

```text
sudo chmod +x /usr/local/bin/docker-compose
```

Then, verify that the installation was successful by checking the version:

```text
docker compose version
```




## Reference

- [Install Docker Compose](https://docs.docker.com/compose/install/)
- [How To Install and Use Docker Compose on CentOS 7](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-centos-7)
- [How to Install Docker Compose on CentOS 7](https://phoenixnap.com/kb/install-docker-compose-centos-7)
- [Docker-compose: /usr/local/bin/docker-compose : line 1: Not: command not found](https://stackoverflow.com/questions/58747879/docker-compose-usr-local-bin-docker-compose-line-1-not-command-not-found)

