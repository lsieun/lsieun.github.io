---
title: "OpenSSL RSA Keys and Certificate"
sequence: "102"
---

[UP](/pki.html)


## RSA Keys

```text
           ┌─── rsa-public.key
ras.key ───┤
           └─── rsa-private.key
```

### Generate RSA Key

```text
$ openssl genrsa -out rsa.key 2048
```

```text
$ openssl genrsa -out rsa.key 2048
Generating RSA private key, 2048 bit long modulus
................+++
............................................................+++
e is 65537 (0x10001)
```

- `e`: `65537`，表示 public exponent

Private keys are stored in the so-called **PEM format**.

```text
$ cat rsa.key 
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA0f4HF7aMHpEETkipdJTKp5pYXRb3dgIHAoRjmWNbA6BLXkr5
2E8AHqNgw+VdaD5sNhfgsrxpsxc7CqKW1gmnUp1ZKP/lbtz1tRf52JQ3pcyKAGt/
h8//40tZF6W9/HJyGHnHg+cVpr+Pyvdx0Dd4qVRKE4hGZzP0fZyPYzPOyULTAwc6
xnmq4/S9A6ra0KfPzT1lPM+Hg0lZh/lT9wj4qAWdzNdbuGYocYG2GlBKUodggCGi
JkRSq6M20v02mhAm2MuG5tRUmLXEOtOPJ6XtooYJjh+6FsysuvGdWd/ecovqWAH5
jT/lN/gWAfl26SZhc1fV+lV/sWPbhQCgmV3RWQIDAQABAoIBAQCag9/2K+V4jF5t
t/uwg9eGcgS5IrAdzioYSQ/8iuYqieVLUcH7z02YPcFzA6+yh9QaDYHSIt9n3x0b
mz1/6wSKvqsfhwPsinvlr+mw2ocD4bhdzLu/VGbGeefphZSBUDjyF5GeVghRdT06
LM87VcXcWuBS9QBQ6iLp1qyPY0yyO7oU8m9S6nlL5d5ZBUrIXqiYoWDfNcskX/JM
4AStFN5AA7thSCGczNW2sIXe8b4jJe0GaL5jtbT0yEq2Dg5EAiePFPq1pDmrM6Ht
PMC5oEJaQ5fAtpDqdgnfreUVhSgMhJV7O90i417tYZ7aWBcGakn51YATYRvPtIbF
666XEpLdAoGBAPxpJYd8T6GbdNtm8r7kL0sunjQo/ScZ7ZvXDg4xGI0mdoorS5wb
tsLCWjJY1Yw2Z2SPX4QXYUeAPepZ8OSIQJ9KVvZDSXHFo65pD/eGFqn587KQWp1Y
mHNoO1Wx3ArYUDaqPZSwGak7N8my4JcZSShYbdqQer2aNemruy2cPpVLAoGBANT6
dv/8zVG30PAl3YJ71D3ORG08ymKbw4LjTUtR+p27ZvprixtQe2wvPZ3zmyFglHSY
GXI0Fuv2afJNoTdqFhg7fm9W7Zq7AT150SaePIoV+RbKuxCfhoMHuRWKTm0hhXSJ
1hSdMBPcQlqcWAukmiVcjZyYkeE2AU/r2WYrbGFrAoGADYqmlMo6i3UHo+22AD/F
ucbaffnk+wANG1tCScighJIXsfn4qHtkJra+mAzkCA2zJlX6zd9jPK7Io5YHsnsM
3H7kg3nAqvXrfiPs017CQIREasQL2H00UJy68jIEmCBazVP80clQ1x9yMsQCAJk+
r4du/Vba/ukTE2I/PIcxZFkCgYAcPlbXnbvQsXK41hyo+CjuRVNXtS8Vophr3B7c
9TMqBbcjUG2zIporf5xJPQv+giNNzvnY5kV/5z6njlnp0ly5u/IJa9q4oUIJ2AS/
fU6D9WQB/MKP8sfQyo5l5+B8omxjRwAn3ayJhbUa9Q7MBHkYqUxyTt1Ro2rLIXjE
DtAhnwKBgQCkgpruJwe0oTDMwH+rcgS8WigyLjdVfZ9hgKcgbnScGTRXbZ/8GYva
QrTf0oirNr/fre1Iz3wwCfMajhwm56aDJuIzcvcyHWHFt1DVHLRPYl1liTBAFlzk
FunwP4ATXpxwgO8k7zP/ioubmrMQ7kGLHxjiV0oLE4Kl7tNElqmv9A==
-----END RSA PRIVATE KEY-----
```

