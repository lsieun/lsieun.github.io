---
title: "Quick Start (Explained)"
sequence: "103"
---

## JPA Entities

- 类层面
    - We must specify the `@Entity` annotation at the class level.
      The entity name defaults to the name of the class. We can change its name using the `name` element.
    - Because various JPA implementations will try subclassing our entity to provide their functionality,
      **entity classes must not be declared `final`.**
- 类成员：We must also ensure that the entity has a no-arg constructor and a primary key
    - Id
        - Each JPA entity must have a primary key that uniquely identifies it.
          The `@Id` annotation defines **the primary key**.
        - We can generate the identifiers in different ways, which are specified by the `@GeneratedValue` annotation.

```java
package lsieun.jpa.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity(name = "t_student")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;

    public Student() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
```

We can choose from four id generation strategies with the strategy element.
The value can be `AUTO`, `TABLE`, `SEQUENCE`, or `IDENTITY`:

- If we specify `GenerationType.AUTO`, the JPA provider will use **any strategy it wants** to generate the identifiers.

### The Table Annotation

In most cases, **the name of the table in the database and the name of the entity won't be the same.**

In these cases, we can specify the table name using the `@Table` annotation:

- We can also mention the schema using the `schema` element:

Schema name helps to distinguish one set of tables from another.

If we don't use the `@Table` annotation, the name of the table will be the name of the entity.

### The Column Annotation

Just like the `@Table` annotation,
we can use the `@Column` annotation to mention the details of a column in the table.

The `@Column` annotation has many elements such as `name`, `length`, `nullable`, and `unique`:

- The `name` element specifies the name of the column in the table.
- The `length` element specifies its length.
- The `nullable` element specifies whether the column is nullable or not.
- The `unique` element specifies whether the column is unique.

If we don't specify this annotation, the name of the column in the table will be the name of the field.











