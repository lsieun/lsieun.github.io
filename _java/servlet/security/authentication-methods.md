---
title: "Authentication Methods"
sequence: "102"
---

Now that you know how to impose security constraints on a resource collection,
you should also learn how to authenticate users to access the resources.
For resources that are secured declaratively,
by using the `security-constraint` element in the deployment descriptor,
authentication can be done by using the solutions that HTTP 1.1 offers:
**basic access authentication** and **digest access authentication**.
In addition, **form-based access authentication** can also be used.

HTTP authentication is defined in RFC 2617. You can download the specification here:

```text
https://www.ietf.org/rfc/rfc2617.txt
```

## Basic Access Authentication

Basic access authentication, or simply Basic authentication,
is an HTTP authentication for accepting a username and password.
In Basic access authentication a user who accesses a protected resource will be rejected by the server,
which will return a 401 (Unauthorized) response.
The response includes a **WWW-Authenticate** header
containing at least one challenge applicable to the requested resource.
Here is an example of such response:

```text
HTTP/1.1 401 Authorization Required
Server: Apache-Coyote/1.1
Date: Wed, 21 Dec 2011 11:32:09 GMT
WWW-Authenticate: Basic realm="Members Only"
```

The browser would then display a Login dialog for the user to enter a username and a password.
When the user clicks the Login button, the username will be appended with a colon and concatenated with the password.
The string will then be encoded with the Base64 algorithm before being sent to the server.
Upon a successful login, the server will send the requested resource.

Base64 is a very weak algorithm and as such it is very easy to decrypt Base64 messages.
Consider using **Digest access authentication** instead.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd"
         version="3.1">
    <!-- restricts access to JSP pages -->
    <security-constraint>
        <web-resource-collection>
            <web-resource-name>JSP pages</web-resource-name>
            <url-pattern>*.jsp</url-pattern>
        </web-resource-collection>
        <!-- must have auth-constraint, otherwise the
            specified web resources will not be restricted -->
        <auth-constraint/>
    </security-constraint>

    <security-constraint>
        <web-resource-collection>
            <web-resource-name>Servlet1</web-resource-name>
            <url-pattern>/servlet1</url-pattern>
        </web-resource-collection>
        <auth-constraint>
            <role-name>member</role-name>
            <role-name>manager</role-name>
        </auth-constraint>
    </security-constraint>
    <login-config>
        <auth-method>BASIC</auth-method>
        <realm-name>Members Only</realm-name>
    </login-config>
</web-app>
```

The most important element in the deployment descriptor is the `login-config` element.
It has two subelements, `auth-method` and `realm-name`.
To use the Basic access authentication, you must give it the value `BASIC` (all capitals).
The `realm-name` element should be given a name to be displayed in the browser Login dialog.

## Digest Access Authentication

**Digest access authentication**, or Digest authentication for short,
is also an HTTP authentication and is similar to Basic access authentication.
Instead of using the weak Base64 encryption algorithm,
Digest access authentication uses the MD5 algorithm to create a hash of the combination of
the **username**, **realm name**, and the **password** and sends the hash to the server.
Digest access authentication is meant to replace Basic access authentication
as it offer a more secure environment.

Servlet/JSP containers are not obligated to support Digest access authentication but most do.

Configuring an application to use Digest access authentication is similar to using Basic access authentication.
In fact, the only difference is the value of the `auth-method` element within the `login-config` element.
For Digest access authentication, its value must be `DIGEST` (all uppercase).

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd"
         version="3.1">
    <servlet>
        <servlet-name>MyServlet</servlet-name>
        <servlet-class>lsieun.servlet.MyServlet</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>MyServlet</servlet-name>
        <url-pattern>/myservlet</url-pattern>
    </servlet-mapping>

    <security-constraint>
        <web-resource-collection>
            <web-resource-name>HelloWorld</web-resource-name>
            <url-pattern>/hello-world</url-pattern>
        </web-resource-collection>
        <auth-constraint>
            <role-name>member</role-name>
            <role-name>manager</role-name>
        </auth-constraint>
    </security-constraint>
    <login-config>
        <auth-method>DIGEST</auth-method>
        <realm-name>Digest authentication</realm-name>
    </login-config>
</web-app>
```

## Form-based Authentication

Basic and Digest access authentications do not allow you to use a customized login form.
If you must have a custom form, then you can use **form-based authentication**.
As the values transmitted are not encrypted, you should use this in conjunction with SSL.

With form-based authentication, you need to create a Login page and an Error page, which can be HTML or JSP pages.
The first time a protected resource is requested, the servlet/JSP container will send the Login page.
Upon a successful login, the requested resource will be sent.
If login failed, however, the user will see the Error page.

To use form-based authentication, the `auth-method` element in your deployment descriptor
must be given the value `FORM` (all upper case).
In addition, the `login-config` element must have a `form-login-config` element with two subelements,
`form-login-page` and `form-error-page`.
Here is an example of the `login-config` element for form-based authentication.

```xml
<login-config>
    <auth-method>FORM</auth-method>
    <form-login-config>
        <form-login-page>/login.html</form-login-page>
        <form-error-page>/error.html</form-error-page>
    </form-login-config>
</login-config>
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd"
         version="3.1">
    <servlet>
        <servlet-name>MyServlet</servlet-name>
        <servlet-class>lsieun.servlet.MyServlet</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>MyServlet</servlet-name>
        <url-pattern>/myservlet</url-pattern>
    </servlet-mapping>

    <security-constraint>
        <web-resource-collection>
            <web-resource-name>HelloWorld</web-resource-name>
            <url-pattern>/hello-world</url-pattern>
        </web-resource-collection>
        <auth-constraint>
            <role-name>member</role-name>
            <role-name>manager</role-name>
        </auth-constraint>
    </security-constraint>
    <login-config>
        <auth-method>FORM</auth-method>
        <form-login-config>
            <form-login-page>/login.html</form-login-page>
            <form-error-page>/error.html</form-error-page>
        </form-login-config>
    </login-config>
</web-app>
```

## Client Certificate Authentication

Also called the client-cert authentication,
the client certificate authentication works over HTTPS (HTTP over SSL) and
requires that **every client have a client certificate**.
This is a very strong authentication mechanism but is not suitable for applications deployed over the Internet
as it is impractical to demand that every user own a digital certificate.
However, this authentication method can be used to access intranet applications within an organization.
