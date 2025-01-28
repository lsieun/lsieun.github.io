---
title: "生成通配符证书"
sequence: "103"
---

[UP](/pki.html)


## CA 证书

第 1 步，生成私钥（需要输入密码）：

```text
openssl genrsa -des3 -out selfsignCA.key 4096
```

第 2 步，生成自签名证书：

```text
openssl req -new -x509 -days 3650 -key selfsignCA.key -out selfsignCA.crt
```

## 通配符证书

第 1 步，生成私钥：

```text
openssl genrsa -out somedomain.key 2048
```

第 2 步，编写配置文件 `openssl.cnf`：

```text
[req]
default_md = sha256
prompt = no
req_extensions = req_ext
distinguished_name = req_distinguished_name
[req_distinguished_name]
commonName = *.yourdomain.com     # 修改
countryName = US                  # 修改
stateOrProvinceName = No state    # 修改
localityName = City               # 修改
organizationName = LTD            # 修改
[req_ext]
keyUsage=critical,digitalSignature,keyEncipherment
extendedKeyUsage=critical,serverAuth,clientAuth
subjectAltName = @alt_names
[alt_names]
DNS.1=yourdomain.com      # 修改
DNS.2=*.yourdomain.com    # 修改
```

第 3 步，创建 CSR：

```text
openssl req -new -nodes -key somedomain.key -config openssl.cnf -out somedomain.csr
```

第 4 步，检查 CSR 文件中的域名通配符是否正确：

```text
openssl req -noout -text -in somedomain.csr
```

第 5 步，进行签名：

```text
openssl x509 -req -in somedomain.csr \
    -CA selfsignCA.crt -CAkey selfsignCA.key -CAcreateserial \
    -out somedomain.crt -days 1024 -sha256 \
    -extfile openssl.cnf -extensions req_ext
```

- `-extfile`: config file
- `-extensions`: section name from config file with values of `subjectAltName` for Subject Alternative Names.

## Reference

- [How to create Selfsigned CA and custom Wildcard SSL certificate](https://medium.com/@seabro/how-to-create-selfsigned-ca-and-custom-wildcard-ssl-certificate-1112ed2080f7)
