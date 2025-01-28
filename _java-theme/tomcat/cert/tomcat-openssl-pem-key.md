---
title: "用 .pem 和 .key 给Tomcat配置SSL"
sequence: "104"
---

服务器证书分很多种，目前的 PKCS12 位行业标准格式（文件后缀 `.p12` 或者 `.pfx`）。
那么我们第一步就是用 `.pem` 和 `.key` 来生成证书文件。
要生成 `PKCS12` 格式证书文件，需要 `openssl`.

```text
openssl pkcs12 -export -inkey cert.key -in cert.pem -name test -out test.pfx
```

中途需要输入导出密码（enter export password），输入一个，做好记录。这时候控制台不显示的，输入完敲回车就可以。

再次确认刚才的密码（verifying-enter export password），控制台不显示，输入完成后回车。

```text
$ openssl pkcs12 -export -inkey lsieun.cn.key -in lsieun.cn.cer -name lsieun.cn -out lsieun.pfx
Enter Export Password:
Verifying - Enter Export Password:
```

去tomcat里面进行配置了，这里只讲一下 `server.xml` 中 `443` 端口标签要如何写。比如我刚才生成的文件名是 `test.pfx`

```text
<Connector
        protocol="org.apache.coyote.http11.Http11NioProtocol"
        port="443" maxThreads="200"
        scheme="https" secure="true" SSLEnabled="true"
        keystoreFile="/home/tomcat/conf/cert/test.pfx"    <!--这里是证书文件存放路径，我写的是linux格式的-->
        keystoreType="PKCS12"    <!--这里是证书格式，.pfx和.p12都是PKCS12格式的-->
        keystorePass="123456"    <!--刚才输入的密码-->
        clientAuth="false" sslProtocol="TLS"/>
```

```xml
<Connector protocol="org.apache.coyote.http11.Http11NioProtocol"
           port="443" maxThreads="200"
           scheme="https" secure="true" SSLEnabled="true"
           keystoreFile="D:\workspace\lsieun\lsieun.pfx"
           keystoreType="PKCS12"
           keystorePass="myStorePass"
           clientAuth="false" sslProtocol="TLS"/>
```

重启tomcat，使用https尝试登录。

## 直接使用pem和key

```xml
<Connector port="8443" protocol="org.apache.coyote.http11.Http11NioProtocol" maxThreads="150" SSLEnabled="true">
    <SSLHostConfig>
        <Certificate certificateFile="conf/cert.pem"
                     certificateKeyFile="conf/privkey.pem"
                     certificateChainFile="conf/chain.pem"/>
    </SSLHostConfig>
</Connector>
```

```xml
<Connector port="8443" protocol="org.apache.coyote.http11.Http11NioProtocol" maxThreads="150" SSLEnabled="true">
    <SSLHostConfig>
        <Certificate certificateFile="D:\workspace\lsieun\cert\lsieun.cn.cer"
                     certificateKeyFile="D:\workspace\lsieun\cert\lsieun.cn.key"
                     certificateChainFile="D:\workspace\lsieun\cert\fullchain.cer"/>
    </SSLHostConfig>
</Connector>
```

## 强制https访问

```text
<Connector port="8080" protocol="HTTP/1.1"
           connectionTimeout="20000"
           redirectPort="8443" />
<Connector
   protocol="org.apache.coyote.http11.Http11NioProtocol"
   port="8443" maxThreads="200"
   scheme="https" secure="true" SSLEnabled="true"
   keystoreFile="D:\workspace\lsieun\lsieun.pfx"
   keystoreType="PKCS12"
   keystorePass="myStorePass"
   clientAuth="false" sslProtocol="TLS"/>
```

在 `web.xml` 的 `welcome-file-list` 后，增加以下内容

```text
<login-config>
    <!-- Authorization setting for SSL -->
    <auth-method>CLIENT-CERT</auth-method>
    <realm-name>Client Cert Users-only Area</realm-name>
</login-config>

<security-constraint>
    <!-- Authorization setting for SSL -->
    <web-resource-collection>
        <web-resource-name>SSL</web-resource-name>
        <url-pattern>/*</url-pattern>
    </web-resource-collection>
    <user-data-constraint>
        <transport-guarantee>CONFIDENTIAL</transport-guarantee>
    </user-data-constraint>
</security-constraint>
```

```xml

<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee
                      http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd"
         version="3.1">
    <welcome-file-list>
        <welcome-file>index.html</welcome-file>
        <welcome-file>index.htm</welcome-file>
        <welcome-file>index.jsp</welcome-file>
    </welcome-file-list>

    <login-config>
        <!-- Authorization setting for SSL -->
        <auth-method>CLIENT-CERT</auth-method>
        <realm-name>Client Cert Users-only Area</realm-name>
    </login-config>

    <security-constraint>
        <!-- Authorization setting for SSL -->
        <web-resource-collection>
            <web-resource-name>SSL</web-resource-name>
            <url-pattern>/*</url-pattern>
        </web-resource-collection>
        <user-data-constraint>
            <transport-guarantee>CONFIDENTIAL</transport-guarantee>
        </user-data-constraint>
    </security-constraint>

</web-app>
```

## openssl

```text
$ openssl pkcs12 --help
Usage: pkcs12 [options]
where options are
-export       output PKCS12 file
-inkey file   private key if not infile
-name "name"  use name as friendly name
-in  infile   input filename
-out outfile  output filename
-noout        don't output anything, just verify.
```

## Reference

- [How To Secure Tomcat with Let's Encrypt SSL](https://tecadmin.net/how-to-install-lets-encrypt-ssl-with-tomcat/)
- [A Step-by-Step Guide to Creating Self-Signed SSL Certificates](https://tecadmin.net/step-by-step-guide-to-creating-self-signed-ssl-certificates/)