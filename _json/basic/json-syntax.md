---
title: "Json Syntax and Data Types"
sequence: "101"
---

## Json Syntax

The rules of writing JSON data are homogeneous to JavaScript Object Literals.

Briefly, they are as follows:

- All **JSON data** is written inside curly braces
- **JSON data** is represented as **key-value pairs**
- **Key** should always be enclosed in double quotes
- Always separate **Key** and **value** with a colon (`:`)
- Values should be written appropriately
    - For String, **double quotes** (`""`) should be used
    - For Numbers, Boolean, quotes should not be used.
    - For array, square brackets (`[]`) should be used
    - For objects, curly braces (`{}`) should be used
- To separate data, commas (`,`) should be used

JSON data is not too flexible with these rules.
A slight violation of these rules can break your code.

## Data Types

JSON utilizes objects or arrays to present its data.
These data contain values (of keys) which can be of the following formats -

- Number (integer or decimal)
- String (should be in double quotes)
- Boolean (i.e. true or false)
- Null
- Objects
- Arrays
