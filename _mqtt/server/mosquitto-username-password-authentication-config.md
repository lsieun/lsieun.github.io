---
title: "Mosquitto Username and Password Authentication"
sequence: "202"
---

## Mosquitto Broker Configuration

To configure the Mosquitto broker you will need to:

- Create a password file
- Edit the `mosquitto.conf` file to force password use.

To create a password file you need to use the `mosquitto_passwd` utility
that comes with the client tools when installing the mosquitto broker.

![](/assets/images/mqtt/mosquitto-passwd-exe.png)

### 方法一

Create a simple text file and enter the username and passwords, one for each line,
with the username and password separated by a colon as shown below.

File: `abc.txt`

```text
admin:123456
```

Close the file in the text editor.

Now you need to convert the password file which encrypts the passwords, Go to a command line and type:

```text
mosquitto_passwd -U <passwordFile>
```

```text
>mosquitto_passwd -U D:/abc.txt
```

Now if you open the password file again you should see this:

```text
admin:$7$101$+lw3yhyVlTQ38mv3$Bh1xGX/7esl22BOKWO8rDxC+JOC3x2JBzwlmZunjW4onfsrl4tRwGWAXGqtfxTJv5pC6Bes+1sNV3KmJfKJoZg==
```

### 方法二

You create the password file using the command

```text
mosquitto_passwd -c <passwordFile> <username>
```

```text
>mosquitto_passwd -c D:/passwordfile.txt xiaoming
Password:
Reenter password:
```

Note you need to enter a username for this to work. This adds the user to the password file.

You will be prompted to enter a password for the user.

Now you can use the command

```text
mosquitto_passwd -b <passwordFile> <username> <password>
```

```text
>mosquitto_passwd -b D:/passwordfile.txt xiaohong 123789
```

to add additional users to the file.

You can also delete users from the password file using the command

```text
mosquitto_passwd -D passwordfile user
```

## Using the Password file

You will need to copy the password file into the `etc\mosquitto` folder  (**Linux**) or
the `mosquitto` folder(**Windows**) and then edit the `mosquitto.conf` file to use it.

The two changes you normally make in the `mosquiito.conf` file are to set allow anonymous to `false` and
to set the `password_file` path.

It should be noted that since mosquitto v1.5 authentication is no longer a global setting
but can be configured on a per listener basis.

However, this must be enabled using the `per_listener_settings` setting at the top of the file.

To enable it use:

```text
per_listener_settings true
```

mosquitto.conf- Example Settings

```text
allow_anonymous false
password_file c:\mosquitto\passwords.txt #Windows machine
```

我的测试文件：

```text
listener 8899
allow_anonymous false
password_file d:\abc.txt
```

## Example Password File

An Example password file called `pwfile.example` is provided with the installation.

The file has three users:

- roger
- sub_client and
- pub_client.

- All three users have a password of `password`.

## Reloading the Password File

If you make a change to the configuration files including the password file you can restart the mosquitto broker.

## Reference

- [Mosquitto Username and Password Authentication -Configuration and Testing](http://www.steves-internet-guide.com/mqtt-username-password-example/)
