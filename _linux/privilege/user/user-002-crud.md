---
title: "用户 CRUD"
sequence: "102"
---

[UP](/linux.html)


## Add User

### Step 1: Login as Administrator

If you're working on a local machine, log in to the system with administrator credentials.

If you're connecting to a remote machine (over a network), open a terminal window and enter the command:

```text
ssh root@server_ip_address
```

### Step 2: Create a New Sudo User

To add a new user, open the terminal window and enter the command:

```text
adduser UserName
```

Next, create a password for the new user by entering the following in your terminal window:

```text
passwd UserName
```

The system should display a prompt in which you can set and confirm a password for your new user account.
If successful, the system should respond with “all authentication tokens updated successfully.”
