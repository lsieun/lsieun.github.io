---
title: "MySQL：Schema"
sequence: "106"
---

## Database Schema

In database terms, a schema is the organisation and structure of a database.

A schema contains schema objects,
which could be tables, columns, data types, views, stored procedures, relationships, primary keys, foreign keys, etc.

A database schema can be represented in a visual diagram,
which shows the database objects and their relationship with each other.

![](/assets/images/db/mysql/mysql-schema-music-example.png)

Above is a simple example of a schema diagram.
It shows three tables, along with their data types,
relationships between the tables, as well as their primary keys and foreign keys.

Here is a more complex example of a database schema:

![](/assets/images/db/mysql/a-full-database-schema-diagram.png)

## Schema VS. Database

Is a Schema and a Database the Same Thing?

There's a lot of confusion about schemas when it comes to databases.
The question often arises whether there's a difference between schemas and databases and if so, what is the difference.

### Depends on the Vendor

Part of the reason for the confusion is that database systems tend to approach schemas in their own way.

- The [MySQL documentation](https://dev.mysql.com/doc/refman/5.7/en/glossary.html#glos_schema) states that physically,
  a schema is synonymous with a database.
  Therefore, a schema and a database are the **same thing**.
- However, the [Oracle Database documentation](https://docs.oracle.com/database/121/SQLRF/sql_elements007.htm#SQLRF20003)
  states that certain objects can be stored inside a database but not inside a schema.
  Therefore, a schema and a database are **two different things**.
- And according to this [SQL Server technical article](https://technet.microsoft.com/en-us/library/dd283095(v=sql.100).aspx),
  a schema is a separate entity inside the database. So, they are **two different things**.

So, depending on the RDBMS you use, schemas and databases may or may not be the same thing.

### SQL Standard

What about the SQL Standard?

The [ISO/IEC 9075-1 SQL standard](http://www.iso.org/iso/iso_catalogue/catalogue_tc/catalogue_detail.htm?csnumber=53681)
defines a schema as a persistent, named collection of descriptors.

If you were confused before, hope I haven't just made it worse …

## Reference

- [What is a Database Schema?](https://database.guide/what-is-a-database-schema/)
- [Database Schema](https://www.ibm.com/cloud/learn/database-schema)
