---
title: "Deployment Descriptor Overview"
sequence: "102"
---

Before Servlet 3 deployment always involved a `web.xml` file, the deployment descriptor,
in which you configured various aspects of your application.
With Servlet 3 the deployment descriptor is optional
because you can use annotations to map a resource with a URL pattern.
However, **the deployment descriptor is needed if one of these applies to you**.

- You need to pass initial parameters to the `ServletContext`.
- You have multiple filters, and you want to specify the order in which the filters are invoked.
- You need to change the session timeout.
- You want to restrict access to a resource collection and provide a way for the user to authenticate themselves.

The following shows the skeleton of the deployment descriptor.
It must be named `web.xml` and reside in the `WEB-INF` directory of the application directory.

```text
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd"
         version="3.1"
         [metadata-complete="true|false"]
>
    
</web-app>
```

The `xsi:schemaLocation` attribute specifies the location of the schema
against which the deployment descriptor can be validated.
The `version` attribute specifies the version of the Servlet specification.

The optional `metadata-complete` attribute specifies whether the deployment descriptor is complete.
If its value is `true`, the servlet/JSP container must ignore servlet-specific annotations.
If this element is set to `false` or if it's not present,
the container must examine the class files deployed with the application
for servlet-specific annotations and scan for web fragments.

The `web-app` element is the root element and can have subelements for specifying:

- servlet declarations
- servlet mappings
- ServletContext initial parameters
- session configuration
- listener classes
- filter definitions and mappings
- MIME type mappings
- welcome file list
- error pages
- JSP-specific settings
- JNDI settings

The rules for each of the elements that may appear in a deployment descriptor
are given in the `web-app_3_0.xsd` schema
that can be downloaded from this site.

```text
http://java.sun.com/xml/ns/javaee/web-app_3_0.xsd
```

The `web-app_3.0.xsd` schema includes another schema (`web-common_3_0.xsd`)
that contains most of the information.
The other schema can be found here.

```text
http://java.sun.com/xml/ns/javaee/web-common_3_0.xsd
```

In turn, `web-common_3_0.xsd` includes two other schemas:

- `javaee_6.xsd`, which defines common elements shared by other Java EE 6 deployment types (EAR, JAR and RAR)
- `jsp_2_2.xsd`, which defines elements for configuring the JSP part of an application according to JSP 2.2
  specification

The rest of this section lists servlet and JSP elements that may appear in the deployment descriptor.
It does not include Java EE elements that are not in the Servlet or JSP specification.

## Core Elements

This section discusses the more important elements in detail.
Subelements of `<web-app>` can appear in any order.
Certain elements, such as `session-config`, `jsp-config`, and `login-config`, can appear only once.
Others, such as `servlet`, `filter`, and `welcome-file-list`, can appear many times.

The more important elements that can appear directly under `<web-app>` are given a separate subsection.
To find the description of an element which is not directly under `<web-app>`, trace its parent element.
For example, the `taglib` element can be found under the subsection `jsp-config` and
the `load-on-startup` element under `servlet`.
The subsections under this section are presented in alphabetical order.

### context-param

The `context-param` element passes values to the `ServletContext`.
These values can be read from any servlet/JSP page.
This element contains a name/value pair that can be retrieved
by calling the `getInitParameter` method on the `ServletContext`.
You can have multiple `context-param` elements
as long as the parameter names are unique throughout the application.
`ServletContext.getInitParameterNames()` returns all `ServletContext` parameter names.

The `context-param` element must contain a `param-name` element and a `param-value` element.
The `param-name` element contains the parameter name,
and the `param-value` element the parameter value.
Optionally, a `description` element also can be present to describe the parameter.

The following are two example `context-param` elements.

```text
<context-param>
    <param-name>location</param-name>
    <param-value>localhost</param-value>
</context-param>
<context-param>
    <param-name>port</param-name>
    <param-value>8080</param-value>
    <description>The port number used</description>
</context-param>
```

### distributable

If present, the `distributable` element indicates that
the application is written to be deployed into a distributed servlet/JSP container.
The `distributable` element must be empty.
For example, here is a distributable element.

```xml
<distributable/>
```

### error-page

The `error-page` element contains a mapping
between **an HTTP error code** to **a resource path** or between **a Java exception type** to **a resource path**.
The `error-page` element dictates the container
that the specified resource should be returned in the event of the HTTP error or
if the specified exception is thrown.

This element must contain the following sub-elements.

- `error-code`, to specify an HTTP error code
- `exception-type`, to specify the fully-qualified name of the Java exception type to be captured
- `location`, to specify the location of the resource to be displayed in the event of an error or exception.
  The `location` element must start with a `/`.

