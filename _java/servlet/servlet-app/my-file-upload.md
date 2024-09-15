---
title: "File Upload"
sequence: "105"
---

The default `ENCTYPE` attribute of the `FORM`
element using the `POST` METHOD to have the default value `application/x-www-form-urlencoded`.

multipart/form-data

```html
<FORM ENCTYPE="multipart/form-data" ACTION="_URL_" METHOD="POST">

File to process: <INPUT NAME="userfile1" TYPE="file">

<INPUT TYPE="submit" VALUE="Send File">

</FORM>
```

A `boundary` is selected that does not occur in any of the data.
(This selection is sometimes done probabilisticly.)
Each field of the form is sent, in the **order** in which it occurs in the form, as a part of the multipart stream.
Each part identifies the **INPUT name** within the original HTML form.
Each part should be labelled with an appropriate **content-type** if the media type is known
(e.g., inferred from the file extension or operating system typing information)
or as `application/octet-stream`.

- order
- input name
- content type

The original local file name may be supplied as well,
either as a `filename` parameter either of the `content-disposition: form-data` header
or in the case of multiple files in a `content-disposition: file` header of the subpart.
The client application should make best effort to supply the file name;
if the file name of the client's operating system is not in US-ASCII,
the file name might be approximated or encoded using the method of RFC 1522.

- filename

```text
POST /upload HTTP/1.1
Host: 127.0.0.1
Connection: keep-alive
Content-Length: 652
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryhVnATjuwYQr4uUxE
User-Agent: Mozilla/5.0 (Windows NT 6.1; Win64; x64)
Accept: text/html,application/xhtml+xml,application/xml

------WebKitFormBoundaryhVnATjuwYQr4uUxE
Content-Disposition: form-data; name="username"

刘森
------WebKitFormBoundaryhVnATjuwYQr4uUxE
Content-Disposition: form-data; name="password"

123456
------WebKitFormBoundaryhVnATjuwYQr4uUxE
Content-Disposition: form-data; name="gender"

男
------WebKitFormBoundaryhVnATjuwYQr4uUxE
Content-Disposition: form-data; name="my-first-file"; filename="first.txt"
Content-Type: text/plain

﻿AAA
------WebKitFormBoundaryhVnATjuwYQr4uUxE
Content-Disposition: form-data; name="my-second-file"; filename="second.txt"
Content-Type: text/plain

﻿BBB
------WebKitFormBoundaryhVnATjuwYQr4uUxE--
```

`CRLF` used as line separator

As with all MIME transmissions, `CRLF` is used as the separator for
lines in a POST of the data in `multipart/form-data`.

## Examples

Suppose the server supplies the following HTML:

```text
<FORM ACTION="http://server.dom/cgi/handle"
      ENCTYPE="multipart/form-data"
      METHOD=POST>
What is your name? <INPUT TYPE=TEXT NAME="field1">
What files are you sending? <INPUT TYPE=FILE NAME=pics>
</FORM>
```

and the user types "Joe Blow" in the name field,
and selects a text file "file1.txt" for the answer to 'What files are you sending?'

The client might send back the following data:

```text
Content-type: multipart/form-data, boundary=AaB03x

--AaB03x
content-disposition: form-data; name="field1"

Joe Blow
--AaB03x
content-disposition: form-data; name="pics"; filename="file1.txt"
Content-Type: text/plain

 ... contents of file1.txt ...
--AaB03x--
```

If the user also indicated an image file "file2.gif" for the answer
to 'What files are you sending?', the client might client might send
back the following data:

```text
Content-type: multipart/form-data, boundary=AaB03x

--AaB03x
content-disposition: form-data; name="field1"

Joe Blow
--AaB03x
content-disposition: form-data; name="pics"
Content-type: multipart/mixed, boundary=BbC04y

--BbC04y
Content-disposition: attachment; filename="file1.txt"
Content-Type: text/plain

... contents of file1.txt ...
--BbC04y
Content-disposition: attachment; filename="file2.gif"
Content-type: image/gif
Content-Transfer-Encoding: binary

  ...contents of file2.gif...
--BbC04y--
--AaB03x--
```

## Registration of multipart/form-data

In a **form**, there are a series of **fields** to be supplied by the user who fills out the form.
Each **field** has a **name**. Within a given form, the names are unique.

- form
  - field1: name
  - field2: name

`multipart/form-data` contains a series of parts.
Each part is expected to contain a `content-disposition` header
where the value is "`form-data`" and a `name` attribute specifies the field name within the form,
e.g., `content-disposition: form-data; name="xxxxx"`,
where `xxxxx` is the field name corresponding to that field.

```text
Content-Disposition: form-data; name="my-first-file"; filename="first.txt"
Content-Type: text/plain
```

As with all multipart MIME types, each part has an optional `Content-Type` which defaults to `text/plain`.
If the contents of a file are returned via filling out a form,
then the file input is identified as `application/octet-stream` or the appropriate media type, if known.
If multiple files are to be returned as the result of a single form entry,
they can be returned as `multipart/mixed` embedded within the `multipart/form-data`.

File inputs may also identify the file name.
The file name may be described using the `filename` parameter of the `content-disposition` header.
This is not required, but is strongly recommended in any case
where the original filename is known.
This is useful or necessary in many applications.

## Reference

- [RFC1867: Form-based File Upload in HTML](https://datatracker.ietf.org/doc/html/rfc1867)