### Export Key

导出 Public Key：

```text
$ openssl rsa -pubout -in rsa.key -out rsa-public.key
writing RSA key
```

导出 Private Key：

```text
$ openssl rsa -in rsa.key -out rsa-private.key
writing RSA key
```

注意：

- 第 1 点，导出 private key 和 public key 的区别：不需要使用 `-pubout` 选项
- 第 2 点，`rsa-private.key` 和 `rsa.key` 的内容是一模一样的。

### Examine Key

检查 Public Key 的内容：

```text
$ openssl rsa -text -noout -pubin -in rsa-public.key
Public-Key: (2048 bit)
Modulus:
    00:d1:fe:07:17:b6:8c:1e:91:04:4e:48:a9:74:94:
    ...
Exponent: 65537 (0x10001)
```

检查 Private Key 的内容：

```text
$ openssl rsa -text -noout -in rsa-private.key
Private-Key: (2048 bit)
modulus:
    00:d1:fe:07:17:b6:8c:1e:91:04:4e:48:a9:74:94:
    ca:a7:9a:58:5d:16:f7:76:02:07:02:84:63:99:63:
    ....
publicExponent: 65537 (0x10001)
privateExponent:
    00:9a:83:df:f6:2b:e5:78:8c:5e:6d:b7:fb:b0:83:
    ...
prime1:
    00:fc:69:25:87:7c:4f:a1:9b:74:db:66:f2:be:e4:
    ...
prime2:
    00:d4:fa:76:ff:fc:cd:51:b7:d0:f0:25:dd:82:7b:
    ...
exponent1:
    0d:8a:a6:94:ca:3a:8b:75:07:a3:ed:b6:00:3f:c5:
    ...
exponent2:
    1c:3e:56:d7:9d:bb:d0:b1:72:b8:d6:1c:a8:f8:28:
    ...
coefficient:
    00:a4:82:9a:ee:27:07:b4:a1:30:cc:c0:7f:ab:72:
    ...
```

## Certificate

### Create Certificate Signing Requests

```text
$ openssl req -new -key rsa.key -out certificate_signing_request.pem
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [AU]:CN
State or Province Name (full name) [Some-State]:HeBei
Locality Name (eg, city) []:BaoDing
Organization Name (eg, company) [Internet Widgits Pty Ltd]:Fruit Ltd
Organizational Unit Name (eg, section) []:IT
Common Name (e.g. server FQDN or YOUR name) []:www.fruit.com
Email Address []:admin@fruit.com

Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []:
An optional company name []:
```

```text
$ cat certificate_signing_request.pem
-----BEGIN CERTIFICATE REQUEST-----
MIICzjCCAbYCAQAwgYgxCzAJBgNVBAYTAkNOMQ4wDAYDVQQIDAVIZUJlaTEQMA4G
...
K7o=
-----END CERTIFICATE REQUEST-----
```

查看 `certificate_signing_request.pem` 内容：

```text
$ openssl req -text -noout -in certificate_signing_request.pem
```

### Sign Your Own Certificates

```text
$ openssl x509 -req -days 365 -signkey rsa-private.key -in certificate_signing_request.pem -out signed_certificate.pem
```

### Examine Signed Certificate

```text
$ openssl x509 -text -noout -in signed_certificate.pem
```

## Creating a CA-Signed Certificate With Our Own CA

### Create a Self-Signed Root CA

Let's create a private key (`rootCA.key`) and
a self-signed root CA certificate (`rootCA.crt`) from the command line:

```text
$ openssl req -x509 -sha256 -days 3650 -newkey rsa:2048 -keyout rootCA.key -out rootCA.crt
```

### Sign Our CSR With Root CA

First, we'll create a configuration text-file (`domain.ext`) with the following content:

```text
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
subjectAltName = @alt_names
[alt_names]
DNS.1 = domain
```

The `DNS.1` field should be the domain of our website.

```text
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
subjectAltName = @alt_names
[alt_names]
DNS.1 = www.fruit.com
```

Then we can sign our CSR (`certificate_signing_request.pem`) with the root CA certificate
and its private key:

```text
$ openssl x509 -req -CA rootCA.crt -CAkey rootCA.key -in certificate_signing_request.pem -out signed_certificate.crt -days 365 -CAcreateserial -extfile domain.ext
```
