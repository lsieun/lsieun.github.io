---
title: "RULES"
sequence: "rule"
---

The `[RULES]` defines rule-based controls that modify **links** based on a combination of conditions.

**Format**:

Each rule is a series of statements of the form:

| 1        | 2           |
|----------|-------------|
| RULE     | ruleID      |
| IF       | condition_1 |
| AND      | condition_2 |
| OR       | condition_3 |
| AND      | condition_4 |
| etc.     |             |
| THEN     | action_1    |
| AND      | action_2    |
| etc.     |             |
| ELSE     | action_3    |
| AND      | action_4    |
| etc.     |             |
| PRIORITY | value       |

where:

- `ruleID` = an ID label assigned to the rule
- `conditon_n` = a condition clause
- `action_n` = an action clause
- `Priority` = a priority value (e.g., a number from `1` to `5`)

**Remarks**:

- Only the `RULE`, `IF` and `THEN` portions of a rule are required; the other portions are optional.
- When mixing `AND` and `OR` clauses, the `OR` operator has higher precedence than `AND`, i.e.,

```text
IF A or B and C
```

is equivalent to

```text
IF (A or B) and C.
```

If the interpretation was meant to be

```text
IF A or (B and C)
```

then this can be expressed using two rules as in

```text
IF A THEN ...
IF B and C THEN ...
```

- The `PRIORITY` value is used to determine which rule applies
  when two or more rules require that conflicting actions be taken on a link.
  A rule without a priority value always has a lower priority than one with a value.
  For two rules with the same priority value, the rule that appears first is given the higher priority.

**Example**:

```text
[RULES]
RULE 1
IF TANK 1 LEVEL ABOVE 19.1
THEN PUMP 335 STATUS IS CLOSED
AND PIPE 330 STATUS IS OPEN

RULE 2
IF SYSTEM CLOCKTIME >= 8 AM
AND SYSTEM CLOCKTIME < 6 PM
AND TANK 1 LEVEL BELOW 12
THEN PUMP 335 STATUS IS OPEN

RULE 3
IF SYSTEM CLOCKTIME >= 6 PM
OR SYSTEM CLOCKTIME < 8 AM
AND TANK 1 LEVEL BELOW 14
THEN PUMP 335 STATUS IS OPEN
```

#### Condition Clause Format

A condition clause in a Rule-Based Control takes the form of:

| 1      | 2   | 3         | 4        | 5     |
|--------|-----|-----------|----------|-------|
| object | id  | attribute | relation | value |

where:

- `object` = a category of network object
- `id` = the object's ID label
- `attribute` = an attribute or property of the object
- `relation` = a relational operator
- `value` = an attribute value

Some example conditional clauses are:

```text
JUNCTION 23 PRESSURE > 20
TANK T200 FILLTIME BELOW 3.5
LINK 44 STATUS IS OPEN
SYSTEM DEMAND >= 1500
SYSTEM CLOCKTIME = 7:30 AM
```

The `Object` keyword can be any of the following:

| 1         | 2     | 3      |
|-----------|-------|--------|
| NODE      | LINK  | SYSTEM |
| JUNCTION  | PIPE  |        |
| RESERVOIR | PUMP  |        |
| TANK      | VALVE |        |

When `SYSTEM` is used in a condition no ID is supplied.

The following **attributes** can be used with `Node`-type objects:

- DEMAND
- HEAD
- PRESSURE

The following **attributes** can be used with `Tank`s:

- `LEVEL`
- `FILLTIME` (hours needed to fill a tank)
- `DRAINTIME` (hours needed to empty a tank)

These **attributes** can be used with `Link`-Type objects:

- `FLOW`
- `STATUS` (`OPEN`, `CLOSED`, or `ACTIVE`)
- `SETTING` (**pump speed** or **valve setting**)

The SYSTEM object can use the following **attributes**:

- `DEMAND` (**total system demand**)
- `TIME` (hours from the start of the simulation expressed either as a **decimal number** or in `hours:minutes` format)
- `CLOCKTIME` (24-hour clock time with `AM` or `PM` appended)

Relation operators consist of the following:

| 1    | 2       |
|------|---------|
| `=`  | `IS`    |
| `<>` | `NOT`   |
| `<`  | `BELOW` |
| `>`  | `ABOVE` |
| `<=` | `>=`    |


#### Action Clause Format

An action clause in a Rule-Based Control takes the form of:

| 1      | 2   | 3              | 4   | 5     |
|--------|-----|----------------|-----|-------|
| object | id  | STATUS/SETTING | IS  | value |

where:

- `object` = `LINK`, `PIPE`, `PUMP`, or `VALVE` keyword
- `id` = the object's ID label
- `value` = a status condition (`OPEN` or `CLOSED`), **pump speed setting**, or **valve setting**

Some example action clauses are:

```text
LINK 23 STATUS IS CLOSED
PUMP P100 SETTING IS 1.5
VALVE 123 SETTING IS 90
```
