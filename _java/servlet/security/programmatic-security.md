---
title: "Programmatic Security"
sequence: "104"
---

Even though declarative security is easy and straightforward,
there are rare cases where you want to write code to secure your application.
For this purpose, you can use the security annotation types and
methods in the `HttpServletRequest` interface.

## Security Annotation Types

In the previous section you learned how to restrict access to a collection of
resources using the `security-constraint` element in the deployment descriptor.
One aspect of this element is that you use a URL pattern that
matches the URLs of the resources to be restricted.

Servlet 3 comes with annotation types that can perform the same job on a servlet level.
Using these annotation types, you can restrict access to a servlet
without adding a `security-constraint` element in the deployment descriptor.
However, you still need a `login-config` element in the deployment descriptor
to choose an authentication method.

There are three annotation types in the `javax.servlet.annotation` package that are security related.
They are `ServletSecurity`, `HttpConstraint`, and `HttpMethodConstraint`.

The `ServletSecurity` annotation type is used in a servlet class to impose security constraints on the servlet.
A `ServletSecurity` annotation may have the `value` and `httpMethodConstraints` attributes.

```java
@Inherited
@Documented
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface ServletSecurity {
    enum EmptyRoleSemantic {
        /**
         * access is to be permitted independent of authentication state and identity.
         */
        PERMIT,
        /**
         * access is to be denied independent of authentication state and identity.
         */
        DENY
    }

    enum TransportGuarantee {
        /**
         * no protection of user data must be performed by the transport.
         */
        NONE,
        /**
         * All user data must be encrypted by the transport (typically using SSL/TLS).
         */
        CONFIDENTIAL
    }
    
    HttpConstraint value() default @HttpConstraint;

    HttpMethodConstraint[] httpMethodConstraints() default {};
}
```

### HttpConstraint

```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
public @interface HttpConstraint {
    EmptyRoleSemantic value() default EmptyRoleSemantic.PERMIT;

    TransportGuarantee transportGuarantee() default TransportGuarantee.NONE;

    String[] rolesAllowed() default {};
}
```



The `HttpConstraint` annotation type defines a security constraint and
can only be assigned to the `value` attribute of the `ServletSecurity` annotation.
If the `httpMethodConstraints` attribute is not present in the enclosing `ServletSecurity` annotation,
the security constraint imposed by the `HttpConstraint` annotation applies to all HTTP methods.
Otherwise, the security constraint applies to the HTTP methods defined in the `httpMethodConstraints` attribute.
For example, the following `HttpConstraint` annotation dictates
that the annotated servlet can only be accessed by those in the `manager` role.

```text
@ServletSecurity(value = @HttpConstraint(rolesAllowed = "manager"))
```

Of course, the annotations above can be rewritten as follows.

```text
@ServletSecurity(@HttpConstraint(rolesAllowed = "manager"))
```

You still have to declare a `login-config` element in the deployment descriptor
so that the container can authenticate the user.

Setting `TransportGuarantee.CONFIDENTIAL` to the
`transportGuarantee` attribute of an `HttpConstraint` annotation will make
the servlet only available through a confidential channel, such as **SSL**.

```text
@ServletSecurity(@HttpConstraint(transportGuarantee =
TransportGuarantee.CONFIDENTIAL))
```

If the servlet/JSP container receives a request for such a servlet through HTTP,
it will redirect the browser to the HTTPS version of the same URL.

### HttpMethodConstraint

```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
public @interface HttpMethodConstraint {
    String value();

    EmptyRoleSemantic emptyRoleSemantic() default EmptyRoleSemantic.PERMIT;

    TransportGuarantee transportGuarantee() default TransportGuarantee.NONE;

    String[] rolesAllowed() default {};
}
```

The `HttpMethodConstraint` annotation type specifies an HTTP method to which a security constraint applies.
It can only appear in the array assigned to the `httpMethodConstraints` attribute of a `ServletSecurity` annotation.
For example, the following `HttpMethodConstraint` annotation
restricts access to the annotated servlet via HTTP Get to the manager role.
For other HTTP methods, no restriction exists.

```text
@ServletSecurity(httpMethodConstraints = {
    @HttpMethodConstraint(value = "GET", rolesAllowed = "manager")
})
```

Note that if the `rolesAllowed` attribute is not present in an `HttpMethodConstraint` annotation,
no restriction applies to the specified HTTP method.
For example, the following `ServletSecurity` annotation
employs both the `value` and `httpMethodConstraints` attributes.
The `HttpConstraint` annotation defines roles that can access the annotated servlet and
the `HttpMethodConstraint` annotation, which is written without the `rolesAllowed` attribute,
overrides the constraint for the Get method.
As such, the servlet can be accessed via Get by any user.
On the other hand, access via all other HTTP methods can only be granted to users in the manager role.

```text
@ServletSecurity(value = @HttpConstraint(rolesAllowed = "manager"),
    httpMethodConstraints = {@HttpMethodConstraint("GET")}
)
```

However, if the `emptyRoleSemantic` attribute of the `HttpMethodConstraint` annotation type
is assigned `EmptyRoleSemantic.DENY`, then the method is restricted for all users.
For example, the servlet annotated with the following `ServletSecurity` annotation prevents access via the Get method
but allows access to all users in the `member` role via other HTTP methods.

```text
@ServletSecurity(value = @HttpConstraint(rolesAllowed = "member"),
httpMethodConstraints = {@HttpMethodConstraint(value = "GET", 
    emptyRoleSemantic = EmptyRoleSemantic.DENY)}
)
```

## Servlet Security API

Besides the annotation types discussed in the previous section, 
programmatic security can also be achieved using the following methods in 
the `HttpServletRequest` interface.

- `String getAuthType()`: Returns the authentication scheme used to protect the servlet or
  `null` if no security constraint is being applied to the servlet.
- `String getRemoteUser()`: Returns the login of the user making this request or
  `null` if the user has not been authenticated.
- `boolean isUserInRole(String role)`: Returns a boolean indicating whether the user belongs to the specified role.
- `Principal getUserPrincipal()`: Returns a `java.security.Principal`
  containing the details of the current authenticated user or `null` if the user has not been authenticated.
- `boolean authenticate(HttpServletResponse response) throws IOException`:
  Authenticates the user by instructing the browser to display a login form.
- `void login(String userName, String password) throws ServletException`:
  Attempts to log the user in using the supplied username and password.
  The method does not return anything if login was successful.
  Otherwise, it will throw a `ServletException`.
- `void logout() throws ServletException`: Logs the user out.

```java
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(urlPatterns = {"/prog"})
public class ProgrammaticServlet extends HttpServlet {
    private static final long serialVersionUID = 87620L;

    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        if (request.authenticate(response)) {
            response.setContentType("text/html");
            PrintWriter out = response.getWriter();
            out.println("Welcome");
        } else {
            // user not authenticated
            // do something
            System.out.println("User not authenticated");
        }
    }
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd"
         version="3.1">
    <login-config>
        <auth-method>DIGEST</auth-method>
        <realm-name>Digest authentication</realm-name>
    </login-config>
</web-app>
```

When the user first requests the servlet, the user is not authenticated and the `authenticate` method returns `false`.
As a result, the servlet/JSP container will send a **WWW-Authenticate** header,
causing the browser to show a Login dialog for Digest access authentication.
When the user submits the form with the correct username and password,
the `authenticate` method returns `true` and the Welcome message is shown.

