---
title: "JNA Type"
sequence: "103"
---

## Basic Types Mapping

In our initial example, the called method only used primitive types as both its argument and return value.
JNA handles those cases automatically, usually using their natural Java counterparts when mapping from C types:

- `char` => `byte`
- `short` => `short`
- `wchar_t` => `char`
- `int` => `int`
- `long` => `com.sun.jna.NativeLong`
- `long long` => `long`
- `float` => `float`
- `double` => `double`
- `char *` => `String`

A mapping that might look odd is the one used for the native long type (`com.sun.jna.NativeLong`).
This is because, in C/C++, the `long` type may represent a 32- or 64-bit value,
depending on whether we're running on a 32- or 64-bit system.

To address this issue, JNA provides the `NativeLong` type,
which uses the proper type depending on the system's architecture.

Java primitive types (and their object equivalents) map directly to the native C type of the same size.

<table>
    <thead>
    <tr>
        <th>Native Type</th>
        <th>Size</th>
        <th>Java Type</th>
        <th>Common Windows Types</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>char</td>
        <td>8-bit integer</td>
        <td>byte</td>
        <td>BYTE, TCHAR</td>
    </tr>
    <tr>
        <td>short</td>
        <td>16-bit integer</td>
        <td>short</td>
        <td>WORD</td>
    </tr>
    <tr>
        <td>wchar_t</td>
        <td>16/32-bit character</td>
        <td>char</td>
        <td>TCHAR</td>
    </tr>
    <tr>
        <td>int</td>
        <td>32-bit integer</td>
        <td>int</td>
        <td>DWORD</td>
    </tr>
    <tr>
        <td>int</td>
        <td>boolean value</td>
        <td>boolean</td>
        <td>BOOL</td>
    </tr>
    <tr>
        <td>long</td>
        <td>32/64-bit integer</td>
        <td>NativeLong</td>
        <td>LONG</td>
    </tr>
    <tr>
        <td>long long</td>
        <td>64-bit integer</td>
        <td>long</td>
        <td>__int64</td>
    </tr>
    <tr>
        <td>float</td>
        <td>32-bit FP</td>
        <td>float</td>
        <td></td>
    </tr>
    <tr>
        <td>double</td>
        <td>64-bit FP</td>
        <td>double</td>
        <td></td>
    </tr>
    <tr>
        <td>char*</td>
        <td>C string</td>
        <td>String</td>
        <td>LPCSTR</td>
    </tr>
    <tr>
        <td>void*</td>
        <td>pointer</td>
        <td>Pointer</td>
        <td>LPVOID, HANDLE, LP<i>XXX</i></td>
    </tr>
    </tbody>
</table>

Unsigned types use the same mappings as signed types. C enums are usually interchangeable with "int".

## Structures and Unions

Another common scenario is dealing with native code APIs that expect a pointer to some struct or union type.
When creating the Java interface to access it,
the corresponding argument or return value must be a Java type
that extends `com.sun.jna.Structure` or `com.sun.jna.Union`, respectively.

### Structure

For instance, given this C struct:

```c
struct foo_t {
    int field1;
    int field2;
    char *field3;
};
```

Its Java peer class would be:

```java
import com.sun.jna.Structure;

@Structure.FieldOrder({"field1","field2","field3"})
public class FooType extends Structure {
    int field1;
    int field2;
    String field3;
};
```

**JNA requires the `@FieldOrder` annotation**,
so it can properly serialize data into a memory buffer before using it as an argument to the target method.

Alternatively, we can override the `getFieldOrder()` method for the same effect.
When targeting a single architecture/platform, the former method is generally good enough.
We can use the latter to deal with alignment issues across platforms,
that sometimes require adding some extra padding fields.

### Union

Unions work similarly, except for a few points:

- **No need** to use a `@FieldOrder` annotation or implement `getFieldOrder()`
- We have to call `setType()` before calling the native method

```java
public abstract class Union extends Structure {
    public void setType(Class<?> type) {
        ensureAllocated();
        for (StructField f : fields().values()) {
            if (f.type == type) {
                activeField = f;
                return;
            }
        }
        throw new IllegalArgumentException("No field of type " + type + " in " + this);
    }

    public void setType(String fieldName) {
        ensureAllocated();
        StructField f = fields().get(fieldName);
        if (f != null) {
            activeField = f;
        }
        else {
            throw new IllegalArgumentException("No field named " + fieldName
                    + " in " + this);
        }
    }
}
```

Let's see how to do it with a simple example:

```java
import com.sun.jna.Union;

public class MyUnion extends Union {
    public String foo;
    public double bar;
};
```

Now, let's use `MyUnion` with a hypothetical library:

```text
MyUnion u = new MyUnion();
u.foo = "test";
u.setType(String.class);
lib.some_method(u);
```

If both `foo` and `bar` where of the same type, we'd have to use the field's name instead:

```text
u.foo = "test";
u.setType("foo");
lib.some_method(u);
```

## Using Pointers

JNA offers a `com.sun.jna.Pointer` abstraction
that helps to deal with APIs declared with untyped pointer – typically a `void *`.
**This class offers methods that allow read and write access to the underlying native memory buffer,
which has obvious risks.**

```java
package com.sun.jna;

public class Pointer {
    //...
}
```

Before start using this class, we must be sure we clearly understand who “owns” the referenced memory at each time.
**Failing to do so will likely produce hard to debug errors related to memory leaks and/or invalid accesses.**

Assuming we know what we're doing (as always),
let's see how we can use the well-known `malloc()` and `free()` functions with JNA,
used to allocate and release a memory buffer.

First, let's again create our wrapper interface:

```java
import com.sun.jna.LastErrorException;
import com.sun.jna.Library;
import com.sun.jna.Native;
import com.sun.jna.Platform;
import com.sun.jna.Pointer;

public interface StdC extends Library {
    StdC INSTANCE = Native.load(Platform.isWindows() ? "msvcrt" : "c", StdC.class );

    Pointer malloc(long n);
    void free(Pointer p);

    Pointer memset(Pointer p, int c, long n);
    int open(String path, int flags) throws LastErrorException;
    int close(int fd) throws LastErrorException;
}
```

Now, let's use it to allocate a buffer and play with it:

```java
import com.sun.jna.Pointer;
import lsieun.jna.StdC;

public class JNARun {
    public static void main(String[] args) {
        StdC instance = StdC.INSTANCE;
        Pointer p = instance.malloc(1024);
        p.setMemory(0L, 1024L, (byte) 0);
        instance.free(p);
    }
}
```

The `setMemory()` method just fills the underlying buffer with a constant byte value (zero, in this case).
Notice that the `Pointer` instance has no idea to what it is pointing to, much less its size.
This means that we can quite easily corrupt our heap using its methods.

> much less 更不用说

We'll see later how we can mitigate such errors using JNA's crash protection feature.

