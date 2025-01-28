---
title: "java.nio.CharBuffer"
sequence: "103"
---

[UP](/java-nio.html)


## Creating Buffers

`CharBuffer` provides a couple of useful convenience methods not provided by the other buffer classes:

```text
public abstract class CharBuffer extends Buffer implements CharSequence, Comparable { 
    // This is a partial API listing 
    
    public static CharBuffer wrap(CharSequence csq);
    public static CharBuffer wrap(CharSequence csq, int start, int end); 
}
```

These versions of `wrap()` create **read-only view buffers**
whose backing store is the `CharSequence` object, or a subsequence of that object.

`CharSequence` describes a readable sequence of characters.
As of JDK 1.4, three standard classes implement `CharSequence`: `String`, `StringBuffer`, and `CharBuffer`.
This version of `wrap()` can be useful to "bufferize" existing character data to access their content through the Buffer API.
This can be handy for **character set encoding** and **regular expression processing**.

```text
CharBuffer charBuffer = CharBuffer.wrap("Hello World");
```

The three-argument form takes `start` and `end` index positions describing a subsequence of the given `CharSequence`.
This is a convenience pass-through to `CharSequence.subsequence()`.
The `start` argument is the first character in the sequence to use; `end` is the last position of the character **plus one**.

## Transfer Data

```java
public abstract class CharBuffer extends Buffer implements CharSequence, Comparable { 
    // This is a partial API listing 
    
    public CharBuffer get(char [] dst);
    public CharBuffer get(char [] dst, int offset, int length);
    
    public final CharBuffer put(char[] src);
    public CharBuffer put(char [] src, int offset, int length);
    public CharBuffer put(CharBuffer src);
    
    public final CharBuffer put(String src);
    public CharBuffer put(String src, int start, int end);
}
```

But the last two methods contain two bulk move methods unique to `CharBuffer`:

```java
public abstract class CharBuffer extends Buffer implements CharSequence, Comparable { 
    // This is a partial API listing 
    
    public final CharBuffer put (String src);
    public CharBuffer put (String src, int start, int end);
}
```

These take `String`s as arguments and are similar to the bulk move methods that operate on `char` arrays.
As all Java programmers know, `String`s are not the same as arrays of `char`s.
But `String`s do contain sequences of `char`s,
and we humans do tend to conceptualize them as `char` arrays (especially those of us who were or are C or C++ programmers).
For these reasons, the `CharBuffer` class provides convenience methods to copy `String`s into `CharBuffer`s.

`String` moves are similar to `char` array moves,
with the exception that subsequences are specified by the `start` and `end-plus-one` indexes
(similar to `String.subString()`) rather than the `start` index and `length`.
So this:

```text
buffer.put(myString);
```

is equivalent to:

```text
buffer.put (myString, 0, myString.length());
```

And this is how you'd copy characters 5-8, a total of four characters, from `myString` into `buffer`:

```text
buffer.put(myString, 5, 9);
```

A `String` bulk move is the equivalent of doing this:

```text
for (int i = start; i < end; i++) } 
    buffer.put(myString.charAt(i)); 
}
```

The same range checking is done for `String`s as for `char` arrays.
A `BufferOverflowException` is thrown if all the characters do not fit into the buffer.