For example, the following is an `error-page` element that tells the servlet/JSP container
to display the `error.html` page located at the application directory
every time an HTTP 404 error code occurs:

```xml
<error-page>
    <error-code>404</error-code>
    <location>/error.html</location>
</error-page>
```

The following is an `error-page` element
that maps all servlet exceptions with the `exceptions.html` page.

```xml
<error-page>
    <exception-type>javax.servlet.ServletException</exception-type>
    <location>/exception.html</location>
</error-page>
```

### filter

This element specifies a servlet filter.
At the very minimum, this element must contain a `filter-name` element and a `filter-class` element.
Optionally, it can also contain the following elements:
`icon`, `display-name`, `description`, `init-param`, and `async-supported`.

The `filter-name` element defines the name of the filter.
The filter name must be unique within the application.
The `filter-class` element specifies the fully qualified name of the filter class.
The `init-param` element is used to specify an initial parameter for the filter and
has the same element descriptor as `<context-param>`.
A filter element can have multiple `init-param` elements.

The following are two `filter` elements
whose names are Upper Case Filter and Image Filter, respectively.

```text
<filter>
    <filter-name>Upper Case Filter</filter-name>
    <filter-class>com.example.UpperCaseFilter</filter-class>
</filter>
<filter>
    <filter-name>Image Filter</filter-name>
    <filter-class>com.example.ImageFilter</filter-class>
    <init-param>
        <param-name>frequency</param-name>
        <param-value>1909</param-value>
     </init-param>
    <init-param>
        <param-name>resolution</param-name>
        <param-value>1024</param-value>
    </init-param>
</filter>
```

### filter-mapping

The `filter-mapping` element specifies the resource or resources a filter is applied to.
A filter can be applied to either **a servlet** or **a URL pattern**.

- Mapping a filter to a servlet causes the filter to work on the servlet.
- Mapping a filter to a URL pattern makes filtering occur to any resource whose URL matches the URL pattern.

Filtering is performed in the same order
as the appearance of the `filter-mapping` elements in the deployment descriptor.

The `filter-mapping` element contains a `filter-name` element and a `url-pattern` element
or a `servlet-name` element.

The `filter-name` value must match one of the filter names declared using the `filter` elements.

The following are two `filter` elements and two `filter-mapping` elements:

```text
<filter>
    <filter-name>Logging Filter</filter-name>
    <filter-class>com.example.LoggingFilter</filter-class>
</filter>
<filter>
    <filter-name>Security Filter</filter-name>
    <filter-class>com.example.SecurityFilter</filter-class>
</filter>

<filter-mapping>
    <filter-name>Logging Filter</filter-name>
    <servlet-name>FirstServlet</servlet-name>
</filter-mapping>
<filter-mapping>
    <filter-name>Security Filter</filter-name>
    <url-pattern>/*</url-pattern>
</filter-mapping>
```

### listener

The `listener` element registers a listener.
It contains a `listener-class` element, which defines the fully qualified name of the listener class.
Here is an example.

```xml
<listener>
    <listener-class>com.example.AppListener</listener-class>
</listener>
```

### locale-encoding-mapping-list and locale-encoding-mapping

The `locale-encoding-mapping-list` element contains one or more `locale-encoding-mapping` elements.

A `locale-encoding-mapping` element maps a locale name with an encoding and
contains a `locale` element and an `encoding` element.

The value for `<locale>` must be either a language-code defined in ISO 639,
such as `en`, or a language-code_country-code, such as `en_US`.
When a language-code_country-code is used, the country-code part
must be one of the country codes defined in ISO 3166.

```xml
<locale-encoding-mapping-list>
    <locale-encoding-mapping>
        <locale>ja</locale>
        <encoding>Shift_JIS</encoding>
    </locale-encoding-mapping>
</locale-encoding-mapping-list>
```

### login-config

The `login-config` element is used to specify the authentication method used
to authenticate the user, the realm name, and the attributes needed
by the form login mechanism if form-based authentication is used.

A `login-config` element has an optional `auth-method` element,
an optional `realm-name` element, and an optional `form-login-config` element.

The `auth-method` element specifies the access authentication method.
Its value is one of the following: `BASIC`, `DIGEST`, `FORM`, or `CLIENT-CERT`.

The `realm-name` element specifies the realm name to use in
Basic access authentication and Digest access authentication.

The `form-login-config` element specifies the login and error pages
that should be used in form-based authentication.
If form-based authentication is not used, these elements are ignored.

