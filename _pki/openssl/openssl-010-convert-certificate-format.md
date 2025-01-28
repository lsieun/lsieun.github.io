---
title: "Convert Certificate Formats"
sequence: "110"
---

[UP](/pki.html)


## Convert PEM to DER

The DER format is usually used with Java.
Let's convert our PEM-encoded certificate to a DER-encoded certificate:

```text
$ openssl x509 -in signed_certificate.crt -outform der -out signed_certificate.der
```

## Convert PEM to PKCS12

PKCS12 files, also known as PFX files,
are usually used for importing and exporting certificate chains in Microsoft IIS.

We'll use the following command to take our private key and certificate,
and then combine them into a PKCS12 file:

```text
$ openssl pkcs12 -export -inkey rsa-private.key -in signed_certificate.pem -out signed_certificate.pfx -name "fruit"
```

- `-export`: output PKCS12 file
- `-inkey file`: private key
- `-in infile`: input filename
- `-out outfile`: output filename
- `-name "name"`: use name as friendly name


## PKCS12 to PEM

```text
$ openssl pkcs12 -in keystore.p12 -out keystore.pem
```

The tool will prompt us for the PKCS#12 KeyStore password and a PEM passphrase for each alias.
**The PEM passphrase is used to encrypt the resulting private key.**

If we don't want to encrypt the resulting private key, we should instead use:

```text
openssl pkcs12 -nodes -in keystore.p12 -out keystore.pem
```

`keystore.pem` will contain all the keys and certificates from the KeyStore.
For this example, it contains a private key and a certificate for both the first-key-pair and second-key-pair aliases.
