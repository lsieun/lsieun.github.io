---
title: "Status Code 415: Unsupported MediaType"
sequence: "102"
---

我使用 Postman 向 Spring Boot 发送 Json 数据

```text
{"name":"abc","content":"this-is-a-content"}
```

遇到如下错误：

```text
{
    "timestamp": "2023-02-02T06:31:12.115+00:00",
    "status": 415,
    "error": "Unsupported Media Type",
    "path": "/mqtt/getMsg"
}
```

后来，搜索到了 Bealdung 的文章，才意识到 Media Type 是和 Content-Type 对应的，有两种可能：

- 第一种情况，Postman 发送请示时，Header 里的 `Content-Type` 设置的不对
- 第二种情况，Spring Boot 里对接收的 `Content-Type` 进行了限制

经过检查，发现是 Postman 的 Header 中的 `Content-Type` 是 `text/plain`，修改一下就好了：

```text
Content-Type: application/json
```

- Status Code 415: Unsupported MediaType
  - Client 端原因
    - Header 中 Content-Type 设置的不对
    - Payload 中，数据的格式不对
  - Server 端原因
    - 接收的MediaType不对

## Status Code 415: Unsupported MediaType

According to the specification [RFC 7231 title HTTP/1.1 Semantics and Content section 6.5.13](https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.13):

```text
The 415 (Unsupported Media Type) status code indicates that the origin server is refusing to service the request
 because the payload is in a format not supported by this method on the target resource.
```

As the specification suggests, our chosen media type isn't supported by the API.
The reason for choosing JSON as the media type was because of the response from the GET requests.
The response data format was in JSON.
Hence, we assumed that the POST request would accept JSON as well.
However, that assumption turned out to be wrong.

In order to find which format is supported by the API, we've decided to dig into the server-side backend code,
and we find the API definition:

```text
@PostMapping(value = "/", consumes = {"application/xml"})
void AddUser(@RequestBody User user)
```

This explains pretty clearly that the API will only support XML format.
One may question here: What's the purpose of this “consumes” element in Spring?

According to the [Spring framework documentation](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/bind/annotation/RequestMapping.html#consumes--),
the purpose of the “consumes” element is:

```text
Narrows the primary mapping by media types that can be consumed by the mapped handler.
Consists of one or more media types one of which must match to the request Content-Type header
```

```text
consumes = "text/plain"
consumes = {"text/plain", "application/*"}
consumes = MediaType.TEXT_PLAIN_VALUE
```

**The first and most amateur option is to replace XML format with JSON on the API**:

```text
@PostMapping(value = "/", consumes = {"application/json"}) 
void AddUser(@RequestBody User user)
```

The response will be a success.
**However, we'll face a situation where all of our existing clients, who are sending requests in XML format,
will now begin getting 415 Unsupported Media Type errors.**

**The second and somewhat easier option is to allow every format in the request payload**:

```text
@PostMapping(value = "/", consumes = {"*/*"}) 
void AddUser(@RequestBody User user)
```

Upon request in JSON format, the response will be a success.
However, the problem here is that **it's too flexible**.
We don't want a wide range of formats to be allowed.
**This will result in inconsistent behavior in the overall codebase (both client-side and server-side).**

**The third and recommended option is to add specifically those formats
that the client-side applications are currently using.**
Since the API already supports the XML format,
we'll keep it there as there are existing client-side applications sending XML to the API.
To make the API support our application format as well, we'll make a simple API code change:

```text
@PostMapping(value = "/", consumes = {"application/xml","application/json"}) 
void AddUser(@RequestBody User user)
```

Upon sending our request in JSON format, the response will be a success.
This is the recommended method in this particular scenario.

**The “Content-Type” header must be sent from the client-side application request
in order to avoid the 415 Unsupported Media Type error.
Also, the RFC explains clearly that the “Content-Type” header of the client-side application
and server-side application must be in sync in order to avoid this error while sending a POST request.**

## Reference

- [415 Unsupported MediaType in Spring Application](https://www.baeldung.com/spring-415-unsupported-mediatype)
