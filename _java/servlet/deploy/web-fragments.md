---
title: "Web Fragments"
sequence: "104"
---

Servlet 3 adds **web fragments**, a new feature for deploying plug-ins or frameworks in an existing web application.
Web fragments are designed to complement the deployment descriptor without having to edit the `web.xml` file.

A web fragment is basically a package (jar file) containing the usual web objects,
such as servlets, filter, and listeners, and other resources, such as JSP pages and static images.
A web fragment can also have a descriptor,
which is an XML document similar to the deployment descriptor.
The web fragment descriptor must be named `web-fragment.xml` and
reside in the `META-INF` directory of the package.
A web fragment descriptor may contain any elements
that may appear under the `web-app` element in the deployment descriptor,
plus some web fragment-specific elements.
An application can have multiple web fragments.

The following shows the skeleton of the web fragment descriptor.
The root element in a web fragment is, unsurprisingly, `web-fragment`.
The `web-fragment` element can even have the `metadata-complete` attribute.
If the value of the `metadata-complete` attribute is `true`,
annotations in the classes contained by the web fragment will be skipped.

```text
<?xml version="1.0" encoding="ISO-8859-1"?>
<web-fragment xmlns="http://java.sun.com/xml/ns/javaee"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://java.sun.com/xml/ns/javaee 
http://java.sun.com/xml/ns/javaee/web-fragment_3_0.xsd"
    version="3.0"
    [metadata-complete="true|false"]
> 
    ...
</web-fragment>
```

As an example, the app16a application contains a web fragment in a jar file named `fragment.jar`.
The jar file has been imported to the `WEB-INF/lib` directory of app16a.
The focus of this example is not on app16a but rather on the webfragment project,
which contains a servlet
(`fragment.servlet.FragmentServlet`) and a `web-fragment.xml` file.

The FragmentServlet class

```java
package fragment.servlet;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
public class FragmentServlet extends HttpServlet {
    private static final long serialVersionUID = 940L;
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        out.println("A plug-in");
    }
}
```

The web fragment descriptor in project webfragment

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-fragment xmlns="http://java.sun.com/xml/ns/javaee"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://java.sun.com/xml/ns/javaee 
http://java.sun.com/xml/ns/javaee/web-fragment_3_0.xsd"
    version="3.0"
>
    <servlet>
        <servlet-name>FragmentServlet</servlet-name>
        <servlet-class>fragment.servlet.FragmentServlet</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>FragmentServlet</servlet-name>
        <url-pattern>/fragment</url-pattern>        
    </servlet-mapping>
</web-fragment>
```
