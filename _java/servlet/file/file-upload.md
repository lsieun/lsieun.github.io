---
title: "File Upload"
sequence: "101"
---

## Client Side Programming

To upload a file, you must set the value of the `enctype` attribute of your
HTML form with `multipart/form-data`, like this:

```html
<form action="action" enctype="multipart/form-data" method="post">
    Select a file <input type="file" name="fieldName"/>
    <input type="submit" value="Upload"/>
</form>
```

The form must contain an input element of type `file`, which will be rendered as a button that,
when clicked, opens a dialog to select a file.
The form may also contain other field types such as **a text area** or **a hidden field**.

Prior to HTML 5, if you wanted to upload multiple files, you had to use multiple file `<input>` elements.
HTML 5, however, makes multiple file uploads simpler by introducing the `multiple` attribute in the `<input>` element.
You can write one of the following in HTML 5 to generate a button for selecting multiple files:

```text
<input type="file" name="fieldName" multiple/>
<input type="file" name="fieldName" multiple="multiple"/>
<input type="file" name="fieldName" multiple=""/>
```

## Server Side Programming

Server side file upload programming in Servlet centers around the
`MultipartConfig` annotation type and the `javax.servlet.http.Part` interface.

### MultipartConfig

Servlets that handle uploaded files must be annotated `@MultipartConfig`.

`MultipartConfig` may have the following attributes, all of which optional.

- `maxFileSize`. The maximum size for uploaded files.
  Files larger than the specified value will be rejected.
  By default, the value of `maxFileSize` is `-1`, which means unlimited.
- `maxRequestSize`. The maximum size allowed for multipart HTTP requests.
  By default, the value is `-1`, which translates into unlimited.
- `location`. The save location when the uploaded file is saved to disk by calling the write method on the `Part`.
- `fileSizeThreshold`. The size threshold after which the uploaded file will be written to disk.

```java
package javax.servlet.annotation;

import java.lang.annotation.Target;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;


@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface MultipartConfig {

    String location() default "";

    long maxFileSize() default -1L;

    long maxRequestSize() default -1L;

    int fileSizeThreshold() default 0;
}
```

### Part

In a **multipart request**, **every form field, including non-file fields**, is converted into a `Part`.


```java
package javax.servlet.http;

import java.io.*;
import java.util.*;


public interface Part {
    // Retrieves the name of this part, i.e. the name of the associated form field.
    String getName();

    // If the Part is a file, returns the content type of the Part. Otherwise, returns null.
    String getContentType();

    // Returns the value of the specified header name.
    String getHeader(String name);

    // Returns the values of the Part header.
    Collection<String> getHeaders(String name);

    // Returns all header names in this Part.
    Collection<String> getHeaderNames();

    String getSubmittedFileName();

    long getSize();

    // Returns the content of the uploaded file as an InputStream.
    InputStream getInputStream() throws IOException;

    // Writes the uploaded file to the disk.
    // If path is an absolute path, writes to the specified path.
    // If path is a relative path, write to the path specified path relative to
    // the value of the location attribute of the MultiConfig annotation.
    void write(String fileName) throws IOException;

    // Deletes the underlying storage for this file including the associated temporary file.
    void delete() throws IOException;
}
```

The `HttpServletRequest` interface defines the following methods for working with multipart requests:

```java
package javax.servlet.http;

public interface HttpServletRequest extends ServletRequest {
    Part getPart(String name) throws IOException, ServletException;

    Collection<Part> getParts() throws IOException, ServletException;
}
```

#### file field

A `Part` returns these headers if the corresponding HTML input is a file `<input>` element:

```text
content-type: contentType
content-disposition:form-data; name="fieldName"; filename="fileName"
```

For example, uploading a `note.txt` file in an input field called `document`
will cause the associated part to have these headers:

```text
content-type:text/plain
content-disposition:form-data; name="document"; filename="note.txt"
```

If **no file** is selected, a `Part` will still be created for the file field,
but the associated headers will be as follows:

```text
content-type:application/octet-stream
content-disposition:form-data; name="document"; filename=""
```

The `getName` of the `Part` interface returns the field name associated with this part,
not the name of the uploaded file.
To get the latter, you need to parse the `content-disposition` header.

#### non-file field

For **a non-file field**, a `Part` will only have a `content-disposition` header,
which is of the following format:

```text
content-disposition:form-data; name="fieldName"
```

### Process Uploaded Files

When processing uploaded files in a servlet, you need to

- check if a `Part` is an ordinary form field or a file field by checking whether the `content-type` header exists.
  You can do this by calling the `getContentType` method or `getHeader("content-type")` on the `Part`.
- If the `content-type` header exists, check if the uploaded file name is empty.
  An empty file name indicates the presence of a field of file type but no file was selected for upload.
- If a file exists, you can write to the disk by calling the `write` method on the `Part`,
  passing an absolute path or a path relative to the location `attribute` of the `MultipartConfig` annotation.

```text
ContentType(header) ---> file name --> Part.write(disk)
```
