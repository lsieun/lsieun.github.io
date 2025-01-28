---
title: "SSL Certificates"
sequence: "101"
---

SSL certificates are a tool for securing communications over the Internet as well as maintaining data security.
It is a widespread misunderstanding to assume
that only e-commerce sites and online banking must use an SSL certificate.
In fact, most web sites that employ some kind of login page should also use an SSL certificate
so that passwords will not be transferred as plain text.

## Certificate Overview

SSL is based on both symmetric and asymmetric cryptography.
The latter involves a pair of keys, one private and one public.

A public key is normally wrapped in a certificate
since a certificate is a more trusted way of distributing a public key.
The certificate is signed using the private key
that corresponds to the public key contained in the certificate.
It is called a self-signed certificate.
In other words, a self-signed certificate is one
for which the signer is the same as the subject described in the certificate.

A self-signed certificate is good enough for people to authenticate the sender of a signed document
if those people already know the sender.
For better acceptance, you need a certificate signed by a Certificate Authority,
such as VeriSign and Thawte. You need to send them your self-signed certificate.

After a CA authenticates you, they will issue you a certificate
that replaces the self-signed certificate.
This new certificate may also be a chain of certificates.
At the top of the chain is the 'root', which is the self-signed certificate.
Next in the chain is the certificate from a CA that authenticates you.
If the CA is not well known, they will send it to a bigger CA that will
authenticate the first CA's public key.
The last CA will also send the certificate, hence forming a chain of certificates.
This bigger CA normally has their public keys widely distributed
so people can easily authenticate certificates they sign.

Java provides a set of tools and APIs
that can be used to work with asymmetric cryptography.
With them, you can do the following:

- Generate pairs of public and private keys.
  You can then send the public key generated to a certificate issuer to obtain your own certificate.
- Store your private and public keys in a database called **keystore**.
  A keystore has a name and is password protected.
- Store other people's certificates in the same keystore.
- Create your own certificate by signing it with your own private key.
  However, such certificates will have limited use.
  For testing, self-signed certificates are good enough.
- Digitally sign a file.
  This is particularly important because browsers will only allow applets access to resources
  if the applets are stored in a jar file that has been signed.
  Signed Java code guarantee the user that you are really the developer of the class.
  If they trust you they may have less doubt in running the Java class.

## The KeyTool Program

The KeyTool program is a utility to create and maintain **public and private keys** and **certificates**.
It comes with the JDK and is located in the `bin` directory of the JDK.
Keytool is a command-line program.
To check the correct syntax, simply type `keytool` at the command prompt.
The following will provide examples of some important functions.

### Generating Key Pairs

Before you start, there are a few things to notice with regard to key generation in Java.

Keytool generates **a public/private key pair** and creates **a certificate** signed
using the private key (self-signed certificate).
Among others, the certificate contains the public key and the identity of the entity whose key it is.
Therefore, you needd to supply your name and other information.
This name is called a distinguished name and contains the following information:

```text
CN = common name, e.g. Joe Sample
OU = organizational unit, e.g. Information Technology
O  = organization name, e.g. Brainy Software Corp
L  = locality name, e.g. Vancouver
S  = state name, e.g. BC
C  = country, (two letter country code) e.g. CA
```

Your keys will be stored in a database called **keystore**.
A keystore is file-based and password-protected
so that no unauthorized person can access the private keys stored in it.

If no keystore is specified when generating keys or when performing other functions,
the default keystore is assumed.
**The default keystore** is named `.keystore` in the user's home directory.

There are two types of entries in a keystore:

- **Key entries**, each of which is a private key accompanies by certificate chain of the corresponding public key.
- **Trusted certificate entries**, each of which contains the public key of an entity you trust.

Each entity is also password-protected, therefore there are two types of passwords,
the **one that protects the keystore** and **on that protects an entry**.

Each entry in a keystore is identified by a unique name or an alias.
You must specify **an alias** when generating a key pair or doing other activities with `keytool`.

If when generating a key pair you don't specify an alias, `mykey` is used as an alias.

The shortest command to generate a key pair is this.

```text
keytool -genkeypair
```

