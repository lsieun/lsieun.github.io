---
title: "Security Intro"
sequence: "101"
---

Security is a very important aspect in web application development and deployment.
This is especially true because web applications are accessible
to anyone with a browser and access to the world wide web.
Securing an application can be done declaratively or programmatically.
The following four issues are the cornerstones of web security:
**authentication**, **authorization**, **confidentiality**, and **data integrity**.

**Authentication** is to do with verifying the identity of a web entity,
especially a user trying to access an application.
You normally authenticate a user by asking the user for a username and password.

**Authorization** is normally done after authentication is successful and
is concerned with the access level an authenticated user has.
It attempts to answer the question
"Should an authenticated user be allowed to enter a certain area of the application?"

**Confidentiality** is an important topic because sensitive data,
such as a credit card details or social security numbers, should be protected.
And, as you may know, data is relayed from one computer to another
before reaching its destination on the Internet.
Intercepting it is not technically difficult.
**As such, sensitive data should be encrypted when being transferred over the Internet.**

Since data packets can be easily intercepted,
tampering with them is almost as easy to those equipped with the right tools and knowledge.
Fortunately, it is also possible to maintain **data integrity**
by making sure sensitive data travel through a secure channel.

## Authentication and Authorization

**Authentication** is the process of examining that someone is really who he/she claims to be.
In a servlet/JSP application, authentication is normally done by asking the user for a username and password.

**Authorization** is concerned with determining what level of access a user has.
It applies to applications that consists of multiple zones
where a user may have access to one section of an application but not to the others.
For example, an online store may be divided into the general sections
(for the general public to browse and search for products),
the buyers section (for registered users to place orders),
and the admin section (for administrators).
Of the three, the admin section requires the highest level of access.
Not only would admin users be required to authenticate themselves,
they would also need to have been assigned access to the admin section.

**Access levels** are often called **roles**.
At deployment a servlet/JSP
application can be conveniently split into sections and configured
so that each section can be accessed by users in a particular role.
This is done by declaring security constraints in the deployment descriptor.
In other words, **declarative security**.
At the other end of spectrum, content restriction is also commonly achieved programmatically
by trying to match pairs of usernames and passwords with values stored in a database.

In the majority of servlet/JSP applications
**authentication** and **authorization** are done programmatically
by first authenticating the username and password against a database table.
Once **authentication** is successful,
**authorization** can be done by checking another table or a field in
the same table that stores usernames and passwords.
Using **declarative security** saves you some programming
because the servlet/JSP container
takes care of the authentication and authorization processes.
In addition, the servlet/JSP container can be configured to authenticate against a database
you're already using in the application.
On top of that, with **declarative authentication**
the username and password can be encrypted by the browser
prior to sending them to the server.
The drawback of declarative security is
that the authentication method that supports data encryption can only be
used with a default login dialog whose look and feel cannot be customized.
This reason alone is enough to make people walk away from declarative security.
The only method of declarative security that allows a custom
HTML form to be used unfortunately does not encrypt the data transmitted.

Some parts of a web application, such as the **Admin module**, are not customer facing,
so the look of the login form is of little relevance.
**In this case, declarative security can still be used.**

The interesting part of declarative security is of course the fact
that security constraints are not programmed into servlets.
Instead, they are declared in the deployment descriptor at the time the application is deployed.
As such, it allows considerable flexibility in determining the
users and roles that will have access to the application or sections of it.

To use **declarative security**, you start by **defining users and roles**.
Depending on the container you're using,
you can store user and role information in a file or database tables.
Then, you **impose constraints on a resource or a collection or resources** in your application.

### Specifying Users and Roles

Every compliant servlet/JSP container must provide a way of defining users and roles.
If you're using Tomcat you can create users and roles
by editing the `tomcat-users.xml` file in the `conf` directory.

```xml
<?xml version='1.0' encoding='utf-8'?>
<tomcat-users>
    <role rolename="manager"/>
    <role rolename="member"/>
    <user username="tom" password="secret" roles="manager,member"/>
    <user username="jerry" password="secret" roles="member"/>
</tomcat-users>
```

The `tomcat-users.xml` file is an XML document having the `tomcat-users` root element.
Within it are `role` and `user` elements.
The `role` element defines a role and the `user` element defines a user.
The `role` element has a `rolename` attribute that specifies the name of the role.
The `user` element has `username`, `password`, and `roles` attributes.
The `username` attribute specifies the user name,
the `password` attribute the password,
and the `roles` attribute the role or roles the user belongs to.

Tomcat also supports matching roles and users against database tables.
You can configure Tomcat to use JDBC to authenticate users.

## Imposing Security Constraints

You have learned that you can hide static resources and JSP pages
by storing them under `WEB-INF` or a directory under it.
A resource placed here cannot be accessed directly by typing its URL,
but can still be a forward target from a servlet or JSP page.
While this approach is simple and straightforward,
the drawback is resources hidden here are hidden forever.
There's no way they can be accessed directly.
If you simply want to protect resources from unauthorized users,
you can put them in a directory under the application directory and
declare a security constraint in the deployment descriptor.

The `security-constraint` element specifies **a resource collection** and **the role or roles**
that can access the resources.
This element can have two subelements, `web-resource-collection` and `auth-constraint`.

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
</web-app>
```

The `web-resource-collection` element specifies a collection of resources
and can have any of these subelements:
`web-resource-name`, `description`, `url-pattern`, `http-method`, and `http-method-ommission`.

The `web-resource-collection` element can have multiple `url-pattern` subelements,
each of which refers to a URL pattern to which the containing security constraint applies.
You can use an **asterisk** in the `url-pattern` element to refer to
either **a specific resource type** (such as `*.jsp`) or
**all resources in a directory** (such as `/*` or `/jsp/*`).
However, **you cannot combine both**, i.e. refer to a specific type in a specific directory.
Therefore, the following URL pattern meant to refer to all JSP pages in the jsp
directory is invalid: `/jsp/*.jsp`.
Instead, use `/jsp/*`, but this will also restrict any non-JSP pages in the jsp directory.

The `http-method` element names an HTTP method to which the enclosing security constraint applies.
For example, a `web-resource-collection` element with a GET `http-method` element indicates
that the `web-resource-collection` element applies only to the HTTP Get method.
The security constraint that contains the resource collection
does not protect against other HTTP methods such as `Post` and `Put`.
The absence of the `http-method` element indicates
the security constraint restricts access against all HTTP methods.
You can have multiple `http-method` elements in the same `web-resource-collection` element.

The `http-method-omission` element specifies an HTTP method
that is not included in the encompassing security constraint.
Therefore, specifying `<http-method-omission>GET</http-method-omission>` restricts access
to all HTTP methods except `Get`.

The `http-method` element and the `http-method-omission` element 
**cannot** appear in the same `web-resource-collection` element.

You can have multiple `security-constraint` elements in the deployment descriptor.
If the `auth-constraint` element is missing from a `security-constraint` element,
the resource collection is not protected.
In addition, if you specify a role that is not defined by the container,
no one will be able to access the resource collection directly.
However, you can still forward to a resource in the collection from a servlet or JSP page.

As an example, the `security-constraint` elements in the `web.xml` file restricts access to all JSP pages.
As the `auth-constraint` element does not contain a `role-name` element,
the resources are not accessible by their URLs.

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
</web-app>
```





