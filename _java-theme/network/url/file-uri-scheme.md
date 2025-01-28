---
title: "File URI scheme"
sequence: "107"
---

URL: https://en.wikipedia.org/wiki/File_URI_scheme

A file URI takes the form of

```txt
file://host/path
```

where `host` is the **fully qualified domain name of the system** on which the `path` is accessible,
and `path` is a hierarchical directory path of the form `directory/directory/.../name`.

If `host` is omitted, it is taken to be "`localhost`", the machine from which the URL is being interpreted.
Note that when omitting `host`, the slash is not omitted
(while "`file:///foo.txt`" is valid, "`file://foo.txt`" is not, although some interpreters manage to handle the latter).

Unix

```txt
file://localhost/<path>
file:///<path>
```

Windows

```txt
file://localhost/<drive>|/<path>
file:///<drive>|/<path>
file://localhost/<drive>:/<path>
file:///<drive>:/<path>
```
