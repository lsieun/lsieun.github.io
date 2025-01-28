---
title: "Basic Properties"
sequence: "basic"
---

## Server Address and Port

| Name             | Description                                      | Default Value |
|------------------|--------------------------------------------------|---------------|
| `server.address` | Network address to which the server should bind. |               |
| `server.port`    | Server HTTP port.                                | `8080`        |
| ``               |                                                  |               |
| ``               |                                                  |               |

By default, the `server.address` is set to `0.0.0.0`, which allows connection via all IPv4 addresses.

## Error Handling

| Name             | Description                                      | Default Value |
|------------------|--------------------------------------------------|---------------|
| ``               |                                                  |               |
| ``               |                                                  |               |

**By default, Spring Boot provides a standard error web page.**
This page is called the **Whitelabel**.
It's enabled by default, but if we don't want to display any error information, we can disable it:

```text
server.error.whitelabel.enabled=false
```

The default path to a **Whitelabel** is `/error`.
We can customize it by setting the `server.error.path` parameter:

```text
server.error.path=/user-error
```

We can also set properties that will determine which information about the error is presented.
For example, we can include the **error message** and the **stack trace**:

```text
server.error.include-exception=true
server.error.include-stacktrace=always
```
