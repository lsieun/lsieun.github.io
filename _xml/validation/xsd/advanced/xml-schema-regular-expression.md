---
title: "Regular Expression"
sequence: "120"
---

## The structure of a regular expression

**Regular expressions** are made up of **branches**, which are in turn made up of **pieces**.
Each **piece** consists of one **atom** and an optional **quantifier**.

```xml
<xsd:simpleType name="employeeIdType">
    <xsd:restriction base="xsd:string">
        <xsd:pattern value="\d{3}-[A-Z]{2}|\d{7}"/>
    </xsd:restriction>
</xsd:simpleType>
```

![](/assets/images/xml/structure-of-a-regular-expression.png)

One difference between **XML Schema regular expressions** and **other regular expression languages** is that
XML Schema assumes **anchors** to be present at the **beginning** and **end** of the expression.
This means that **the whole value**, not just a substring, must match **the expression**.

## Atoms

An atom describes one or more characters. It may be any one of the following:

- **A normal character**, such as `a`.
- **Another regular expression**, enclosed in parentheses, such as `(a|b)`.
- **An escape**, indicated by a **backslash**, such as `\d` or `\p{IsBasicLatin}`.
- **A character class expression**, indicated by **square brackets**, such as `[A-Z]`.

### Normal characters

An atom can be a single character.

Most characters that can be entered from a keyboard can be represented directly in a regular expression.
Some characters, known as **metacharacters**, have special meaning and must be escaped
in order to be treated like normal characters.
They are: `.`, `\`, `?`, `*`, `+`, `|`, `{`, `}`, `(`, `)`, `[`, and `]`.

The **space character** can be used to represent itself in a regular expression.

Characters that are not easily entered on a keyboard may also be represented as they are in any XML document—
by **character references** that specify the character's Unicode code point.
**XML character references** take two forms:

- “&#” plus a sequence of decimal digits representing the character's code point, followed by “;”
- “&#x” plus a sequence of hexadecimal digits representing the character's code point, followed by “;”

For example, a space can be represented as `&#x20;`.
You can also include the predefined XML entities for
the “less than,” “greater than,” ampersand, apostrophe, and quote characters.

Common XML character references and entities:

- `&#x20;`: Space
- `&#xA;`: Line feed (also represented by `\n`)
- `&#xD;`: Carriage return (also represented by `\r`)
- `&#x9;`: Tab (also represented by `\t`)
- `&lt;`: Less than (`<`)
- `&gt;`: Greater than (`>`)
- `&amp;`: Ampersand (`&`)
- `&apos;`: Apostrophe (`'`)
- `&quot;`: Quote (`"`)

### The wildcard escape character

The period (`.`)  has special significance in regular expressions;
it matches any one character except a **carriage return** or **line feed**.
The period character, known as **wildcard**, represents only one matching character,
but a quantifier (such as `*`) may be applied to it to represent multiple characters.

The period character is also useful at the beginning or end of a regular expression
to signify a pattern that starts with, ends with, or contains a matching string.
This gets around the **implicit anchors** in XML Schema regular expressions.

It is important to note that **the period** loses its **wildcard power**
when placed in a **character class expression** (within **square brackets**).

### Character class escapes

**Escape** means to remove special meaning from a character so it can be used as it can be used literally.

