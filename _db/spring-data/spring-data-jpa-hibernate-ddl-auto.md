---
title: "Spring Data JPA: Hibernate DDL Auto"
sequence: "jpa-hibernate-ddl-auto"
---

JPA provides you with the flexibility
to automatically infer the DDLs from the `@Entity` classes and execute them in a database.

The `spring.jpa.hibernate.ddl-auto` property decides how to manage the DDLs in your application.
The possible values for this property are `none`, `validate`, `update`, `create`, and `create-drop`.
The following list provides a brief discussion on these options:

- `none` Disables the automatic DDL management. It is the default value for non-embedded databases.
- `validate` - Validates the schema but does not make any changes to the database.
  Spring Boot throws an error if the database schema is not in expected structure.
- `update` - Updates the already-existing schema if necessary.
- `create` - Creates the schema and destroys already-existing data
- `create-drop` - Creates the schema and destroys at the end of the session.
  It is the default value for embedded databases.

The property `spring.jpa.hibernate.ddl-auto` is specific to **Hibernate**,
which is the default persistence provider in Spring Boot.
If you are using another persistent provider,
you can use the more generic property `spring.jpa.generate-ddl`, which accepts a `boolean` value.

## schema.sql or spring.jpa.hibernate.ddl-auto

In the previous technique, you've explored that you can use the `schema.sql` to create the database schema.
In the current technique, you've learned the `spring.jpa.hibernate.ddl-auto` property
that can also instruct Spring Data JPA to create the database schema based on the JPA annotations.

You'll need to ensure that you choose either of the approaches to create the database schema.
If you choose to use `schema.sql`,
then configure `spring.jpa.hibernate.ddl-auto` property to `none` in the `application.properties` file.
