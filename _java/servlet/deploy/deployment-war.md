---
title: "Deployment"
sequence: "103"
---

The recommended method for deploying a servlet/JSP application is to deploy it as a war file.
A war file is a jar file with `war` extension.
You can create a war file using the `jar` program that comes with the JDK or tools like WinZip.
You can then copy the war file to Tomcat's `webapps` directory.
When you start or restart Tomcat, Tomcat will extract the war file automatically.
Deployment as a war file will work in all servlet containers.

```text
jar -cvf myapp.war WEB-INF/
```

Deploying a Servlet/JSP application has always been easy since the first version of Servlet.
It has just been a matter of zipping all application resources
in its original directory structure into a war file.
You can either use the jar tool in the JDK or a popular tool such as WinZip.
All you need is make sure the zipped file has `war` extension.
If you're using WinZip, rename the result once it's done.



You must include in your `war` file all libraries and class files as well as
HTML files, JSP pages, images, copyright notices (if any), and so on.
Do not include Java source files.
Anyone who needs your application can simply get a copy of your war file and deploy it in a servlet/JSP container.
