---
title: "javax.servlet.ServletResponse"
sequence: "104"
---

```java
public interface ServletResponse {
    void setContentType(String type);
    
    String getCharacterEncoding();
    void setCharacterEncoding(String charset);

    void setContentLength(int len);
    void setContentLengthLong(long len);
    
    String getContentType();
    ServletOutputStream getOutputStream();
    PrintWriter getWriter();
    void setBufferSize(int size);
    int getBufferSize();
    void flushBuffer();
    void resetBuffer();

    boolean isCommitted();
    void reset();

    void setLocale(Locale loc);
    Locale getLocale();
}
```

```text
                                                                      ┌─── String getContentType();
                                                 ┌─── content-type ───┤
                                                 │                    └─── void setContentType(String type);
                                  ┌─── header ───┤
                                  │              │                    ┌─── void setLocale(Locale loc);
                                  │              └─── locale ─────────┤
                                  │                                   └─── Locale getLocale();
                                  │
                   ┌─── data ─────┤                           ┌─── void setContentLength(int len);
                   │              │                           │
                   │              │              ┌─── byte ───┼─── void setContentLengthLong(long len);
                   │              │              │            │
                   │              │              │            └─── ServletOutputStream getOutputStream();
                   │              └─── body ─────┤
                   │                             │            ┌─── String getCharacterEncoding();
                   │                             │            │
                   │                             └─── char ───┼─── void setCharacterEncoding(String charset);
                   │                                          │
                   │                                          └─── PrintWriter getWriter();
ServletResponse ───┤
                   │              ┌─── void setBufferSize(int size);
                   │              │
                   │              ├─── int getBufferSize();
                   │              │
                   ├─── buffer ───┼─── void flushBuffer();
                   │              │
                   │              ├─── void resetBuffer();
                   │              │
                   │              └─── void reset();
                   │
                   └─── status ───┼─── boolean isCommitted();
```

