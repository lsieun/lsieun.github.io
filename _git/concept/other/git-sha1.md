---
title: "git SHA1"
sequence: "102"
---

[UP](/git/git-index.html)


## What is a SHA-1 Hash?

A SHA-1 hash is a secure hash digest function that is used extensively in Git.
It outputs a 160-bit (20-byte) hash value, which is usually displayed as a 40-character hexadecimal string.
The hash is used to uniquely identify commits by Git by their contents and metadata.
They're used instead of incremental revision numbers (like in Subversion) due to the distributed nature of Git.
When you commit locally, Git can't know whether your commit occurred before or after another commit on another machine,
so it can't use ordered revision numbers.
The full 40 characters are rather unwieldy,
so Git often shows shortened SHA-1s (as long as they're unique in the repository).
Anywhere that Git accepts a SHA-1 unique commit reference,
it will also accept the shortened version (as long as the shortened version is still unique within the repository).

A git repository is actually just a collection of objects, each identified with their own hash.
Whenever you add a file, you get a hash generated on its contents, and this hash is used to uniquely point to that version of a file.
For example, if you create an empty file, it will have the hash `e69de29bb2d1d6434b8b29ae775ad8c2e48c5391`.
You can confirm this by adding an empty file to a repository and using `git ls-tree` to see the contents:

```bash
$ touch empty
$ git add empty 
$ git commit -a -m "Empty"
[master (root-commit) 17742ed] Empty
 1 file changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 empty
$ git ls-tree master .
100644 blob e69de29bb2d1d6434b8b29ae775ad8c2e48c5391	empty
```

What `git ls-tree` is saying is that the `master` branch contains a file called `empty`
whose permissions are `100644` (owner read/write, group+other read),
and whose hash is `e69de29bb2d1d6434b8b29ae775ad8c2e48c5391`.

## 计算 SHA1 值

### git 命令

计算『字符串』的 SHA1 值：

```bash
$ echo "hello world" | git hash-object --stdin
3b18e512dba79e4c8300dd08aeb37f8e728b8dad
```

计算『文件』的 SHA1 值：

```bash
$ echo "hello world" > hello.txt
$ git hash-object hello.txt 
3b18e512dba79e4c8300dd08aeb37f8e728b8dad
```

### bash 命令

计算『字符串』的 SHA1 值：

```bash
$ echo -e "blob 12\0hello world" | sha1sum --text
3b18e512dba79e4c8300dd08aeb37f8e728b8dad  -
```

计算『文件』的 SHA1 值：

```bash
$ printf "blob 12\0hello world\n" | sha1sum --text
3b18e512dba79e4c8300dd08aeb37f8e728b8dad  -
```

### Java 语言

```java
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class HashUtils {
    public static String getBlobHash(String content) {
        byte[] content_bytes = content.getBytes(StandardCharsets.UTF_8);
        int content_bytes_length = content_bytes.length;
        String blob_text = String.format("blob %d\0%s\n", content_bytes_length + 1, content);
        byte[] blob_bytes = blob_text.getBytes(StandardCharsets.UTF_8);
        byte[] digest_bytes = sha1(blob_bytes);
        return HexUtils.toHex(digest_bytes);
    }

    private static byte[] sha1(byte[] bytes) {
        try {
            MessageDigest messageDigest = MessageDigest.getInstance("SHA-1");
            messageDigest.reset();
            messageDigest.update(bytes);
            return messageDigest.digest();
        }
        catch (NoSuchAlgorithmException ex) {
            ex.printStackTrace();
            throw new RuntimeException(ex.getMessage());
        }
    }
    
    public static void main(String[] args) {
        String sha1 = getBlobHash("");
        System.out.println(sha1);
    }
}
```

```java
import java.util.Formatter;

public class HexUtils {
    public static String toHex(final byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        Formatter fm = new Formatter(sb);
        for (byte b : bytes) {
            fm.format("%02x", b);
        }
        return sb.toString();
    }
}
```
