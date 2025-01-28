---
title: "MultipartFile"
sequence: "116"
---

- 类名：`org.springframework.web.multipart.MultipartFile`
- 模块：`spring-web`

```text
                 ┌─── isEmpty()
                 │
                 │                 ┌─── getName()
                 ├─── form ────────┤
                 │                 └─── getContentType()
                 │
                 │                                   ┌─── getOriginalFilename()
                 │                 ┌─── meta-info ───┤
MultipartFile ───┤                 │                 └─── getSize()
                 ├─── file ────────┤
                 │                 │                 ┌─── getBytes()
                 │                 │                 │
                 │                 └─── content ─────┼─── getInputStream()
                 │                                   │
                 │                                   └─── getResource()
                 │
                 │                 ┌─── transferTo(File dest)
                 └─── auxiliary ───┤
                                   └─── transferTo(Path dest)
```

![](/assets/images/spring/mvc/file-form-and-multi-part-file.png)



