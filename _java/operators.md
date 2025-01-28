---
title: "Operators"
sequence: "101"
---

## Summary of Operators

The following quick reference summarizes the operators supported by the Java programming language.

### Simple Assignment Operator

```text
=       Simple assignment operator
```

### Arithmetic Operators

```text
+       Additive operator (also used for String concatenation)
-       Subtraction operator
*       Multiplication operator
/       Division operator
%       Remainder operator
```

### Unary Operators

```text
+       Unary plus operator; indicates positive value (numbers are positive without this, however)
-       Unary minus operator; negates an expression
++      Increment operator; increments a value by 1
--      Decrement operator; decrements a value by 1
!       Logical complement operator; inverts the value of a boolean
```

### Equality and Relational Operators

```text
==      Equal to
!=      Not equal to
>       Greater than
>=      Greater than or equal to
<       Less than
<=      Less than or equal to
```

### Conditional Operators

```text
&&      Conditional-AND
||      Conditional-OR
?:      Ternary (shorthand for if-then-else statement)
```

### Type Comparison Operator

```text
instanceof      Compares an object to a specified type
```

### Bitwise and Bit Shift Operators

```text
~       Unary bitwise complement
<<      Signed left shift
>>      Signed right shift
>>>     Unsigned right shift
&       Bitwise AND
^       Bitwise exclusive OR
|       Bitwise inclusive OR
```

## Operator Precedence

As we explore the operators of the Java programming language,
it may be helpful for you to know ahead of time which operators have the highest precedence.
The operators in the following table are listed according to precedence order.
The closer to the top of the table an operator appears, the higher its precedence.
Operators with higher precedence are evaluated before operators with relatively lower precedence. Operators on the same line have equal precedence.
When operators of equal precedence appear in the same expression, a rule must govern which is evaluated first.
**All binary operators except for the assignment operators** are evaluated from **left to right**; **assignment operators** are evaluated **right to left**.

<table border=1 cellspacing=1 cellpadding=2>
<tr><th>Precedence</th><th>Operator</th><th>Type</th><th>Associativity</th></tr>
<tr>
  <td align=center>15</td>
  <td align=center>()<br>[]<br>·</td>
  <td>Parentheses<br>Array subscript<br>Member selection<br></td>
  <td align=center>Left to Right</td>
</tr>
<tr>
  <td align=center>14</td>
  <td align=center>++<br>--</td>
  <td>Unary post-increment<br>Unary post-decrement</td>
  <td align=center>Right to left</td>
</tr>
 <tr>
  <td align=center>13</td>
  <td align=center>++<br>--<br>+<br>-<br>!<br>~<br>( <i>type</i> )</td>
  <td>Unary pre-increment<br>Unary pre-decrement<br>Unary plus<br>Unary minus<br>Unary logical negation<br>Unary bitwise complement<br>Unary type cast</td>
  <td align=center>Right to left</td>
</tr>
<tr>
  <td align=center>12</td>
  <td align=center> * <br> / <br> % </td>
  <td>Multiplication<br>Division<br>Modulus</td>
  <td align=center>Left to right</td>
</tr>
<tr>
  <td align=center>11</td>
  <td align=center>+<br>-</td>
  <td>Addition<br>Subtraction</td>
  <td align=center>Left to right</td>
</tr>
<tr>
  <td align=center>10</td>
  <td align=center>&lt;&lt;<br>&gt;&gt;<br>&gt;&gt;&gt;</td>
  <td>Bitwise left shift<br>Bitwise right shift with sign extension<br>Bitwise right shift with zero extension</td>
  <td align=center>Left to right</td>
</tr>
<tr>
  <td align=center>9</td>
  <td align=center>&lt;<br>&lt;=<br>&gt;<br>&gt;=<br>instanceof</td>
  <td>Relational less than<br>Relational less than or equal<br>Relational greater than<br>Relational greater than or equal<br>Type comparison (objects only)</td>
  <td align=center>Left to right</td>
</tr>
<tr>
  <td align=center>8</td>
  <td align=center>==<br>!=</td>
  <td>Relational is equal to<br>Relational is not equal to</td>
  <td align=center>Left to right</td>
</tr>
 <tr>
  <td align=center>7</td>
  <td align=center>&amp;</td>
  <td>Bitwise AND</td>
  <td align=center>Left to right</td>
</tr>
 <tr>
  <td align=center>6</td>
  <td align=center>^</td>
  <td>Bitwise exclusive OR</td>
  <td align=center>Left to right</td>
</tr>
<tr>
  <td align=center>5</td>
  <td align=center>|</td>
  <td>Bitwise inclusive OR</td>
  <td align=center>Left to right</td>
</tr>
<tr>
  <td align=center>4</td>
  <td align=center>&amp;&amp;</td>
  <td>Logical AND</td>
  <td align=center>Left to right</td>
</tr>
 <tr>
  <td align=center>3</td>
  <td align=center>||</td>
  <td>Logical OR</td>
  <td align=center>Left to right</td>
</tr>
<tr>
  <td align=center>2</td>
  <td align=center>? :</td>
  <td>Ternary conditional</td>
  <td align=center>Right to left</td>
</tr>
<tr>
  <td align=center>1</td>
  <td align=center>=<br>+=<br>-=<br>*=<br>/=<br>%=</td>
  <td>Assignment<br>Addition assignment<br>Subtraction assignment<br>Multiplication assignment<br>Division assignment<br>Modulus assignment</td>
  <td align=center>Right to left</td>
</tr>
</table>

## References

- [Oracle: Operators](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/operators.html)
- [Oracle: Summary of Operators](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/opsummary.html)
- [Java Operator Precedence Table](http://www.cs.bilkent.edu.tr/~guvenir/courses/CS101/op_precedence.html)