Using this command, **the default keystore** will be used or
one will be created if none exists in the user's home directory.
The generated key will have the alias `mykey`.
You will then be prompted to enter a password for the keystore and
supply information for your distinguished name.
Finally, you will be prompted for a password for the entry.

Invoking `keytool -genkeypair` again will result in an error
because it will attempt to create a pair key and use the alias `mykey` again.

To specify an alias, use the `-alias` argument.
For example, the following command creates a key pair identified using the keyword `email`.

```text
keytool -genkeypair -alias email
```

Again, the default keystore is used.

To specify a keystore, use the `-keystore` argument.
For example, this command generate a key pair and store it in the keystore named
`myKeystore` in the `C:\javakeys` directory.

```text
keytool -genkeypair -keystore C:\javakeys\myKeyStore
```

After you invoke the program, you will be asked to enter mission information.

A complete command for generating a key pair is one
that uses the `genkeypair`, `alias`, `keypass`, `storepass` and `dname` arguments.
For example.

```text
keytool -genkeypair -alias email4 -keypass myPassword -dname 
"CN=JoeSample, OU=IT, O=Brain Software Corp, L=Surrey, S=BC, C=CA" 
-storepass myPassword
```

### Getting Certified

While you can use Keytool to generate **pairs of public and private keys** and **self-signed certificates**,
your certificates will only be trusted by people who already know you.
To get more acceptance, you need your certificates
signed by a certificate authority (CA), such as VeriSign, Entrust or Thawte.

If you intend to do this, you need to generate a **Certificate Signing Request (CSR)**
by using the `-certreq` argument of Keytool.
Here is the syntax:

```text
keytool -certreq -alias alias -file certregFile
```

The **input** of this command is the certificate referenced by `alias` and
the **output** is a CSR, which is the file whose path is specified by `certregFile`.
Send the CSR to a CA and they will authenticate you offline,
normally by asking you to provide valid identification details,
such as a copy of your passport or driver's license.

If the CA is satisfied with your credentials,
they will send you a new certificate or a certificate chain that contains your public key.
This new certificate is used to replace the existing certificate chain you sent
(which was self-signed).
Once you receive the reply, you can import your new certificate into a keystore
by using the `importcert` argument of Keytool.

```text
keytool -importcert -alias anAlias -file filename
```

### Importing a Certificate into the Keystore

If you receive a signed document from a third party or a reply from a CA,
you can store it in a keystore.
You need to assign an alias you can easily remember to this certificate.

To import or store a certificate into a keystore,
use the `importcert` argument. Here is the syntax.

```text
keytool -importcert -alias anAlias -file filename
```

As an example, to import the certificate in the file `joeCertificate.cer` into the keystore and
give it the alias `brotherJoe`, you use this:

```text
keytool -importcert -alias brotherJoe -file joeCertificate.cer
```

The advantages of storing a certificate in a keystore is twofold.
First, you have a centralized store that is password protected.
Second, you can easily authenticate a signed document from a third party
if you have imported their certificate in a keystore.

## Exporting a Certificate from the Keystore

With your private key you can sign a document.
When you sign the document,
you make a digest of the document and then encrypt the digest with your private key.
You then distribute the document as well as the encrypted digest.

For others to authenticate the document, they must have your public key.
For security, your public key needs to be signed too.
You can self-sign it or you can get a trusted certificate issuer to sign it.

The first thing to do is extract your certificate from a keystore and save it as a file.
Then, you can easily distribute the file.
To extract a certificate from a keystore,
you need to use the `-exportcert` argument and pass the alias and
the name of the file to contain your certificate. Here is the syntax:

```text
keytool -exportcert -alias anAlias -file filename
```

A file containing a certificate is typically given the `.cer` extension.
For example, to extract a certificate whose alias is `Meredith` and
save it to the `meredithcertificate.cer` file, you use this command:

```text
keytool -exportcert -alias Meredith -file meredithcertificate.cer
```

### Listing Keystore Entries

Now that you have a keystore to store your private keys and
the certificates of parties you trust,
you can enquire it's content by listing it using the keytool program.
You do it by using the `list` argument.

```text
keytool -list -keystore myKeyStore -storepass myPassword
```

Again, the default keystore is assumed if the `keystore` argument is missing.
