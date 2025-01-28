---
title: "OpenSSL Intro"
sequence: "101"
---

[UP](/pki.html)


查看帮助：

```text
$ man openssl
$ openssl genrsa -help
```

查看版本：

```text
$ openssl version
```

```text
$ cat <<EOF > root-csr.conf 
[ req ]
encrypt_key = no
utf8 = yes
string_mask = utf8only
prompt=no
distinguished_name = root_dn
x509_extensions = extensions
[ root_dn ]
# Country Name (2 letter code)
countryName = CN
stateOrProvinceName = HeBei
# Locality Name (for example, city)
localityName = BaoDing
# Organization Name (for example, company)
0.organizationName = Fruit Corp
# Name for the certificate
commonName = Fruit Root CA
[ extensions ]
keyUsage = critical,keyCertSign,cRLSign
basicConstraints = critical,CA:TRUE
subjectKeyIdentifier = hash
EOF
```

```text
$ openssl req -x509 -sha256 -days 3650 -newkey rsa:3072 \
    -config root-csr.conf -keyout rootCA/private/rootCA.key \
    -out rootCA/rootCA.crt
```

```text
$ openssl x509 -in rootCA/rootCA.crt -text -noout
```

```text
$ cat <<EOF > CA-csr.conf
[ req ]
encrypt_key = no
default_bits = 2048
default_md = sha256
utf8 = yes
string_mask = utf8only
prompt = no
distinguished_name = ca_dn
[ ca_dn ]
0.organizationName = "Watermelon Corp"
organizationalUnitName = "R&D Department"
commonName = "Watermelon HTTPS Proxy CA"
EOF
```

```text
openssl req -new -config CA-csr.conf -out CA.csr \
        -keyout CA/private/CA.key
```

```text
$ cat <<EOF > rootCA.conf
[ ca ]
default_ca = the_ca
[ the_ca ]
dir = /home/devops/workdir/root/rootCA
private_key = /home/devops/workdir/root/rootCA/private/rootCA.key
certificate = /home/devops/workdir/root/rootCA/rootCA.crt
new_certs_dir = /home/devops/workdir/root/rootCA/certs
serial = /home/devops/workdir/root/rootCA/db/crt.srl
database = /home/devops/workdir/root/rootCA/db/db
default_md = sha256
policy = policy_any
email_in_dn = no
[ policy_any ]
domainComponent = optional
countryName = optional
stateOrProvinceName = optional
localityName = optional
organizationName = optional
organizationalUnitName = optional
commonName = optional
emailAddress = optional
[ ca_ext ]
keyUsage                = critical,keyCertSign,cRLSign
basicConstraints        = critical,CA:true
subjectKeyIdentifier    = hash
authorityKeyIdentifier  = keyid:always
EOF
```

```text
openssl ca -config rootCA.conf -days 2920 -create_serial \
    -in CA.csr -out CA/CA.crt -extensions ca_ext -notext
```

```text
$ cat CA/CA.crt ../root/rootCA/rootCA.crt > CA/CA.pem
```

```text
$ cat <<EOF > server-csr.conf
[ req ]
default_bits = 2048
encrypt_key = no
default_md = sha256
utf8 = yes
string_mask = utf8only
prompt = no
distinguished_name = server_dn
req_extensions = server_reqext
[ server_dn ]
commonName = lsieun.cn
[ server_reqext ]
keyUsage = critical,digitalSignature,keyEncipherment
extendedKeyUsage = serverAuth,clientAuth
subjectKeyIdentifier = hash
subjectAltName = @alt_names
[alt_names]
DNS.1 = lsieun.cn
DNS.2 = *.lsieun.cn
EOF
```

```text
openssl req -new -config server-csr.conf -out server.csr \
        -keyout server.key
```

```text
$ cat <<EOF > CA.conf
[ ca ]
default_ca = the_ca
[ the_ca ]
dir = /home/devops/workdir/intermediate/CA
private_key = /home/devops/workdir/intermediate/CA/private/CA.key
certificate = /home/devops/workdir/intermediate/CA/CA.crt
new_certs_dir = /home/devops/workdir/intermediate/CA/certs
serial = /home/devops/workdir/intermediate/CA/db/crt.srl
database = /home/devops/workdir/intermediate/CA/db/db
unique_subject = no
default_md = sha256
policy = any_pol
email_in_dn = no
copy_extensions = copy
[ any_pol ]
domainComponent = optional
countryName = optional
stateOrProvinceName = optional
localityName = optional
organizationName = optional
organizationalUnitName = optional
commonName = optional
emailAddress = optional
[ leaf_ext ]
keyUsage = critical,digitalSignature,keyEncipherment
basicConstraints = CA:false
extendedKeyUsage = serverAuth,clientAuth
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always
[ ca_ext ]
keyUsage                = critical,keyCertSign,cRLSign
basicConstraints        = critical,CA:true,pathlen:0
subjectKeyIdentifier    = hash
authorityKeyIdentifier  = keyid:always
EOF
```

```text
openssl ca -config CA.conf -days 2190 -create_serial \
    -in server.csr -out server.crt -extensions leaf_ext -notext
```
