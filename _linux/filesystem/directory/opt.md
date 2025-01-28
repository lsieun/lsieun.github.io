---
title: "/opt"
sequence: "opt"
---

[UP](/linux.html)


The FHS defines `/opt` as "**reserved for the installation of add-on application software packages.**"
In this context, "add-on" means software that is not part of the system; for example,
any external or third-party software.
This convention has its roots in the old UNIX systems built by vendors like AT&T, Sun, and DEC.

## Using `/opt`

Let's take an internal application developed in a company, `CompanyApplication`, as an example.

If we don't package it using standard tools, such as `dpkg` or `rpm`,
we'll most likely put all the files related to `CompanyApplication` in a single directory.
So we'll have the binaries, libraries, and configuration together.
They won't be separated into different locations as a traditional UNIX system would have them.

Let's say we want to deploy our application on a server.
In this case, we can just copy the directory of our application in the `/opt/CompanyApplication` directory.

When needed, we can execute it directly from there.
**Therefore, when using `/opt`, installing our application is as simple as copying, extracting a TAR, or unzipping.**
**And when we don't need the application anymore, we can remove it simply by removing the directory under `/opt`.**

> 这里讲的好：要用它了，就解压的 /opt 目录就好；不用它了，直接从 /opt 目录删除就行

As a side note, we can also prefer using a `/opt/Company/CompanyApplication` directory structure.
In this case, we should use a LANANA registered company/provider name.

**Deploying software by copying a directory is unconventional for a traditional UNIX system.**
Normally a UNIX application would have its libraries, binaries, and other files in separate directories,
such as `/usr/local/bin`, and `/usr/local/lib`.

Let's see the difference between the UNIX way of deploying software and /opt.

## `/usr/local` vs `/opt`

The FHS defines `/usr/local` as “For use by the system administrator when installing software locally”.
This may be confusing, as this description is very similar to `/opt`.
On the other hand, there's an important difference.

The hierarchy under `/usr/local` should mimic the hierarchy under `/usr`.
This means we should place all the application binaries in `/usr/local/bin`,
and all the libraries in `/usr/local/lib`, and so on.
As a result, we'll place them along with the files of the other applications.

Therefore, **we can't have a single directory for each application when deploying into `/usr/local`.**
Instead, we organize them in the more conventional UNIX style that divides application files to separate directories.

Some of the reasons for this traditional approach are:

- When we have all the binaries in `/usr/local/bin`, we can just add this single directory to our `$PATH`,
  so we can execute all the binaries we installed without additional configuration.
- When all installed libraries are in `/usr/local/lib`, multiple binaries can share the same library,
  so we avoid having multiple copies of the same library on our system.

On the other hand, `/opt` doesn't have these directory structure restrictions.
As long as the applications in `/opt` are in separate directories,
they can have custom directory structures inside these directories.
They can have duplicate copies of libraries already installed in the system,
and they may require additional `$PATH` configuration to execute from the terminal.

Let's see some possible scenarios for /opt and /usr/local:

- Our application is a single binary, then we'll copy or link it to `/usr/local`
- We want to use an alternative of an existing system program build from source using `make`.
  In this case, we'll install it under `/usr/local`
- We're going to deploy an application, and by design, all of its files are in the same directory.
  Then, we'll deploy it by copying this directory into the `/opt/myapp` directory

## Reference

- [What does /opt mean in Linux?](https://www.baeldung.com/linux/opt-directory) 文章来源
- [Filesystem Hierarchy Standard](https://refspecs.linuxfoundation.org/FHS_3.0/index.html)
