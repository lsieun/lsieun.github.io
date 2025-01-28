---
title: "Java IO"
image: /assets/images/java/io/java-io.jpg
permalink: /java/java-io-index.html
---

Java Classic I/O and NIO.2

## API

### OIO

```text
               ┌─── InputStream
               │
               ├─── OutputStream
               │
               │                                   ┌─── ByteArrayInputStream
               │                    ┌─── byte[] ───┤
               │                    │              └─── ByteArrayOutputStream
               │                    │
               │                    │              ┌─── ObjectInputStream
               ├─── type ───────────┼─── Object ───┤
               │                    │              └─── ObjectOutputStream
               │                    │
               │                    │              ┌─── FileInputStream
Classic I/O ───┤                    └─── File ─────┤
               │                                   └─── FileOutputStream
               │
               │                    ┌─── FilterInputStream
               │                    │
               │                    ├─── FilterOutputStream
               │                    │
               │                    │                          ┌─── BufferedInputStream
               │                    ├─── buffered ─────────────┤
               │                    │                          └─── BufferedOutputStream
               │                    │
               │                    │                          ┌─── InflaterInputStream
               │                    │                          │
               └─── filter ─────────┤                          ├─── DeflaterOutputStream
                                    │                          │
                                    ├─── compression ──────────┤                            ┌─── ZipInputStream
                                    │                          ├─── zip ────────────────────┤
                                    │                          │                            └─── ZipOutputStream
                                    │                          │
                                    │                          │                            ┌─── GZIPInputStream
                                    │                          └─── gzip ───────────────────┤
                                    │                                                       └─── GZIPOutputStream
                                    │
                                    │                          ┌─── CipherInputStream
                                    └─── cipher ───────────────┤
                                                               └─── CipherOutputStream
```

### NIO

<table>
    <thead>
    <tr>
        <th>基础</th>
        <th>FileSystem</th>
        <th>Path</th>
        <th>Attribute</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/io/api/nio/basic/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/io/api/nio/filesystem/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/io/api/nio/path/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/io/api/nio/attr/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
    </tr>
    </tbody>
</table>

## 专题

### 文件系统

<table>
    <thead>
    <tr>
        <th>File System</th>
        <th>File Store</th>
        <th>Path</th>
        <th>Service</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/io/theme/filesystem/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/io/theme/filestore/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/io/theme/path/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/io/theme/service/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
    </tr>
    </tbody>
</table>

- [File System Mocking with Jimfs](https://www.baeldung.com/jimfs-file-system-mocking)

### 目录和连接

<table>
    <thead>
    <tr>
        <th>Directory</th>
        <th>Temporary</th>
        <th>Link</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/io/theme/dir/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/io/theme/temp/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/io/theme/link/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
    </tr>
    </tbody>
</table>

### 文件

<table>
    <thead>
    <tr>
        <th style="text-align: center;">文件::基础</th>
        <th style="text-align: center;">文件::内容</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/io/theme/file/basic/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/io/theme/file/content/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
    </tr>
    </tbody>
</table>

### 属性

<table>
    <thead>
    <tr>
        <th style="text-align: center;" rowspan="2">属性::基础</th>
        <th style="text-align: center;" colspan="3">属性::具体项</th>
    </tr>
    <tr>
        <th style="text-align: center;">Space + Time</th>
        <th style="text-align: center;">Owner + Permission</th>
        <th style="text-align: center;">Other</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/io/theme/attr/basic/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/io/theme/attr/space-and-time/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/io/theme/attr/owner-and-permission/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/io/theme/attr/other/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
    </tr>
    </tbody>
</table>

### 控制台

<table>
    <thead>
    <tr>
        <th>读数据</th>
        <th>写数据</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/io/theme/console/in/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/io/theme/console/out/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
    </tr>
    </tbody>
</table>

### 数据流

## Reference

- [Baeldung Tag: Java IO](https://www.baeldung.com/tag/java-io)

书籍

- 《Java I/O, NIO and NIO.2》
    - 第 12 章 Improved File System Interface

- [How to Read a Large File Efficiently with Java](https://www.baeldung.com/java-read-lines-large-file)
- []()
- File
- [File Size in Java](https://www.baeldung.com/java-file-size)
- [How to Get the File Extension of a File in Java](https://www.baeldung.com/java-file-extension)
- [How to Copy a File with Java](https://www.baeldung.com/java-copy-file)
- [How to Lock a File in Java](https://www.baeldung.com/java-lock-files)
- [The Java File Class](https://www.baeldung.com/java-io-file)
- [Create a File in a Specific Directory in Java](https://www.baeldung.com/java-create-file-in-directory)
- [Create a Symbolic Link with Java](https://www.baeldung.com/java-symlink)
- [Guide to Java FileChannel](https://www.baeldung.com/java-filechannel)
- []()
- File Content
- [Java – Append Data to a File](https://www.baeldung.com/java-append-to-file)
- [How to Remove Line Breaks From a File in Java](https://www.baeldung.com/java-file-remove-line-breaks)
- [Detect EOF in Java](https://www.baeldung.com/java-file-detect-end-of-file)
- [Check if a File Is Empty in Java](https://www.baeldung.com/java-check-file-empty)
- [Reading a Line at a Given Line Number From a File in Java](https://www.baeldung.com/java-read-line-at-number)
- [Java Files Open Options](https://www.baeldung.com/java-file-options)
- [Find the Number of Lines in a File Using Java](https://www.baeldung.com/java-file-number-of-lines)
- [Get the Current Working Directory in Java](https://www.baeldung.com/java-current-directory)
- [Delete the Contents of a File in Java](https://www.baeldung.com/java-delete-file-contents)
- []()
- Dir
- [Java – Directory Size](https://www.baeldung.com/java-folder-size)
- [Delete a Directory Recursively in Java](https://www.baeldung.com/java-delete-directory)
- [Quick Use of FilenameFilter](https://www.baeldung.com/java-filename-filter)
- [Checking Write Permissions of a Directory in Java](https://www.baeldung.com/java-check-directory-write-permissions)
- [Find the Last Modified File in a Directory with Java](https://www.baeldung.com/java-last-modified-file)
- [Creating Temporary Directories in Java](https://www.baeldung.com/java-temp-directories)
- [Copy a Directory in Java](https://www.baeldung.com/java-copy-directory)
- [Check If a File or Directory Exists in Java](https://www.baeldung.com/java-file-directory-exists)
- [Check If a Directory Is Empty in Java](https://www.baeldung.com/java-check-empty-directory)
- [List Files in a Directory in Java](https://www.baeldung.com/java-list-directory-files)
- [Find Files That Match Wildcard Strings in Java](https://www.baeldung.com/java-files-match-wildcard-strings)
- []()
- Path
- []()
- []()
- Exception
- [Java IOException “Too many open files”](https://www.baeldung.com/java-too-many-open-files)
- [How to Avoid the Java FileNotFoundException When Loading Resources](https://www.baeldung.com/java-classpath-resource-cannot-be-opened)
- []()
- [Java IO vs NIO](https://www.baeldung.com/java-io-vs-nio)
