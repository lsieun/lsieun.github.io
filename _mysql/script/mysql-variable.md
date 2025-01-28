---
title: "变量（Variable）"
sequence: "101"
---

On SQL scripts, you can use variables to store values
during the execution of a sequence of commands and use them instead of literals.

## User-Defined Variables in MySQL

MySQL recognizes different types of variables.
The first type is the user-defined variables, identified by an `@` symbol used as a prefix.
In MySQL, you can access user-defined variables without declaring or initializing them previously.
If you do so, a `NULL` value is assigned to the variable when initialized.
For example, if you use `SELECT` with a variable without giving a value to it, as in this case:

```text
SELECT @SomeVariable;
```

MySQL returns a `NULL` value.

## Initialize User-Defined Variables

To initialize a user-defined variable, you need to use a `SET` or `SELECT` statement.
You can initialize many variables at once, separating each assignment statement with a comma, like this:

```text
SET @FirstVar=1, @SecondVar=2;
```

Once you assign a value to a variable, it will have a type according to the given value.
In the previous examples, `@FirstVar` and `@SecondVar` are of type `int`.

The lifespan of a user-defined variable lasts as long as the session is active, and it is invisible to other sessions.
Once the session closes, the variable disappears.

There are 5 data types you can assign to a user-defined variable:

- string (binary or nonbinary)
- integer
- decimal
- floating-point
- NULL, which can be associated with any type.

To assign a value to a variable, you can use either symbol `=` or `:=`.
The two following statements have the same effect:

```text
SET @MyIntVar = 1;
SET @MyIntVar := 1;
```

## Use Variables as Fields in a SELECT Statement

Variables can be part of the field lists of a `SELECT` statement.
You can mix variables and field names when you specify fields in a select, as in this example:

```text
SET @IndexVar := 1;
SELECT @IndexVar, ISBN FROM Books;
```

## Declare Local Variables in MySQL

**Local variables don't need the `@` prefix in their names, but they must be declared before they can be used.**

To declare a local variable, you can use the `DECLARE` statement or
use it as a parameter within a `STORED PROCEDURE` declaration.

When you declare a local variable, optionally, a **default value** can be assigned to it.
If you don't assign any default value, the variable is initialized with a `NULL` value.

Each variable lives within a scope, delimited by the `BEGIN ... END` block that contains its declaration.

The following example illustrates two different ways to use local variables:
as a **procedure parameter** and as **a variable internal to the procedure**:

```text
DELIMITER $$

CREATE PROCEDURE GetUpdatedPrices(itemcount INT)
BEGIN
	DECLARE factor DECIMAL(5, 2);
	SET factor:=3.45;
	SELECT PartNo, Description, itemcount * factor * ListPrice FROM Catalogue;
END
$$

DELIMITER ;
```

In the previous example, the variable `itemcount` is used as a parameter to pass a value to the procedure.
That variable is later used in the `SELECT` statement to multiply the `ListPrice` field obtained from the table.
The local variable `factor` is used to store a decimal value used to multiply the resulting price.

## Declare System Variables in MySQL

There is a third type of variable called **system variables** used to store values
that affect individual client connections (`SESSION` variables) or affect the entire server operation (`GLOBAL` variables).

System variables are usually set at server startup.
To do so, you can use the command line or include the `SET` statement in an option file.
But their values can be modified within an SQL script.

System variables can be identified using a **double `@`** sign as a prefix or
using the words `GLOBAL` or `SESSION` in the SET statement.
Another way to differentiate `GLOBAL` and `SESSION` system variables is to use a second prefix: `global` or `session`.
Here are a few examples of how you can assign values to system variables:

```text
-- Alternative ways to set session system variables:
SET interactive_timeout=30000;
SET SESSION interactive_timeout=30000;
SET @@interactive_timeout=30000;
SET @@local.interactive_timeout=30000;

-- Alternative ways to set global system variables:
SET @@global.interactive_timeout=30000;
SET GLOBAL interactive_timeout=30000;
```

To see the system variables in use within a session or in the server, you can use the `SHOW VARIABLES` statement.
You can add a comparison operator to filter this list if you want to get the value of some specific variables.
For example:

```text
SHOW VARIABLES LIKE '%timeout%'
```

