---
title: "Sudoer"
sequence: "103"
---

The `sudo` command stands for "**Super User DO**" and
temporarily elevates the privileges of a regular user for administrative tasks.

## CentOS 7

By default, CentOS 7 has a user group called the "wheel" group.
Members of the `wheel` group are automatically granted `sudo` privileges.
Adding a user to this group is a quick and easy way to grant sudo privileges to a user.

**Step 1: Verify the Wheel Group is Enabled**

Your CentOS 7 installation may or may not have the `wheel` group enabled.

Open the configuration file by entering the command:

```text
visudo
```

Scroll through the configuration file until you see the following entry:

```text
## Allows people in group wheel to run all commands

# %wheel        ALL=(ALL)       ALL
```

If the second line begins with the `#` sign, it has been disabled and marked as a comment.
Just delete the `#` sign at the beginning of the second line, so it looks like the following:

```text
%wheel        ALL=(ALL)       ALL
```

Then save the file and exit the editor.

**Note**: If this line didn't start with a `#` sign, you don't need to make any changes.
The wheel group is already enabled, and you can close the editor.

Step 2: Add User to Group

To add a user to the `wheel` group, use the command:

```text
usermod -aG wheel UserName
```

Step: 3 Switch to the Sudo User

Switch to the new (or newly-elevated) user account with the `su` (**substitute user**) command:

```text
su - UserName
```

Enter the password if prompted. The terminal prompt should change to include the UserName.

Enter the following command to list the contents of the /root directory:

```text
sudo ls -la /root
```

The terminal should request the password for UserName.
Enter it, and you should see a display of the list of directories.
Since listing the contents of `/root` requires sudo privileges,
this works as a quick way to prove that UserName can use the `sudo` command.
