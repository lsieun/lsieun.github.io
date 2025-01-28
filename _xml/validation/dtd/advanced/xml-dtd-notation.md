---
title: "DTD - Notation"
sequence: "109"
---

Because the XML processor cannot process unparsed entities,
it needs a mechanism to associate them with the proper tool.
In the case of an image, it could be an image viewer.

Notation is simply a mechanism to declare the type of **unparsed entities**
and associate them, through an **identifier**, with an application.

```text
<!NOTATION GIF89a PUBLIC "-//CompuServe//NOTATION Graphics Interchange Format 89a//EN" "c:\windows\kodakprv.exe">
```

This declaration is unsafe because it points to a specific application.
The application might not be available on another computer or it might be available but from another path.
If your system has defined the appropriate file associations, you can get away with a declaration such as

```text
<!NOTATION GIF89a SYSTEM "GIF">
<!NOTATION GIF89a SYSTEM "image/gif">
```

The first notation uses the **filename**, while the second uses the **MIME** type.

A **notation** is an arbitrary piece of data that typically describes the format of unparsed binary data,
and typically has the form

```text
<!NOTATION name SYSTEM uri>
```

where `name` identifies the notation and `uri` identifies some kind of plug-in
that can process the data on behalf of the application that's parsing the XML document.

For example,

```text
<!NOTATION image SYSTEM "psp.exe">
```

declares a notation named `image` and identifies Windows executable `psp.exe` as a plug-in for processing images.

It's also common to use **notations** to specify **binary data types** via [media types](https://en.wikipedia.org/wiki/Media_type).
For example,

```text
<!NOTATION image SYSTEM "image/jpeg">
```

declares an image notation that 
identifies the `image/jpeg` media type for Joint Photographic Experts Group images.




