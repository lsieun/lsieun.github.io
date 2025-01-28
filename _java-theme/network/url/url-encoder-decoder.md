---
title: "URLEncoder And URLDecoder"
sequence: "106"
---

## x-www-form-urlencoded

One of the challenges faced by the designers of the Web was dealing with the differences between operating systems. These differences can cause problems with URLs: for example, some operating systems allow spaces in filenames; some don't. Most operating systems won't complain about a `#` sign in a filename; but in a URL, a `#` sign indicates that the filename has ended, and a fragment identifier follows. Other special characters, nonalphanumeric characters, and so on, all of which may have a special meaning inside a URL or on another operating system, present similar problems. Furthermore, Unicode was not yet ubiquitous when the Web was invented, so not all systems could handle characters such as é and 本. **To solve these problems, characters used in URLs must come from a fixed subset of ASCII**, specifically:

- The capital letters A-Z
- The lowercase letters a-z
- The digits 0-9
- The punctuation characters - _ . ! ~ * ' (and ,)

The characters : / & ? @ # ; $ + = and % may also be used, but only for their specified purposes. If these characters occur as part of a path or query string, they and all other characters should be encoded.

The encoding is very simple. **Any characters that are not ASCII numerals, letters, or the punctuation marks** specified earlier are converted into bytes and each byte is written as **a percent sign** followed by **two hexadecimal digits**. **Spaces** are a special case because they're so common. Besides being encoded as `%20`, they can be encoded as a plus sign (`+`). **The plus sign** itself is encoded as `%2B`. The / # = & and ? characters should be encoded when they are used as part of a name, and not as a separator between parts of the URL.

Java provides `URLEncoder` and `URLDecoder` classes to cipher strings in this format.

## URLEncoder

To `URL` encode a string, pass the string and the character set name to the `URLEncoder.encode()` method. For example:

```text
String encoded = URLEncoder.encode("This*string*has*asterisks", "UTF-8");
```

`URLEncoder.encode()` returns a copy of the input string with a few changes. Any non‐alphanumeric characters are converted into `%` sequences (except the space, underscore, hyphen, period, and asterisk characters). It also encodes all non-ASCII characters. The **space** is converted into a **plus** sign. This method is a little overaggressive; it also converts **tildes**, **single quotes**, **exclamation points**, and **parentheses** to **percent escapes**, even though they don't absolutely have to be. However, this change isn't forbidden by the `URL` specification, so web browsers deal reasonably with these excessively encoded URLs.

Although this method allows you to specify **the character set**, the only such character set you should ever pick is `UTF-8`. `UTF-8` is compatible with the IRI specification, the `URI` class, modern web browsers, and more additional software than any other encoding you could choose.

## URLDecoder

The corresponding `URLDecoder` class has a static `decode()` method that decodes strings encoded in x-www-form-url-encoded format. That is, it converts **all plus signs** to **spaces** and **all percent escapes** to **their corresponding character**:

```text
public static String decode(String s, String encoding)
    throws UnsupportedEncodingException
```

If you have any doubt about which encoding to use, pick `UTF-8`. It's more likely to be correct than anything else.

An `IllegalArgumentException` should be thrown if the string contains **a percent sign** that isn't followed by two hexadecimal digits or decodes into an illegal sequence.

Since `URLDecoder` does not touch non-escaped characters, you can pass an entire URL to it rather than splitting it into pieces first. For example:

```text
String input = "https://www.google.com/search?hl=en&as_q=Java&as_epq=I%2FO";
String output = URLDecoder.decode(input, "UTF-8");
System.out.println(output);
```

```java
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

public class URLRun {
    public static void main(String[] args) {
        String[] array = {
                "This string has spaces",
                "This*string*has*asterisks",
                "This%string%has%percent%signs",
                "This+string+has+pluses",
                "This/string/has/slashes",
                "This\"string\"has\"quote\"marks",
                "This:string:has:colons",
                "This~string~has~tildes",
                "This(string)has(parentheses)",
                "This.string.has.periods",
                "This=string=has=equals=signs",
                "This&string&has&ampersands",
                "Thiséstringéhasé non-ASCII characters"
        };

        for (String str : array) {
            encode(str);
        }
    }

    private static void encode(String str) {
        String encodedStr = URLEncoder.encode(str, StandardCharsets.UTF_8);
        String message = String.format("%s: %s", str, encodedStr);
        System.out.println(message);
    }
}
```

```text
This string has spaces: This+string+has+spaces
This*string*has*asterisks: This*string*has*asterisks
This%string%has%percent%signs: This%25string%25has%25percent%25signs
This+string+has+pluses: This%2Bstring%2Bhas%2Bpluses
This/string/has/slashes: This%2Fstring%2Fhas%2Fslashes
This"string"has"quote"marks: This%22string%22has%22quote%22marks
This:string:has:colons: This%3Astring%3Ahas%3Acolons
This~string~has~tildes: This%7Estring%7Ehas%7Etildes
This(string)has(parentheses): This%28string%29has%28parentheses%29
This.string.has.periods: This.string.has.periods
This=string=has=equals=signs: This%3Dstring%3Dhas%3Dequals%3Dsigns
This&string&has&ampersands: This%26string%26has%26ampersands
Thiséstringéhasé non-ASCII characters: This%C3%A9string%C3%A9has%C3%A9+non-ASCII+characters
```
