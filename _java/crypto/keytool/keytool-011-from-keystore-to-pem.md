---
title: "Converting a Java Keystore Into PEM Format"
sequence: "111"
---

[UP](/java-crypto.html)


## Converting an Entire JKS Into PEM Format

### Creating the Java KeyStore

添加第 1 个 key pair：

```text
$ keytool -genkey -keyalg RSA -v -keystore keystore.jks -alias first-key-pair
Enter keystore password: jksStorePass 
Re-enter new password: jksStorePass
What is your first and last name?
  [Unknown]:  www.fruit.com
What is the name of your organizational unit?
  [Unknown]:  IT
What is the name of your organization?
  [Unknown]:  Fruit Ltd
What is the name of your City or Locality?
  [Unknown]:  BaoDing
What is the name of your State or Province?
  [Unknown]:  HeBei
What is the two-letter country code for this unit?
  [Unknown]:  CN
Is CN=www.fruit.com, OU=IT, O=Fruit Ltd, L=BaoDing, ST=HeBei, C=CN correct?
  [no]:  yes

Generating 2,048 bit RSA key pair and self-signed certificate (SHA256withRSA) with a validity of 90 days
	for: CN=www.fruit.com, OU=IT, O=Fruit Ltd, L=BaoDing, ST=HeBei, C=CN
[Storing keystore.jks]
```

添加第 2 个 key pair：

```text
$ keytool -genkey -keyalg RSA -v -keystore keystore.jks -alias second-key-pair
Enter keystore password: jksStorePass 
What is your first and last name?
  [Unknown]:  www.vegetable.com
What is the name of your organizational unit?
  [Unknown]:  IT
What is the name of your organization?
  [Unknown]:  Vegetable Ltd
What is the name of your City or Locality?
  [Unknown]:  BaoDing
What is the name of your State or Province?
  [Unknown]:  HeBei
What is the two-letter country code for this unit?
  [Unknown]:  CN
Is CN=www.vegetable.com, OU=IT, O=Vegetable Ltd, L=BaoDing, ST=HeBei, C=CN correct?
  [no]:  yes

Generating 2,048 bit RSA key pair and self-signed certificate (SHA256withRSA) with a validity of 90 days
	for: CN=www.vegetable.com, OU=IT, O=Vegetable Ltd, L=BaoDing, ST=HeBei, C=CN
[Storing keystore.jks]
```

### JKS to PKCS12

```text
$ keytool -importkeystore -srckeystore keystore.jks \
   -destkeystore keystore.p12 \
   -srcstoretype jks \
   -deststoretype pkcs12
```

```text
$ keytool -importkeystore -srckeystore keystore.jks \
>    -destkeystore keystore.p12 \
>    -srcstoretype jks \
>    -deststoretype pkcs12
Importing keystore keystore.jks to keystore.p12...
Enter destination keystore password: pkcs12StorePass 
Re-enter new password: pkcs12StorePass
Enter source keystore password: jksStorePass 
Entry for alias first-key-pair successfully imported.
Entry for alias second-key-pair successfully imported.
Import command completed:  2 entries successfully imported, 0 entries failed or cancelled
```

### PKCS12 to PEM

From here, we'll use `openssl` to encode `keystore.p12` into a PEM file:

```text
$ openssl pkcs12 -in keystore.p12 -out keystore.pem
```

```text
$ openssl pkcs12 -in keystore.p12 -out keystore.pem
Enter Import Password:
MAC verified OK
Enter PEM pass phrase: 123456
Verifying - Enter PEM pass phrase: 123456
Enter PEM pass phrase: abcdef
Verifying - Enter PEM pass phrase: abcdef
```

The tool will prompt us for the PKCS#12 KeyStore password and a PEM passphrase for each alias.
**The PEM passphrase is used to encrypt the resulting private key.**

If we don't want to encrypt the resulting private key, we should instead use:

```text
$ openssl pkcs12 -nodes -in keystore.p12 -out keystore.pem
```

- `-nodes`: don't encrypt private keys

## Converting a Single Certificate From a JKS Into PEM

**We can export a single public key certificate out of a JKS and into PEM format using `keytool` alone:**

```text
$ keytool -exportcert -alias first-key-pair -keystore keystore.jks -rfc -file first-key-pair-cert.pem
```

- `-rfc`: output in RFC style
