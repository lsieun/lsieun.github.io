---
title: "webapp"
sequence: "103"
---

The `webapp` directory must be seen as the document root of the application and positioned at the root level of the WAR.
The public static web resources under `webapp`, such as HTML files, Javascript, CSS, and image files,
can be placed in the subdirectories and structure of our choice.

However, as described in the Servlet 3.0 Specification,
**the `WEB-INF` directory is a special directory within the application hierarchy.**
**All its contents can never be reached from outside the application;**
its content is accessible from the servlet code calling for `getResource` or `getResourceAsStream` on `ServletContext`.
The specification also tells us that the content of a `WEB-INF` directory is made up of the following:

- The `/WEB-INF/web.xml` deployment descriptor.
- The `/WEB-INF/classes/` directory for servlet and utility classes.
  The classes in this directory must be available to the application class loader.
- The `/WEB-INF/lib/*.jar` area for Java ARchive files.
  These files contain servlets, beans, static resources,
  and JSPs packaged in a JAR file and other utility classes useful to the web application.
  The web application class loader must be able to load classes from any of these archive files.

```text
                          ┌─── web.xml
                          │
                          ├─── classes
          ┌─── WEB-INF ───┤
          │               ├─── lib/*.jar
          │               │
          │               └─── jsp
webapp ───┤
          │               ┌─── html
          │               │
          │               ├─── js
          └─── assets ────┤
                          ├─── css
                          │
                          └─── images
```

The **Web application class loader** must load classes from the `WEB-INF/classes` directory first,
and then from library JARs in the `WEB-INF/lib` directory.

```text
加载类的顺序：WEB-INF/classes --> WEB-INF/lib
```

Also, except for the case where **static resources** are packaged in JAR files,
any requests from the client to access the resources in `WEB-INF/` directory
must be returned with a `SC_NOT_FOUND` (`404`) response.

```text
static resources
```

It is good practice to create a `jsp` directory inside the `WEB-INF` folder
so that the jsp files cannot be directly targeted
without passing through an explicitly defined controller.

```text
jsp 推荐放的位置
```