The `form-login-config` element has a `form-login-page` element and a `form-error-page` element.
The `form-login-page` element specifies the path to a resource that displays a Login page.
The path must start with a `/` and is relative to the application directory.

The `form-error-page` element specifies the path to a resource
that displays an error page when login fails.
The path must begin with a `/` and is relative to the application directory. 

As an example, here is an example of the `login-config` element.

```xml
<login-config>
    <auth-method>DIGEST</auth-method>
    <realm-name>Members Only</realm-name>
</login-config>
```

And, here is another example.

```xml
<login-config>
    <auth-method>FORM</auth-method>
    <form-login-config>
        <form-login-page>/loginForm.jsp</form-login-page>
        <form-error-page>/errorPage.jsp</form-error-page>
    </form-login-config>
</login-config>
```

### mime-mapping

The `mime-mapping` element maps a MIME type to an extension.
It contains an `extension` element and a `mime-type` element.
The `extension` element describes the extension and
the `mime-type` element specifies the MIME type.
For example, here is a `mime-mapping` element.

```xml
<mime-mapping>
    <extension>txt</extension>
    <mime-type>text/plain</mime-type>
</mime-mapping>
```

### security-constraint

The `security-constraint` element allows you to restrict access to a
collection of resources declaratively.

The `security-constraint` element contains an optional `display-name` element,
one or more `web-resource-collection` elements, an optional `auth-constraint` element,
and an optional `user-data-constraint` element.

The `web-resource-collection` element identifies a collection of resources
to which access needs to be restricted.
In it, you can define the URL pattern(s) and the restricted HTTP method or methods.
If no HTTP method is present, the security constraint applies to **all HTTP methods**.

The `auth-constraint` element specifies the user roles
that should have access to the resource collection.
If no `auth-constraint` element is specified, 
the security constraint applies to **all roles**.

The `user-data-constraint` element is used to indicate how data transmitted
between the client and servlet/JSP container must be protected.

A `web-resource-collection` element contains a `web-resource-name` element,
an optional `description` element, zero or more `url-pattern` elements,
and zero or more `http-method` elements.

The `web-resource-name` element contains a name associated with the protected resource.

The `http-method` element can be assigned one of the HTTP methods, 
such as `GET`, `POST`, or `TRACE`.

The `auth-constraint` element contains an optional `description` element and zero or more `role-name` element.
The `role-name` element contains the name of a security role.

The `user-data-constraint` element contains an optional `description` element and a `transport-guarantee` element.
The `transport-guarantee` element must have one of the following values:
`NONE`, `INTEGRAL`, or `CONFIDENTIAL`.

- `NONE` indicates that the application does not require transport guarantees.
- `INTEGRAL` means that the data between the server and the client
  should be sent in such a way that it can't be changed in transit.
- `CONFIDENTIAL` means that the data transmitted must be encrypted.

In most cases, Secure Sockets Layer (SSL) is used for either `INTEGRAL` or `CONFIDENTIAL`.

The following example uses a `security-constraint` element to restrict
access to any resource with a URL matching the pattern `/members/*`.
Only a user in the `payingMember` role will be allowed access.
The `login-config` element requires the user to log in and the Digest access authentication method is used.

```text
<security-constraint>
    <web-resource-collection>
        <web-resource-name>Members Only</web-resource-name>
        <url-pattern>/members/*</url-pattern>
    </web-resource-collection>
    <auth-constraint>
        <role-name>payingMember</role-name>
    </auth-constraint>
</security-constraint>

<login-config>
    <auth-method>Digest</auth-method>
    <realm-name>Digest Access Authentication</realm-name>
</login-config>
```

### security-role

The `security-role` element specifies the declaration of a security role used in security constraints.
This element has an optional `description` element and a `role-name` element.
The following is an example `security-role` element.

```xml
<security-role>
    <role-name>payingMember</role-name>
</security-role>
```

### servlet

The `servlet` element is used to declare a servlet.
It can contain the following elements.

- an optional `icon` element
- an optional `description` element
- an optional `display-name` element
- a `servlet-name` element
- a `servlet-class` element or a `jsp-file` element
- zero or more `init-param` elements
- an optional `load-on-startup` element
- an optional `run-as` element
- an optional `enabled` element
- an optional `async-supported` element
- an optional `multipart-config` element
- zero or more `security-role-ref` elements

At a minimum a `servlet` element must contain a `servlet-name` element and a `servlet-class` element,
or a `servlet-name` element and a `jsp-file` element.

The `servlet-name` element defines the name for that servlet and must be unique throughout the application.

