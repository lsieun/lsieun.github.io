---
title: "H2: Embedded Database Storage"
sequence: "104"
---

## H2's Embedded Persistence Mode

在 `application.properties` 文件中，可以设置 `spring.datasource.url` 来决定 **storage mode**：

## In-Memory Approach

在 `spring.datasource.url` 中使用 `mem` 参数：

```text
spring.datasource.url=jdbc:h2:mem:<database name>
```

示例：

```text
spring.datasource.url=jdbc:h2:mem:demodb
```

## File-Based Persistence Mode

在 `spring.datasource.url` 中使用 `file` 参数：

```text
spring.datasource.url=jdbc:h2:file:<database file path>
```

### Directory on Disk

```text
spring.datasource.url=jdbc:h2:file:C:/data/demodb
```

Notice that in this connection string, **the last chunk refers to the database name.**
Also, even if we miss the `file` keyword in this data source connection URL,
H2 will manage it and create files in the provided location.

### Current User Directory

In case we want to store database files in the current user directory,
we'll use the data source URL that contains a tilde (`~`) after the `file` keyword:

```text
spring.datasource.url=jdbc:h2:file:~/demodb
```

For example, in Windows systems, this directory will be `C:/Users/<current user>`.

To store database files in the subdirectory of the current user directory:

```text
spring.datasource.url=jdbc:h2:file:~/subdirectory/demodb
```

Notice that **if the `subdirectory` does not exist, it will be created automatically.**

### Current Working Directory

The current working directory is one where the application is started,
and it's referenced as a dot (`.`) in the data source URL.
If we want database files there, we'll configure it as follows:

```text
spring.datasource.url=jdbc:h2:file:./demodb
```

To store database files in the subdirectory of the current working directory:

```text
spring.datasource.url=jdbc:h2:file:./subdirectory/demodb
```

Notice that **if the subdirectory does not exist, it will be created automatically.**

### File Names

Let's see which files does the H2 database create:

- `demodb.mv.db` – unlike the others, this file is always created, and it contains **data, transaction log, and indexes**
- `demodb.lock.db` – it is a **database lock file** and H2 recreates it when the database is in use
- `demodb.trace.db` – this file contains **trace** information
- `demodb.123.temp.db` – used for handling blobs or huge result sets
- `demodb.newFile` – H2 uses this file for database compaction, and it contains a new database store file
- `demodb.oldFile` – H2 also uses this file for database compaction, and it contains old database store file
