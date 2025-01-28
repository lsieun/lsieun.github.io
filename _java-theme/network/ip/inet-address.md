---
title: "InetAddress"
sequence: "104"
---

Java uses the `InetAddress` class to access **IP addresses** and **resources**.

When communications occur between different networks using different machines and operating systems, problems can occur due to differences at the hardware or software level. One of these issues is the characters used in URLs. The `URLEncoder` and `URLDecoder` classes can help address this problem, and they are discussed in Chapter 9, **Network Interoperability**.

通过域名获取IP地址

```text
InetAddress[] names = InetAddress.getAllByName("www.baidu.com");
for(InetAddress element: names) {
    System.out.println(element);
}
```

```text
InetAddress address = InetAddress.getByName("www.pactpub.com");
displayInetAddressInformation(address);
```


www.pactpub.com/50.63.202.40
CanonicalHostName: ip-50-63-202-40.ip.secureserver.net
HostName: www.pactpub.com
HostAddress: 50.63.202.40


```text
InetAddress address = InetAddress.getByName("www.baidu.com");
displayInetAddressInformation(address);
```

www.baidu.com/61.135.169.121
CanonicalHostName: 61.135.169.121
HostName: www.baidu.com
HostAddress: 61.135.169.121

www.google.com/69.171.224.12
CanonicalHostName: 69.171.224.12
HostName: www.google.com
HostAddress: 69.171.224.12

## Reference

- [http://httpbin.org/](http://httpbin.org/): A simple HTTP Request & Response Service.
