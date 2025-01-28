---
title: "File Download"
sequence: "111"
---

To send a resource such as a file to the browser,
you need to do the following in your servlet.
It is uncommon to use JSP pages as you're sending a binary and there's nothing to display in the browser.

1. Set the response's content type to the file's content type.
   The `Content-Type` header specifies the type of the data in the body of an entity and
   consists of the media type and subtype identifiers.
   Visit https://www.iana.org/assignments/media-types for standard content types.
   If you do not know what the content type is or want the browser to always display the Save As dialog,
   set it to `APPLICATION/OCTET-STREAM`. **This value is not case sensitive.**

2. Add an HTTP response header named `Content-Disposition` and give
   it the value `attachment; filename=fileName`, where `fileName` is the
   default file name that appears in the File Download dialog box. This
   is normally the same name as the file, but does not have to be so.



```text
小总结：
下载文件时，需要设置两个 Header：Content-Type 和 Content-Disposition
```

For instance, this code sends a file to the browser.

```text
FileInputStream fis = new FileInputStream(file);
BufferedInputStream bis = new BufferedInputStream(fis);
byte[] bytes = new byte[bis.available()];
response.setContentType(contentType);
OutputStream os = response.getOutputStream();
bis.read(bytes);
os.write(bytes);
```



