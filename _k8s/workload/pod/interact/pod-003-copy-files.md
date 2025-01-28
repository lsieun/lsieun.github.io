---
title: "Copying files to and from containers"
sequence: "103"
---

Kubectl offers the `cp` command to copy files or directories from your local computer
to a container of any pod or from the container to your computer.

```text
$ kubectl cp kiada:html/index.html ~/index.html
```

```text
$ kubectl cp ~/index.html kiada:html/
```
