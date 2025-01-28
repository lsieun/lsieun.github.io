---
title: "Persistence API"
sequence: "104"
---

```java
import jakarta.persistence.*;

@Entity
@Table(name = "COURSES")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Column(name = "NAME")
    private String name;
    @Column(name = "CATEGORY")
    private String category;
    @Column(name = "RATING")
    private int rating;

    @Column(name = "DESCRIPTION")
    private String description;
}
```

The `@Entity` annotation indicates that this class is a JPA entity.
A JPA entity is a POJO class representing the business domain object
that needs to be persisted in a database table.
As a default configuration, Spring Data uses the class name as the entity name.
However, you can specify a custom entity name with the name attribute of `@Entity` annotation
(e.g., `@Entity(name = "COURSE")`).

`@Table` - By default, the entity class name also represents the name of the database table
in which the entity data should be persisted.
You can also specify several other tables-related information, such as the database schema name,
unique constraints and indexes for the table, and a custom table name.

`@Id` - An entity requires an identifier to identify each row in the underlying database table uniquely.
The `@Id` annotation on a Java field in the business domain class specifies the property
as the primary key of the table.
Based on the application, a primary key can be a simple ID with a single field,
or it can be a composite ID with multiple fields.
To see the use of the **composite key** in Spring Data JPA, you can refer to http://mng.bz/ExzO.

`@Column` - By default, Spring Data uses the class field names as the column names in the database table.
For example, the field name `id` represents the column ID in the database table.
Besides, if you have a property with more than one word in the camelCase format in your Java class,
then the camelCase property name in the class is represented as the camel_case in the database table field.
The words in the field are connected by an underscore (`_`).
Thus, if you've defined a property named `courseId`, it is represented as `course_id` in the table column.

Besides, you have also noticed that the `id` field is annotated with the `@GeneratedValue` annotation.
**This annotation indicates that the value of the annotated property is generated.**
The `GeneratedValue` annotation accepts a `GenerationType` strategy that
defines how the property value should be generated.
The supported values are `Table`, `Identity`, `Sequence`, and `Auto`.
Let's discuss these options briefly:

- `Table` - This option indicates that the persistence provider should assign primary keys for an entity using a database table.
- `Identity` - Identity indicates that the persistence provider should assign the primary keys for an entity
  using a database identity column.
- `Sequence` - As the name suggests, this option allows the persistence provider to assign the primary keys using a database sequence.
- `Auto` - This option allows the persistence provider to determine the ID-generation scheme.