A character class escape uses the backslash (`\`) as an escape character to indicate any one of several characters.

There are four categories of character class escapes:

- **Single character escapes**, which represent one specific character
- **Multicharacter escapes**, which represent any one of several characters
- **Category escapes**, which represent any one of a group of characters with similar characteristics
  (such as “Punctuation”), as defined in the Unicode standard
- **Block escapes**, which represent any one character within a range of code points, as defined in the Unicode standard

Note that **each escape** may be matched by only **one character**.
You must apply a **quantifier** such as `*` to an escape to make it represent multiple characters.

#### Single-character escapes

Single-character escapes are used for characters that are either difficult to read and write in their natural form,
or have special meaning in regular expressions.
Each escape represents only one possible matching character.

| Escape | Meaning                 |
|--------|-------------------------|
| `\n`   | Line feed (`#xA`)       |
| `\r`   | Carriage return (`#xD`) |
| `\t`   | Tab (`#x9`)             |
| `\\`   | `\`                     |
| `\.`   | `.`                     |
| `\-`   | `-`                     |
| `\^`   | `^`                     |
| `\?`   | `?`                     |
| `\*`   | `*`                     |
| `\+`   | `+`                     |
| `\{`   | `{`                     |
| `\}`   | `}`                     |
| `\(`   | `(`                     |
| `\)`   | `)`                     |
| `\[`   | `[`                     |
| `\]`   | `]`                     |

#### Multicharacter escapes

A multicharacter escape may represent any one of several characters.

- `\d`: Any decimal digit.
- `\D`: Any character that is not a decimal digit.
- `\s`: A whitespace character (space, tab, carriage return, or line feed).
- `\S`: Any character that is not a whitespace character.
- `\i`: Any character that may be the first character of an XML name, namely a letter, an underscore (`_`), or a colon (`:`).
- `\I`: Any character that is not permitted as the first character of an XML name.
- `\c`: Any character that may be part of an XML name, namely a letter, a digit, an underscore (`_`), a colon (`:`), a hyphen (`-`), or a period (`.`).
- `\C`: Any character that cannot be part of an XML name.
- `\w`: A “word” character, that is, any character not in one of the categories Punctuation, Separators, and Other.
- `\W`: Any character in one of the categories Punctuation, Separators, and Other

#### Category escapes

Category escapes provide convenient groupings of characters, based on their characteristics.
These categories are defined by the Unicode standard.

#### Block escapes

Block escapes represent a range of characters based on their Unicode code points.

The Unicode standard provides names for these ranges, such as Basic Latin, Greek, Thai, Mongolian, etc.

The block names used in regular expressions are these same names, with the spaces removed.

### Character class expressions

A character class expression allows you to specify a choice from a set of characters.
The expression, which appears in **square brackets**, may include **a list of individual characters or character escapes**,
or **a character range**, or both.

It is also possible to **negate** the specified set of characters, or **subtract** values from it.

Like an escape, a character class expression may only represent **one character** in the matching string.

To allow a matching character to appear multiple times, a **quantifier** may be applied to the expression.

#### Listing individual characters

The simplest case of a character class expression is a list of the matching characters or escapes.
The expression represents one and only one of the characters listed.

#### Specifying a range

A range of characters may be specified in a character class expression.
The lower and upper bounds are inclusive, and they are separated by a hyphen.

For example, to allow the letters `a` through `f`, you can specify `[a-f]`. 

Multiple ranges may be specified in the same expression.
If multiple ranges are specified, the character must match one of the ranges.

#### Combining individual characters and ranges

It is also possible to combine ranges, individual characters, and escapes in an expression, in any order.

#### Negating a character class expression

A character class expression can be negated to represent any character that is not in the specified set of characters.
You can negate any expression, regardless of whether it is a range, a list of characters, or both.
The negation character, `^`, must appear directly after **the opening bracket**.

#### Subtracting from a character class expression

It is possible to subtract individual values or ranges of values from a specified set of characters.
A minus sign (`-`) precedes the values to be subtracted, which are themselves enclosed in square brackets.

#### Escaping rules for character class expressions

Special escaping rules apply to character class expressions. They are as follows:

- The characters `[`, `]`, `\`, and `-` should be escaped when included as individual characters or bounds in a range.
- The character `^` should be escaped if it appears first in the character class expression, directly after the opening bracket (`[`).

The other metacharacters do not need to be escaped when used in a character class expression,
because they have no special meaning in that context.
This includes the period character, which does not serve as a wildcard escape character
when inside a character class expression.

However, it is never an error to escape any of the metacharacters,
and getting into the habit of always escaping them eliminates the need to remember these rules.

### Parenthesized regular expressions

A parenthesized regular expression may be used as an atom in a larger regular expression.

Any regular expression may be included in the parentheses,
including those containing normal characters, characters entities, escapes, and character class expressions.

## Quantifiers

A quantifier indicates how many times the atom may appear in a matching string.

- none: Must appear once.
- `?`: May appear 0 or 1 times.
- `*`: May appear 0 or more times.
- `+`: May appear 1 or more times.
- `{n}`: Must appear n times.
- `{n,}`: May appear n or more times.
- `{n,m}`: May appear n through m times.

## Branches

A regular expression can consist of an unlimited number of branches.

> regular expression与branch之间的关系

Branches, separated by the vertical bar (`|`) character, represent a choice between several expressions.

> branch介绍

The `|` character does not act on the atom immediately preceding it,
but on the entire expression that precedes it (back to the previous `|` or **an opening parenthesis**).

> 作用范围




