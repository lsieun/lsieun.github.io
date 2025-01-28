---
title: "Spring Boot: HTTPS"
sequence: "101"
---

## certificate formats

Before getting started, we'll create a self-signed certificate. We'll use either of the following certificate formats:

- **PKCS12**: [Public Key Cryptographic Standards](https://en.wikipedia.org/wiki/PKCS_12) is a password protected format
  that can contain multiple certificates and keys; it's an industry-wide used format.
- **JKS**: [Java KeyStore](https://en.wikipedia.org/wiki/Keystore) is similar to **PKCS12**;
  it's a proprietary format and is limited to the Java environment.

We can use either `keytool` or `OpenSSL` tools to generate the certificates from the command line.
Keytool is shipped with Java Runtime Environment, and OpenSSL can be downloaded from [here](https://www.openssl.org/).

For our demonstration, let's use keytool.


```text
keytool -genkeypair -alias springboot -keyalg RSA -keysize 4096 -storetype PKCS12 -keystore springboot.p12 -validity 3650 -storepass myStorePass
```

```text
keytool -genkeypair -alias springboot -keyalg RSA -keysize 2048 -storetype PKCS12 -keystore springboot2.p12 -validity 3650 -dname "CN=liusen,OU=IT,O=Fruit,L=BaoDing,S=HeBei,C=CN" -storepass myStorePass
```

```text
server.port=8443
server.ssl.key-store=classpath:springboot2.p12
server.ssl.key-store-password=myStorePass
server.ssl.key-store-type=PKCS12
server.ssl.key-alias=springboot
```

```text
import org.apache.catalina.Context;
import org.apache.catalina.connector.Connector;
import org.apache.tomcat.util.descriptor.web.SecurityCollection;
import org.apache.tomcat.util.descriptor.web.SecurityConstraint;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class HttpConnectorConfig {

    public Connector getHttpConnector() {
        Connector connector = new Connector("org.apache.coyote.http11.Http11NioProtocol");
        connector.setScheme("http");
        connector.setSecure(false);
        connector.setPort(8080);
        connector.setRedirectPort(8443);
        return connector;
    }

    @Bean
    public TomcatServletWebServerFactory tomcatServletWebServerFactory() {
        TomcatServletWebServerFactory factory = new TomcatServletWebServerFactory() {
            @Override
            protected void postProcessContext(Context context) {
                SecurityConstraint securityConstraint = new SecurityConstraint();
                securityConstraint.setUserConstraint("CONFIDENTIAL"); // 设置约束
                SecurityCollection collection = new SecurityCollection();
                collection.addPattern("/*"); // 所有路径进行处理
                securityConstraint.addCollection(collection);
                context.addConstraint(securityConstraint);
                super.postProcessContext(context);
            }
        };

        factory.addAdditionalTomcatConnectors(getHttpConnector());
        return factory;
    }
}
```

## Reference

Spring:

- [Configure SSL](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#howto.webserver.configure-ssl)
- [Ssl.java](https://github.com/spring-projects/spring-boot/blob/v3.0.6/spring-boot-project/spring-boot/src/main/java/org/springframework/boot/web/server/Ssl.java)
- [How to Configure Spring Boot Tomcat](https://www.baeldung.com/spring-boot-configure-tomcat)

Baeldung:

- [HTTPS using Self-Signed Certificate in Spring Boot](https://www.baeldung.com/spring-boot-https-self-signed-certificate)


Other

- [How to enable HTTPS in a Spring Boot Java application](https://www.thomasvitale.com/https-spring-boot-ssl-certificate/)
