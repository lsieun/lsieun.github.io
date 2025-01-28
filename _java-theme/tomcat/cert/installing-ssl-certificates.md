---
title: "Installing SSL Certificates"
sequence: "102"
---

Tomcat supports SSL and you should use it to secure transfer of
confidential data such as social security numbers and credit card details.
You can generate a public/private key pair using the KeyTool program and
pay a trusted authority to create and sign a digital certificate for you.

Once you receive your certificate and import it into your keystore,
the next step will be to install it on your server.
If you're using Tomcat, simply copy your keystore in a location on the server and configure Tomcat.
Then, open your `conf/server.xml` file and add the following `Connector` element under `<service>`.

```xml
<Connector port="443"
           minSpareThreads="5"
           maxSpareThreads="75"
           enableLookups="true"
           disableUploadTimeout="true"
           acceptCount="100"
           maxThreads="200"

           scheme="https"
           secure="true"
           SSLEnabled="true"
           keystoreFile="/path/to/keystore"
           keyAlias="example.com"
           keystorePass="01secret02%%%"
           clientAuth="false"
           sslProtocol="TLS"
/>
```

The `scheme`~`sslProtocol` lines are related to SSL.

