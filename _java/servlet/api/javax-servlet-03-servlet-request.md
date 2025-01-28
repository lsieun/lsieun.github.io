---
title: "javax.servlet.ServletRequest"
sequence: "103"
---

For every HTTP request, the servlet container creates an instance of `ServletRequest`
and passes it to the servlet's `service` method.
The `ServletRequest` encapsulates information about the request.

```java
public interface ServletRequest {
    String getProtocol();
    String getScheme();
    String getServerName();
    int getServerPort();
    boolean isSecure();
    
    // remote
    String getRemoteAddr();
    String getRemoteHost();
    int getRemotePort();
    
    // local
    String getLocalName();
    String getLocalAddr();
    int getLocalPort();
    
    // async
    AsyncContext startAsync();
    AsyncContext startAsync(ServletRequest servletRequest, ServletResponse servletResponse);
    boolean isAsyncStarted();
    boolean isAsyncSupported();
    AsyncContext getAsyncContext();
    
    // context
    ServletContext getServletContext();
    
    String getParameter(String name);
    Enumeration<String> getParameterNames();
    String[] getParameterValues(String name);
    Map<String, String[]> getParameterMap();
    
    String getCharacterEncoding();
    void setCharacterEncoding(String env);
    int getContentLength();
    long getContentLengthLong();
    String getContentType();
    ServletInputStream getInputStream();
    BufferedReader getReader();

    
    Object getAttribute(String name);
    void setAttribute(String name, Object o);
    void removeAttribute(String name);
    Enumeration<String> getAttributeNames();

    // dispatch
    RequestDispatcher getRequestDispatcher(String path);
    DispatcherType getDispatcherType();

    // server
    String getRealPath(String path);

    Locale getLocale();
    Enumeration<Locale> getLocales();
}
```

```text
                                                       ┌─── content-type ───┼─── String getContentType();
                                                       │
                                                       │                    ┌─── String getParameter(String name);
                                                       │                    │
                                                       │                    ├─── Enumeration<String> getParameterNames();
                                        ┌─── header ───┼─── param ──────────┤
                                        │              │                    ├─── String[] getParameterValues(String name);
                                        │              │                    │
                                        │              │                    └─── Map<String, String[]> getParameterMap();
                                        │              │
                                        │              │                    ┌─── Locale getLocale();
                                        │              └─── locale ─────────┤
                  ┌─── data ────────────┤                                   └─── Enumeration<Locale> getLocales();
                  │                     │
                  │                     │                           ┌─── int getContentLength();
                  │                     │                           │
                  │                     │              ┌─── byte ───┼─── long getContentLengthLong();
                  │                     │              │            │
                  │                     │              │            └─── ServletInputStream getInputStream();
                  │                     └─── body ─────┤
                  │                                    │                             ┌─── String getCharacterEncoding();
                  │                                    │            ┌─── encoding ───┤
                  │                                    └─── char ───┤                └─── void setCharacterEncoding(String env)
                  │                                                 │
                  │                                                 └─── content ────┼─── BufferedReader getReader()
                  │
                  │                     ┌─── context ────┼─── ServletContext getServletContext();
                  │                     │
                  │                     ├─── path ───────┼─── String getRealPath(String path);
                  │                     │
                  │                     │                ┌─── RequestDispatcher getRequestDispatcher(String path);
                  │                     ├─── dispatch ───┤
                  │                     │                └─── DispatcherType getDispatcherType();
                  │                     │
                  │                     │                ┌─── Object getAttribute(String name);
                  │                     │                │
ServletRequest ───┼─── container ───────┤                ├─── void setAttribute(String name, Object o);
                  │                     ├─── attr ───────┤
                  │                     │                ├─── void removeAttribute(String name);
                  │                     │                │
                  │                     │                └─── Enumeration<String> getAttributeNames();
                  │                     │
                  │                     │                ┌─── AsyncContext startAsync();
                  │                     │                │
                  │                     │                ├─── AsyncContext startAsync(request, response);
                  │                     │                │
                  │                     └─── async ──────┼─── boolean isAsyncStarted();
                  │                                      │
                  │                                      ├─── boolean isAsyncSupported();
                  │                                      │
                  │                                      └─── AsyncContext getAsyncContext();
                  │
                  │                                    ┌─── String getServerName();
                  │                     ┌─── server ───┤
                  │                     │              └─── int getServerPort();
                  │                     │
                  │                     │              ┌─── String getLocalName();
                  │                     │              │
                  │                     ├─── local ────┼─── String getLocalAddr();
                  │                     │              │
                  │                     │              └─── int getLocalPort();
                  └─── client-server ───┤
                                        │              ┌─── String getProtocol();
                                        │              │
                                        ├─── url ──────┼─── String getScheme();
                                        │              │
                                        │              └─── boolean isSecure();
                                        │
                                        │              ┌─── String getRemoteAddr();
                                        │              │
                                        └─── client ───┼─── String getRemoteHost();
                                                       │
                                                       └─── int getRemotePort();
```

```text
http://lsieun.cn:8080/lsieun/request-param?username=tom&password=123456
```

```text
header
    ContentType      : null
    ContentLength    : -1
    ContentLengthLong: -1
param:
    username: tom
    password: 123456
server
    Server Name: lsieun.cn
    Server Port: 8080
local
    Local Name : maven.lan.net
    Local Addr : 192.168.1.181
    Local Port : 8080
url
    Protocol   : HTTP/1.1
    Scheme     : http
    isSecure   : false
remote
    Remote Addr: 192.168.1.181
    Remote Host: 192.168.1.181
    Remote Port: 11852
Locale: en_US
Locales
    en_US
    en
    zh_CN
    zh
```

```text
https://lsieun.cn:8443/lsieun/request-param?username=tom&password=123456
```

```text
header
    ContentType      : null
    ContentLength    : -1
    ContentLengthLong: -1
param:
    username: tom
    password: 123456
server
    Server Name: lsieun.cn
    Server Port: 8443
local
    Local Name : maven.lan.net
    Local Addr : 192.168.1.181
    Local Port : 8443
url
    Protocol   : HTTP/1.1
    Scheme     : https
    isSecure   : true
remote
    Remote Addr: 192.168.1.181
    Remote Host: 192.168.1.181
    Remote Port: 11965
Locale: en_US
Locales
    en_US
    en
    zh_CN
    zh
```
