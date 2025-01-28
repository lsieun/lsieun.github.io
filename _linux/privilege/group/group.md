---
title: "Group"
sequence: "101"
---

[UP](/linux.html)


Two ways to List All Groups in Linux

- `/etc/group` file
- `getent` command

## /etc/group file

The `/etc/group` file contains all the local groups.
So, we can open this file and look at all the groups.

```text
$ cat /etc/group
root:x:0:
bin:x:1:
daemon:x:2:
sys:x:3:
adm:x:4:
tty:x:5:
disk:x:6:
lp:x:7:
mem:x:8:
kmem:x:9:
wheel:x:10:
cdrom:x:11:
mail:x:12:postfix
ftp:x:50:
audio:x:63:
nobody:x:99:
users:x:100:
ssh_keys:x:997:
sshd:x:74:
liusen:x:1000:liusen
docker:x:995:
```

If you are looking for a specific group, then use the `grep` command to filter it out.

```text
cat /etc/group | grep sudo
```

## getent command

Linux `getent` command fetch entries from databases supported by the Name Service Switch libraries.
We can use it to get all the groups information from the group database.

```text
getent group
```

## Linux List All Group Names

We can use `cut` command to print only the group names.
This is useful when we are looking for a specific group name presence in a shell script.

```text
$ cut -d: -f1 /etc/group
root
bin
daemon
sys
adm
tty
disk
...
```

We can use `cut` command with the `getent` command too.

```text
$ getent group | cut -d: -f1
root
bin
daemon
sys
adm
tty
disk
```

## Listing All Group Names in Alphabetical Order

The above commands output can be passed to the `sort` command to print the output in natural sorting order.

```text
$ getent group | cut -d: -f1 | sort
adm
audio
bin
cdrom
cgred
chrony
```

## Count of All the Linux Groups

If you are interested in the count of the linux groups, use the following commands.

```text
$ cat /etc/group | grep -c ""
43
$ getent group | grep -c ""
43
```
