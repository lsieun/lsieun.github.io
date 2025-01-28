---
title: "Nginx: 413 – Request Entity Too Large"
sequence: "106"
---

```text
vi /etc/nginx/nginx.conf
```

Add the following line to `http` or `server` or `location` context to increase the size limit in `nginx.conf`, enter:

```text
# set client body size to 2M #
client_max_body_size 2M;
```

If you need 100MB then:

```text
# set client body size to 100 MB #
client_max_body_size 100M;
```

The `client_max_body_size` directive assigns the maximum accepted body size of client request,
indicated by the line `Content-Length` in the header of request.
If size is greater the given one, then the client gets the error "Request Entity Too Large" (413).
