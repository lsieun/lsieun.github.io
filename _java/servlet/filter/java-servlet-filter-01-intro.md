---
title: "Filter Intro"
sequence: "101"
---

A filter is an object that intercepts a request and processes the
`ServletRequest` or the `ServletResponse` passed to the resource being requested.
Filters can be used for logging, encryption and decryption,
session checking, image transformation, and so on.
Filters can be configured to intercept a resource or multiple resources.

Filter configuration can be done through **annotations** or the **deployment descriptor**.
If multiple filters are applied to the same resource or the same set of resources,
**the invocation order** is sometimes important and in this case you need the **deployment descriptor**.

There is only one instance for each type of filter.
Therefore, thread safety may be an issue if you need to keep and change state in your filter class.
The last filter example shows how to deal with this issue.

## The Filter API

The following section explains the interfaces that are used in a filter,
including `Filter`, `FilterConfig`, and `FilterChain`.

A filter class must implement the `javax.servlet.Filter` interface.
This interface exposes three lifecycle methods for a filter: `init`, `doFilter`, and `destroy`.

```java
package javax.servlet;

import java.io.IOException;

/**
 *
 * <p>Examples that have been identified for this design are:
 * <ol>
 * <li>Authentication Filters
 * <li>Logging and Auditing Filters
 * <li>Image conversion Filters
 * <li>Data compression Filters
 * <li>Encryption Filters
 * <li>Tokenizing Filters
 * <li>Filters that trigger resource access events
 * <li>XSL/T filters
 * <li>Mime-type chain Filter
 * </ol>
 *
 * @since Servlet 2.3
 */

public interface Filter {
    default void init(FilterConfig filterConfig) throws ServletException {}
	
	
    void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException;

    default void destroy() {}
}
```

The `init` method is called by the servlet container when the filter is being put into service,
i.e. when the application is started.
In other words, the `init` method does not wait until a resource associated with the filter is invoked.
**This method is only called once** and should contain initialization code for the filter.

Note that the servlet container passes a `FilterConfig` to the `init` method.

The `doFilter` method of a `Filter` instance is called by the servlet container
every time a resource associated with the filter is invoked.
This method receives a `ServletRequest`, a `ServletResponse`, and a `FilterChain`.

As you can see here, an implementation of `doFilter` has access to the `ServletRequest` and the `ServletResponse`.
As such, it is possible to add an attribute to the `ServletRequest` or a header to the `ServletResponse`.
You can even decorate the `ServletRequest` or the `ServletResponse` to change their behavior.

The last line of code in a `doFilter` method implementation should be
a call to the `doChain` method on the `FilterChain` passed as the third argument to `doFilter`:

```text
chain.doFilter(request, response)
```

A resource may be associated with multiple filters (or in a more technical term, a chain of filters),
and `FilterChain.doFilter()` basically causes the next filter in the chain to be invoked.
Calling `FilterChain.doFilter()` on the last filter in the chain causes the resource itself to be invoked.

If you do not call `FilterChain.doFilter()` at the end of your `Filter.doFilter()` implementation,
processing will stop there and the request will not be invoked.

```java
package javax.servlet;

import java.io.IOException;

public interface FilterChain {
    void doFilter(ServletRequest request, ServletResponse response) throws IOException, ServletException;
}
```

Note that the `doFilter` method is the only method in the `FilterChain` interface.
This method is slightly different from the `doFilter` method in `Filter`.
In `FilterChain`, `doFilter` only take two arguments instead of three.

The last lifecycle method in `Filter` is `destroy`.
This method is called by the servlet container before the filter is taken out of service,
which normally happens when the application is stopped.

## Filter Configuration

After you finish writing a filter class, you still have to configure the filter.
Filter configuration has these objectives:

- Determine what resources the filter will intercept.
- Setup initial values to be passed to the filter's init method.
- Give the filter a name.
  Giving a filter a name in most cases does not have much significance but can sometimes be helpful.
  For example, you might want to log the time a filter starts,
  and if you have multiple filters in the same application,
  it is often useful to see the order in which the filters are invoked.

The `FilterConfig` interface allows you to access the `ServletContext`
through its `getServletContext` method.

```java
package javax.servlet;

import java.util.Enumeration;


public interface FilterConfig {

    String getFilterName();

    ServletContext getServletContext();
    
    String getInitParameter(String name);

    Enumeration<String> getInitParameterNames();

}
```

If a filter has a name, the `getFilterName` method in `FilterConfig` returns the name.

However, you are most often interested in getting **initial parameters**,
which are initialization values that the developer or deployer passes to the filter.
There are two methods you can use to handle initial parameters,
the first of which is `getParameterNames`.
This method returns an `Enumeration` of filter parameter names.
If no parameter exists for the filter, this method returns an empty `Enumeration`.
The second method for handling initial parameters is `getParameter`.

There are **two ways to configure a filter**.
You can configure a filter using the `WebFilter` annotation type or by registering it in the **deployment descriptor**.
Using `@WebFilter` is easy as you just need to annotate the filter class and
you do not need the deployment descriptor.
However, changing the configuration settings requires that the filter class be recompiled.
On the other hand, configuring a filter in the deployment descriptor means
changing configuration values is a matter of editing a text file.

To use `@WebFilter`, you need to be familiar with its attributes.

| Attribute       | Description                                                                  |
|-----------------|------------------------------------------------------------------------------|
| asyncSupported  | Specifies whether or not the filter supports the asynchronous operation mode |
| description     | The description of the filter                                                |
| dispatcherTypes | The dispatcher types to which the filter applies                             |
| displayName     | The display name of the filter                                               |
| filterName      | The name of the filter                                                       |
| initParams      | The initial parameters                                                       |
| largeIcon       | The name of the large icon for the filter                                    |
| servletNames    | The names of the servlets to which the filter applies                        |
| smallIcon       | The name of the small icon for the filter                                    |
| urlPatterns     | The URL patterns to which the filter applies                                 |
| value           | The URL patterns to which the filter applies                                 |

For instance, the following `@WebFilter` annotation specifies that the filter
name is `DataCompressionFilter` and it applies to all resources.

```text
@WebFilter(filterName="DataCompressionFilter", urlPatterns={"/*"}) 
```

This is equivalent to declaring these `<filter>` and `<filter-mapping>` elements in
the deployment descriptor.

```text
<filter>
    <filter-name>DataCompressionFilter</filter-name>
    <filter-class>
        the fully-qualified name of the filter class
    </filter-class>
</filter>
<filter-mapping>
    <filter-name>DataCompresionFilter</filter-name>
    <url-pattern>/*</url-pattern>
</filter-mapping>
```

As another example, the following filter is passed two initial parameters:

```text
@WebFilter(filterName = "Security Filter", urlPatterns = { "/*" },
        initParams = {
            @WebInitParam(name = "frequency", value = "1909"),
            @WebInitParam(name = "resolution", value = "1024") 
        }
)
```

Using the `<filter>` and `<filter-mapping>` elements in the deployment descriptor,
the configuration settings would be as follows.

```text
<filter>
    <filter-name>Security Filter</filter-name>
    <filter-class>filterClass</filter-class>
    <init-param>
        <param-name>frequency</param-name>
        <param-value>1909</param-value>
     </init-param>
    <init-param>
        <param-name>resolution</param-name>
        <param-value>1024</param-value>
    </init-param>
</filter>
<filter-mapping>
    <filter-name>DataCompresionFilter</filter-name>
    <url-pattern>/*</url-pattern>
</filter-mapping>
```