The `servlet-class` element specifies the fully qualified class name of the servlet.

The `jsp-file` element specifies the full path to a JSP page within the application.
The full path must begin with a `/`.

The `init-param` subelement can be used to pass an initial parameter name and value to the servlet.
The element descriptor of `init-param` is the same as `context-param`.

You use the `load-on-startup` element to load the servlet automatically into memory
when the servlet/JSP container starts up.
Loading a servlet means instantiating the servlet and calling its `init` method.
You use this element to avoid delay in the response for the first request to the servlet,
caused by the servlet loading to memory.
If this element is present and a `jsp-file` element is specified,
the JSP file is precompiled into a servlet and
the resulting servlet is loaded.

`load-on-startup` is either empty or has an integer value.
The value indicates the order of loading this servlet
when there are multiple servlets in the same application.
For example, if there are two servlet elements and 
both contain a `load-on-startup` element,
the servlet with the lower `load-on-startup` value is loaded first.
If the value of the `load-on-startup` is **empty** or is **a negative number**,
**it is up to the web container to decide when to load the servlet.**
If two servlets have the same `load-on-startup` value,
the loading order between the two servlets cannot be determined.

Defining `run-as` overrides the security identity for calling an Enterprise JavaBean
by that servlet in this application.
The role name is one of the security roles defined for the current web application.

The `security-role-ref` element maps **the name of the role** called from a servlet using `isUserInRole(name)`
to **the name of a security role** defined for the application.
The `security-role-ref element` contains an optional `description` element,
a `role-name` element, and a `role-link` element.

The `role-link` element is used to link a security role reference to a defined security role.
The `role-link` element must contain the name of one
of the security roles defined in the `security-role` elements.

The `async-supported` element is an optional element that can have a `true` or `false` value.
It indicates whether or not this servlet supports asynchronous processing.

The `enabled` element is also an optional element whose value can be `true` or `false`.
Setting this element to `false` disables this servlet.

For example, to map the security role reference “PM” to the security
role with role-name “payingMember,” the syntax would be as follows.

```xml
<security-role-ref>
    <role-name>PM</role-name>
    <role-link>payingMember</role-link>
</security-role-ref>
```

In this case, if the servlet invoked by a user belonging to the “payingMember” security role
calls `isUserInRole("payingMember")`, the result would be `true`.

The following are two example `servlet` elements:

```text
<servlet>
    <servlet-name>UploadServlet</servlet-name>
    <servlet-class>com.brainysoftware.UploadServlet</servlet-class>
    <load-on-startup>10</load-on-startup>
</servlet>
<servlet>
    <servlet-name>SecureServlet</servlet-name>
    <servlet-class>com.brainysoftware.SecureServlet</servlet-class>
    <load-on-startup>20</load-on-startup>
</servlet>
```

### servlet-mapping

The `servlet-mapping` element maps a servlet to a URL pattern.
The `servlet-mapping` element must have a `servlet-name` element and a `url-pattern` element.

The following `servlet-mapping` element maps a servlet with the URL pattern `/first`.

```text
<servlet>
    <servlet-name>FirstServlet</servlet-name>
    <servlet-class>com.brainysoftware.FirstServlet</servlet-class>
</servlet>  
<servlet-mapping>
    <servlet-name>FirstServlet</servlet-name>
    <url-pattern>/first</url-pattern>
</servlet-mapping>
```

### session-config

The `session-config` element defines parameters for `javax.servlet.http.HttpSession` instances.
This element may contain one or more of the following elements:
`session-timeout`, `cookie-config`, or `tracking-mode`.

The `session-timeout` element specifies the default session timeout interval in minutes.
This value must be an integer.
If the value of the `session-timeout` element is **zero** or **a negative number**,
**the session will never time out.**

The `cookie-config` element defines the configuration of the session
tracking cookies created by this servlet/JSP application.

The `tracking-mode` element defines the tracking mode for sessions created by this web application.
Valid values are `COOKIE`, `URL`, or `SSL`.

The following `session-config` element causes the `HttpSession` objects in
the current application to be invalidated after twelve minutes of inactivity.

```xml
<session-config>
    <session-timeout>12</session-timeout>
</session-config>
```

### welcome-file-list

The `welcome-file-list` element specifies the file or servlet that is displayed
when the URL entered by the user in the browser does not contain a servlet
name or a JSP page or a static resource.

The `welcome-file-list` element contains one or more `welcome-file` elements.
The `welcome-file` element contains the default file name.
If the file specified in the first `welcome-file` element is not found,
the web container will try to display the second one, and so on.

