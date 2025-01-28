---
title: "keytool"
sequence: "keytool"
---

```text
keytool
# 或
keytool -help
```

## What Is keytool?


## Default

Your keys will be stored in a database called **keystore**.
A keystore is file-based and password-protected
so that no unauthorized person can access the private keys stored in it.

If no keystore is specified when generating keys or when performing other functions,
the default keystore is assumed.
**The default keystore** is named `.keystore` in the user's home directory.

```text
${HOME}/.keystore
```

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

To specify a keystore, use the `-keystore` argument.
For example, this command generate a key pair and store it in the keystore named
`myKeystore` in the `C:\javakeys` directory.

```text
keytool -genkeypair -keystore C:\javakeys\myKeyStore
```

## Creating a Self-Signed Certificate

First of all, let's create a self-signed certificate
that could be used to establish secure communication between projects in our development environment, for example.

In order to generate the certificate,
we're going to open a command-line prompt and use `keytool` command with the `-genkeypair` option:

```text
keytool -genkeypair -keyalg RSA -alias <alias> -keypass <keypass> -validity <validity> -storepass <storepass>
```

Let's learn more about each of these parameters:

- `alias` – the name for our certificate
- `keypass` – the password of the **certificate**.
  We'll need this password to have access to the private key of our certificate
- `validity` – the time (in days) of the validity of our certificate
- `storepass` – the password for the **keystore**.
  This will be the password of the keystore if the store doesn't exist

For example, let's generate a certificate named “cert1” that has a private key of “pass123” and is valid for one year.
We'll also specify “stpass123” as the keystore password:

```text
keytool -genkeypair -keyalg RSA -alias cert1 -keypass pass123 -validity 365 -storepass stpass123
```

After executing the command, it'll ask for some information that we'll need to provide:

```text
What is your first and last name?
  [Unknown]:  Name
What is the name of your organizational unit?
  [Unknown]:  Unit
What is the name of your organization?
  [Unknown]:  Company
What is the name of your City or Locality?
  [Unknown]:  City
What is the name of your State or Province?
  [Unknown]:  State
What is the two-letter country code for this unit?
  [Unknown]:  US
Is CN=Name, OU=Unit, O=Company, L=City, ST=State, C=US correct?
  [no]:  yes
```

As mentioned, if we haven't created the keystore before, creating this certificate will create it automatically.

We could also execute the `-genkeypair` option without parameters.
If we don't provide them in the command line, and they're mandatory, we'll be prompted for them.

**Note that it's generally advised not to provide the passwords (`-keypass` or `-storepass`)
on the command line in production environments.**

## Listing Certificates in the Keystore

Next, we're going to learn how to view the certificates that are stored in our keystore.
For this purpose, we'll use the `-list` option:

```text
keytool -list -storepass <storepass>
```

The output for the executed command will show the certificate that we've created:

```text
Keystore type: JKS
Keystore provider: SUN

Your keystore contains 1 entry

cert1, 02-ago-2020, PrivateKeyEntry, 
Certificate fingerprint (SHA1): 0B:3F:98:2E:A4:F7:33:6E:C4:2E:29:72:A7:17:E0:F5:22:45:08:2F
```

If we want to get the information for a concrete certificate,
we just need to include the `-alias` option to our command.
To get further information than provided by default, we'll also add the `-v` (verbose) option:

```text
keytool -list -v -alias <alias> -storepass <storepass>
```

This will provide us all the information related to the requested certificate:

```text
Alias name: cert1
Creation date: 02-ago-2020
Entry type: PrivateKeyEntry
Certificate chain length: 1
Certificate[1]:
Owner: CN=Name, OU=Unit, O=Company, L=City, ST=State, C=US
Issuer: CN=Name, OU=Unit, O=Company, L=City, ST=State, C=US
Serial number: 11d34890
Valid from: Sun Aug 02 20:25:14 CEST 2020 until: Mon Aug 02 20:25:14 CEST 2021
Certificate fingerprints:
	 MD5:  16:F8:9B:DF:2C:2F:31:F0:85:9C:70:C3:56:66:59:46
	 SHA1: 0B:3F:98:2E:A4:F7:33:6E:C4:2E:29:72:A7:17:E0:F5:22:45:08:2F
	 SHA256: 8C:B0:39:9F:A4:43:E2:D1:57:4A:6A:97:E9:B1:51:38:82:0F:07:F6:9E:CE:A9:AB:2E:92:52:7A:7E:98:2D:CA
Signature algorithm name: SHA256withDSA
Subject Public Key Algorithm: 2048-bit DSA key
Version: 3

Extensions: 

#1: ObjectId: 2.5.29.14 Criticality=false
SubjectKeyIdentifier [
KeyIdentifier [
0000: A1 3E DD 9A FB C0 9F 5D   B5 BE 2E EC E2 87 CD 45  .>.....].......E
0010: FE 0B D7 55                                        ...U
]
]
```

## Other Features

Apart from the functionalities that we've already seen,
there are many additional features available in this tool.

For example, we can **delete the certificate** we created from the keystore:

```text
keytool -delete -alias <alias> -storepass <storepass>
```

Another example is that we will even be able to **change the alias of a certificate**:

```text
keytool -changealias -alias <alias> -destalias <new_alias> -keypass <keypass> -storepass <storepass>
```

Finally, to get more information about the tool, we can ask for help through the command line:

```text
keytool -help
```

## Best Practice

A complete command for generating a key pair is one
that uses the `genkeypair`, `alias`, `keypass`, `storepass` and `dname` arguments.
For example.

Windows:

```text
keytool -genkeypair ^
-alias lsieun.com -keypass myKeyPass ^
-dname "CN=Sen Liu, OU=IT, O=LSIEUN Software Corp, L=BaoDing, S=HeBei, C=CN" ^ 
-keystore D:\tmp\myStore ^
-storepass myStorePass
```

Linux:

```text
$ keytool -genkeypair -keyalg RSA -keysize 2048 -validity 365 -alias email4 -keypass myPassword -dname "CN=JoeSample, OU=IT, O=Brain Software Corp, L=Surrey, S=BC, C=CA" -storepass myPassword
```

```text
keytool -certreq -alias lsieun.com -file D:\tmp\mycert.csr
```

```text
keytool -exportcert -alias lsieun.com -file D:\tmp\mycert.cer
```

## Reference

- [Oracle: keytool](https://docs.oracle.com/en/java/javase/11/tools/keytool.html)
- [Introduction to keytool](https://www.baeldung.com/keytool-intro)
