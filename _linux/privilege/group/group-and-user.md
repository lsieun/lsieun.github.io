---
title: "Group + User"
sequence: "102"
---

[UP](/linux.html)


## Add

add your current user to the Docker group:

```text
$ sudo usermod -aG docker username
```

To do this, make sure you replace the `username` with your own.

## List

### List All Groups of a User

We can use the groups command to get all the groups of a user.

```text
$ groups liusen
liusen : liusen

$ groups root
root : root
```

### List Groups of the Current User

If you run the `groups` command without any user input, it will print the groups of the current user.

```text
$ groups
liusen
```

### List User Groups Along with Group ID

We can use `id` command to print the user information.
This command lists all the groups along with their group id.

```text
$ id liusen
uid=1000(liusen) gid=1000(liusen) groups=1000(liusen)

$ id root
uid=0(root) gid=0(root) groups=0(root)
```

### List All Users of a Group

We can use the `getent` command or the `/etc/groups` file to get all the users that belongs to a group.

```text
$ getent group sudo
sudo:x:27:journaldev,test

$ getent group sudo | cut -d: -f4
journaldev,test
```
