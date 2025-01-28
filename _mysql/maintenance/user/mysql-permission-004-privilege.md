---
title: "MySQL：授权"
sequence: "104"
---

## Privilege Types

The `GRANT` command is capable of applying a wide variety of privileges,
everything from the ability to `CREATE` tables and databases, read or write `FILES`, and even `SHUTDOWN` the server.

There are a wide range of flags and options available to the command,
so you may wish to familiarize yourself with what `GRANT` can actually do by browsing through the official documentation.


## Database-Specific Privileges

To `GRANT ALL` privileges to a user, allowing that user full control over a specific database, use the following syntax:

```text
GRANT ALL PRIVILEGES ON database_name.* TO 'username'@'localhost';
```

With that command, we've told MySQL to:

- `GRANT` the `PRIVILEGES` of type `ALL` (thus everything of course). Note: Most modern MySQL installations do not require the optional `PRIVILEGES` keyword.
- These privileges are for `database_name` and it applies to all tables of that database, which is indicated by the `.*` that follows.
- These privileges are assigned to `username` when that `username` is connected through locally, as specified by `@'localhost'`.
  To specify any valid host, replace `'localhost'` with `'%'`.

Rather than providing all privileges to the entire database,
perhaps you want to give the `tolkien` user
only the ability to read data (`SELECT`) from the `authors` table of the `books` database.
That would be easily accomplished like so:

```text
GRANT ALL PRIVILEGES ON books.authors  TO 'tolkien'@'localhost';
```

## Creating Another Super User

While not particularly secure, in some cases you may wish to create another **superuser**,
that has ALL privileges across ALL databases on the server.
That can be performed similar to above, but by replacing the `database_name` with the **wildcard asterisk**:

```text
mysql> GRANT ALL PRIVILEGES ON *.* TO 'tolkien'@'%';
```

Now `tolkien` has the same privileges as the default root account, beware!

## Saving Your Changes

As a final step following any updates to the user privileges,
be sure to save the changes by issuing the `FLUSH PRIVILEGES` command from the mysql prompt:

```text
mysql> FLUSH PRIVILEGES;
Query OK, 0 rows affected (0.01 sec)
```

## Reference

- [version 5.7 - 13.7.1.4 GRANT Statement](https://dev.mysql.com/doc/refman/5.7/en/grant.html)
- [version 8 - 13.7.1.6 GRANT Statement](https://dev.mysql.com/doc/refman/8.0/en/grant.html)
