---
title: "Optional chaining operator"
sequence: "201"
---

Optional chaining operator (`?.`) is a new feature added to JavaScript in ECMAScript 2020.
It allows reading a value of a deeply nested property without throwing an error
if one of the properties in the chain is undefined.

The `?.` operator is like the `.` chaining operator,
except that instead of causing an error if a reference is nullish (`null` or `undefined`),
the expression short-circuits with a return value of `undefined`.

When used with **function calls**, it returns `undefined` if the given function does not exist

> function calls

You can read more about it in MDN docs or one of my articles about latest features added to JavaScript..

## Reference

- [Optional chaining (?.)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
- [The Latest Features Added to JavaScript in ECMAScript 2020](https://www.telerik.com/blogs/latest-features-javascript-ecmascript-2020)

