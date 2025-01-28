---
title: "typeof"
sequence: "201"
---

The `typeof` operator returns a string indicating the type of the operand's value.

```text
console.log(typeof 42);
// expected output: "number"

console.log(typeof 'blubber');
// expected output: "string"

console.log(typeof true);
// expected output: "boolean"

console.log(typeof undeclaredVariable);
// expected output: "undefined"
```

The following table summarizes the possible return values of `typeof`.

| Type             | Result            |
|------------------|-------------------|
| Undefined        | "undefined"       |
| Null             | "object" (reason) |
| Boolean          | "boolean"         |
| Number           | "number"          |
| BigInt           | "bigint"          |
| String           | "string"          |
| Symbol           | "symbol"          |
| Function         | "function"        |
| Any other object | "object"          |

## Reference

- [typeof](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof)
