---
title: "Foreign Keys and Referential Integrity"
sequence: "111"
---

A foreign key relationship enables you to declare that an index in one table is related to an index in another.
It also enables you to place constraints on what may be done to the tables in the relationship.
The database enforces the rules of this relationship to maintain referential integrity.

In MySQL, the InnoDB storage engine provides foreign key support.

## Creating and Using Foreign Keys

The following syntax shows how to define a foreign key in a child table:

```text
[CONSTRAINT constraint_name]
FOREIGN KEY [fk_name] (index_columns)
    REFERENCES tbl_name (index_columns)
    [ON DELETE action]
    [ON UPDATE action]
    [MATCH FULL | MATCH PARTIAL | MATCH SIMPLE]
```

- `ON DELETE` enables you to specify what happens to the child table when parent table rows are deleted.
  The default if no `ON DELETE` clause is present is to reject any attempt to delete rows in the parent table
  that have child rows pointing to them.
  To specify an `action` value explicitly, use one of the following clauses:
  - `ON DELETE NO ACTION` and `ON DELETE RESTRICT` are the same as omitting the `ON DELETE` clause.
    (Some database systems have deferred checks, and `NO ACTION` is a deferred check.
    In MySQL, foreign key constraints are checked immediately, so `NO ACTION` and `RESTRICT` are the same.)
  - `ON DELETE CASCADE` causes matching child rows to be deleted when the corresponding parent row is deleted.
    In essence, the effect of the delete is cascaded from the parent to the child.
    This enables you to perform multiple-table deletes by deleting rows only from the parent table and
    letting InnoDB take care of deleting corresponding rows from the child table.
  - `ON DELETE SET NULL` causes index columns in matching child rows to be set to `NULL` when the parent row is deleted.
    If you use this option, all the indexed child table columns named in the foreign key definition must be defined to
    allow `NULL` values.
    (One implication of using this action is that you cannot define the foreign key to be a `PRIMARY KEY`
    because primary keys do not allow `NULL` values.)
  - `ON DELETE SET DEFAULT` is recognized but unimplemented and InnoDB issues an error.
- `ON UPDATE` enables you to specify what happens to the child table when parent table rows are updated.
  The default if no `ON UPDATE` clause is present is to reject any inserts or updates in the child table
  that result in foreign key values that don't have any match in the parent table index,
  and to prevent updates to parent table index values to which child rows point.
  The possible `action` values are the same as for `ON DELETE` and have similar effects.

```mysql
CREATE TABLE parent
(
    par_id INT NOT NULL,
    PRIMARY KEY (par_id)
) ENGINE = INNODB;

CREATE TABLE child
(
    par_id   INT NOT NULL,
    child_id INT NOT NULL,
    PRIMARY KEY (par_id, child_id),
    FOREIGN KEY (par_id) REFERENCES parent (par_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE = INNODB;
```

```text
mysql> INSERT INTO parent (par_id) VALUES(1),(2),(3);
mysql> INSERT INTO child (par_id,child_id) VALUES(1,1),(1,2);
mysql> INSERT INTO child (par_id,child_id) VALUES(2,1),(2,2),(2,3);
mysql> INSERT INTO child (par_id,child_id) VALUES(3,1);
```

```text
DELETE FROM parent WHERE par_id = 1;
```










