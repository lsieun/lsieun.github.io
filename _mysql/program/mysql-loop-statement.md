---
title: "MySQL：Loop Statement"
sequence: "101"
---

```text
[begin_label:] LOOP
    statement_list
END LOOP [end_label]
```

`LOOP` implements a simple loop construct, enabling repeated execution of the statement list,
which consists of one or more statements, each terminated by a semicolon (`;`) statement delimiter.
The statements within the loop are repeated until the loop is terminated.
Usually, this is accomplished with a `LEAVE` statement.
Within a stored function, `RETURN` can also be used, which exits the function entirely.


```mysql
DROP PROCEDURE IF EXISTS doiterate;

CREATE PROCEDURE doiterate(p1 INT)
BEGIN
    label1: LOOP
        SET p1 = p1 + 1;
        SELECT p1;
        IF p1 < 10 THEN
            ITERATE label1;
        END IF;
        LEAVE label1;
    END LOOP label1;
    SET @x = p1;
END;

CALL doiterate(1);
```

```mysql
DROP PROCEDURE IF EXISTS doiterate;

CREATE PROCEDURE doiterate(myId BIGINT, projectId BIGINT, modulus INT, size INT)
BEGIN
    DECLARE myIndex INT;
    SET myIndex = 0;
    label1: LOOP
        SET myId = myId + 1;
        SET myIndex = myIndex + 1;
        INSERT INTO biz_scada_element(`id`, `project_id`, `name`, `type`, `ref_id`, `order_number`)
        VALUES (myId, projectId, CONCAT('Device', myId), MOD(myId, modulus), '', myIndex);
        IF myIndex < size THEN
            ITERATE label1;
        END IF;
        LEAVE label1;
    END LOOP label1;
END;

SET @projectId = 3408002023001;
SET @myId = 4186000;
CALL doiterate(@myId, @projectId, 3, 20);
```