Here is an example `welcome-file-list` element.

```xml
<welcome-file-list>
    <welcome-file>index.htm</welcome-file>
    <welcome-file>index.html</welcome-file>
    <welcome-file>index.jsp</welcome-file>
</welcome-file-list>
```

The following example uses a `welcome-file-list` element that contains two `welcome-file` elements.
The first `welcome-file` element specifies a file in the application directory called `index.html`;
the second defines the `welcome` servlet under the `servlet` directory, which is under the application directory:

```xml
<welcome-file-list>
    <welcome-file>index.html</welcome-file>
    <welcome-file>servlet/welcome</welcome-file>
</welcome-file-list>
```

## JSP-Specific Elements

The `jsp-config` element under `<web-app>` contains elements specific to JSP.
It can have zero or more `taglib` elements and zero or more `jsp-property-group` elements.
The `taglib` element is explained in the first subsection of this section and
the `jsp-property-group` element in the second subsection.

### taglib

The `taglib` element describes a JSP custom tag library.
The `taglib` element contains a `taglib-uri` element and a `taglib-location` element.

The `taglib-uri` element specifies the URI of the tag library used in the servlet/JSP application.
The value for `<taglib-uri>` is relative to the location of the deployment descriptor.

The `taglib-location` element specifies the location of the TLD file for the tag library.

The following is an example `taglib` element.

```xml

<jsp-config>
    <taglib>
        <taglib-uri>
            http://brainysoftware.com/taglib/complex
        </taglib-uri>
        <taglib-location>/WEB-INF/jsp/complex.tld
        </taglib-location>
    </taglib>
</jsp-config>
```

### jsp-property-group

The `jsp-property-group` element groups a number of JSP files, so they can be given global property information.
You can use subelements under `<jsp-property-group>` to do the following.

- Indicate whether EL is ignored
- Indicate whether scripting elements are allowed
- Indicate page encoding information
- Indicate that a resource is a JSP document (written in XML)
- Prelude and code automatic includes

The jsp-property-group element has the following subelements.

- an optional `description` element
- an optional `display-name` element
- an optional `icon` element
- one or more `url-pattern` elements
- an optional `el-ignored` element
- an optional `page-encoding` element
- an optional `scripting-invalid` element
- an optional `is-xml` element
- zero or more `include-prelude` elements
- zero or more `include-code` elements

The `url-pattern` element is used to specify a URL pattern that will be
affected by the property settings.

The `el-ignored` element can have a boolean value of `true` or `false`.
A value of `true` means that the EL expressions will not evaluated in the JSP pages
whose URL match the specified URL pattern(s).
The default value of this element is `false`.

The `page-encoding` element specifies the encoding for the JSP pages
whose URL match the specified URL pattern(s).
The valid value for `page-encoding` is the same as
the value of the `pageEncoding` attribute of the `page` directive used in a matching JSP page.
There will be a translation-time error to name a different encoding
in the `pageEncoding` attribute of the `page` directive of a JSP page and
in a JSP configuration element matching the page.
It is also a translation-time error to name a different encoding in the prolog or
text declaration of a document in XML syntax and in a JSP configuration element matching the document.
It is legal to name the same encoding through multiple mechanisms.

The `scripting-invalid` element accepts a boolean value.
A value of `true` means that scripting is not allowed in the JSP pages
whose URLs match the specified pattern(s).
By default, the value of the `scripting-invalid` element is `false`.

The `is-xml` element accepts a boolean value and `true` indicates that the
JSP pages whose URLs match the specified pattern(s) are JSP documents.

The `include-prelude` element is a context-relative path that must
correspond to an element in the servlet/JSP application. When the element
is present, the given path will be automatically included (as in an include
directive) at the beginning of each JSP page whose URL matches the
specified pattern(s).

The `include-coda` element is a context-relative path that must
correspond to an element in the application. When the element is present,
the given path will be automatically included (as in the `include` directive) at
the end of each JSP page in this `jsp-property-group` element.

For example, here is a `jsp-property-group` element that causes EL
evaluation in all JSP pages to be ignored.

```xml
<jsp-config>
    <jsp-property-group>
        <url-pattern>*.jsp</url-pattern>
        <el-ignored>true</el-ignored>
    </jsp-property-group>
</jsp-config>
```

And, here is a `jsp-property-group` element that is used to enforce `script-free` JSP pages throughout the application.

```xml
<jsp-config>
    <jsp-property-group>
        <url-pattern>*.jsp</url-pattern>
        <scripting-invalid>true</scripting-invalid>
    </jsp-property-group>
</jsp-config>
```



