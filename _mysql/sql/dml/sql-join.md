---
title: "SQL Join"
sequence: "101"
---

```text
use mybatis_plus;

drop table if exists TableA;
create table TableA (
    `a_id` varchar(1),
    `name` varchar(10)
);

drop table if exists TableB;
create table TableB (
    `b_id` varchar(1),
    `name` varchar(10)
);

insert into TableA(`a_id`, `name`) values
('1', 'apple'),
('2', 'orange'),
('3', 'tomato'),
('4', 'cucumber');

insert into TableB(`b_id`, `name`) values
('A', 'apple'),
('B', 'banana'),
('C', 'cucumber'),
('D', 'dill');

select * from TableA;
select * from TableB;

SELECT *
FROM tableA
CROSS JOIN tableB;

SELECT *
FROM tableA
INNER JOIN tableB
  ON tableA.name = tableB.name;


SELECT *
FROM TableA
LEFT OUTER JOIN TableB
  ON tableA.name = tableB.name;

SELECT *
FROM tableA
RIGHT OUTER JOIN tableB
  ON tableA.name = tableB.name;

SELECT *
FROM tableA
NATURAL JOIN tableB;




SELECT *
FROM tableA
LEFT JOIN tableB
  ON tableA.name = tableB.name
WHERE tableB.name IS NULL;

SELECT *
FROM tableA
LEFT JOIN tableB
  ON tableA.name = tableB.name;

SELECT *
FROM tableA
LEFT OUTER JOIN tableB
  ON tableA.name = tableB.name;
```
