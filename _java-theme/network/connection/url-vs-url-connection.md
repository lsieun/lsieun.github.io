---
title: "URL VS URLConnection"
sequence: "101"
---

## URL vs URLConnection

The biggest differences between `URL` and `URLConnection` are:

- `URLConnection` provides access to the HTTP header.<sub>获取response的header信息</sub>
- `URLConnection` can configure the request parameters sent to the server.<sub>设置request的header信息</sub>
- `URLConnection` can write data to the server as well as read data from the server.<sub>可以写message body给server</sub>

### Request Methods

好像还有一点，从请求的方法来说：

- URL只可以发送GET请求
- URLConnection可以发送GET和POST请求，而不能发送PUT和DELETE请求
- HttpURLConnection可以发送GET、POST、PUT和DELETE请求

## URLConnection vs HttpURLConnection

### response status line



### disconnect
