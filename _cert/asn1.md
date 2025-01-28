---
title: "ASN.1介绍"
sequence: "101"
---

## DER

Every encoded value is represented as a type, followed by the value's length,
followed by the actual contents of the value itself;
the representation of the value depends on the type.

```text
tag, length, contents
```

DER allows for multi-byte types as well — and has complex rules on how to encode and
recognize them — but X.509 doesn't need to make use of them and sticks with single-byte types.



## INTEGER and OID

### INTEGER

- type: 2

The integer value `5` is encoded, according to DER, as

```text
02 01 05
```

The integer value 65535 is encoded as

```text
02 02 FF FF
```

### OID

- type: 6

OID's are just as simple to encode. They're stored just like integers, but they have a type of `6` instead of `2`.

Otherwise, they're encoded the same way:

```text
type, length, value
```

The OID common name (in the `subject` and `issuer` distinguished name fields) of `55 04 03` is represented as

```text
06 03 55 04 03
```

## Strings and Dates

Strings and dates are both encoded similarly.

### Dates

The `type` code for a date is either `23` or `24`:

- `23` is a UTC — two-digit year — time.
- `24` is a generalized — four-digit year — time.

Although the type actually includes enough information to infer
the length — you know that generalized times are 15 digits, and UTC times
are 13 — for consistency's sake the lengths are included as well. After that, the
year, month, day, hour, minute, second and Z are included in ASCII format. So
the date Feb. 23, 2010, 6:50:13 is encoded in UTC time as

## Bit Strings

- type: 3

Bit strings are just like strings, with one minor difference.

Their type is `3` to distinguish them from printable strings,
but the encoding is exactly the same:

```text
tag, length, contents
```

The only difference between bit strings and character strings is that
bit strings don't necessarily have to end on an eight-bit boundary,
so they have an extra byte to indicate how much padding was included.
In practice, this is always `0` because all useful bit patterns are eight-bit aligned anyway.

### 内容

bit strings contain nested ASN.1 structures.

### lengths greater than 255

So how are lengths greater than 255 represented?

Actually, a single-length byte can only represent 127 byte values.

The high-order bit is reserved.
If it's 1, then the low order seven bits represent not the length of the value,
but the length of the length — that is,
how many of the bytes following encode the length of the subsequently following value.

So, if a bit string is 512 bytes long, the DER-encoded representation:

|TAG NUMBER|NUMBER OF LENGTH BYTES|ACTUAL LENGTH VALUE|BITS OF PADDING|VALUE|
|---|---|---|---|---|
|03|82|02 00|00|(511 bytes of value)|

## Sequences and Sets

Sets and sequences are what ASN.1 calls a **constructed type** — that is, a type containing other types.

Technically, they're encoded the same way other values are.
They start with a `tag`, are followed by **a variable number of length bytes**, and are then followed by **their contents**.

However, for **constructed types**, the **contents** themselves
are further ASN.1-encoded tags.

Sequences are identified by tag `0x30`, and sets are identiﬁed by tag `0x31`.

Any `tag` value whose **sixth bit** is `1` is a **constructed tag** and
the parser must recognize that it contains additional ASN.1-encoded data.
