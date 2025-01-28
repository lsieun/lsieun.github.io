---
title: "Secure Sockets Layer (SSL)"
sequence: "103"
---

Originally developed by Netscape, the SSL protocol enables secure communications over the Internet and
at the same time ensures the **confidentiality** and **data integrity**.

To fully understand how SSL works, there are a number of technologies that you need to learn,
from **cryptography** to **private and public key pairs** to **certificates**.

## Cryptography

From time to time there has always been a need for secure communication channels, i.e.
where messages are safe and other parties cannot understand
and tamper with the messages even if they can get access to them.

**Historically, cryptography was only concerned with encryption and decryption**,
where two parties exchanging messages can be rest assured that
only they can read the messages.
In the beginning, people encrypted and decrypted messages using **symmetric cryptography**.
In symmetric cryptography, you use the same key to encrypt and decrypt messages.
Here is a very simple encryption/decryption technique.

Suppose, the encryption method uses a secret number to shift forward each character in the alphabet.
Therefore, if the secret number is `2`, the encrypted version of "ThisFriday" is "VjkuHtkfca".
When you reach the end of the alphabet, you start from the beginning, therefore `y` becomes `a`.
The receiver, knowing the key is `2`, can easily decrypt the message.

However, symmetric cryptography requires that both parties know in advance the key for encryption/decryption.
Symmetric cryptography is not suitable for the Internet for the following reasons

- Two people exchanging messages often do not know each other.
  For example, when buying a book at Amazon.com you need to send your particulars and credit card details.
  If symmetric cryptography was to be used, you would have to call Amazon.com prior to the transaction to agree on a
  key.
- Everyone wants to be able to communicate with many other parties.
  If symmetric cryptography was used, everyone would have to maintain different unique keys, each for a different party.
- Since you do not know the entity you are going to communicate with,
  you need to be sure that they are really who they claim to be.
- Messages over the Internet pass through many different computers.
  It is fairly trivial to tap other people's messages.
  Symmetric cryptography does not guarantee that a third party may not tamper with the data.

Therefore, today secure communication over the Internet uses asymmetric cryptography that offers these three features:

- encryption/decryption. Messages are encrypted to hide the messages from third parties.
  Only the intended receiver can decrypt them.
- authentication. Authentication verifies that an entity is who it claims to be.
- data integrity. Messages sent over the Internet pass many computers.
  It must be ensured that the data sent is unchanged and intact.

In asymmetric cryptography, public key encryption is used.
With this type of encryption, data encryption and decryption is achieved
through the use of a pair of asymmetric keys: a public key and a private key.
A private key is private.
The owner must keep it in a secure place, and it must not fall into the possession of any other party.
A public key is to be distributed to the public,
usually downloadable by anyone who would like to communicate with the owner of the keys.
You can use tools to generate pairs of public keys and private keys.

The beauty of public key encryption is this:
data encrypted using a public key can only be decrypted using the corresponding private key;
at the same token data encrypted using a private key can only be decrypted using the corresponding public key.
This elegant algorithm is based on very large prime numbers and was invented
by Ron Rivest, Adi Shamir, and Len Adleman at Massachusetts Institute of Technology (MIT) in 1977.
They simply called the algorithm RSA, based on the initials of their last names.

The RSA algorithm proves to be practical for use on the Internet,
especially for e-commerce, because only the vendor is required to have a
key pair for secure communications with all its buyers.

## Encryption/Decryption

One of the two parties who want to exchange messages must have a pair of keys.
Suppose Alice wants to communicate with Bob and Bob has a public key and a private key.
Bob will send Alice his public key and Alice can use it to encrypt messages sent to Bob.
Only Bob can decrypt them because he owns the corresponding private key.
To send a message to Alice, Bob encrypts it using his private key and
Alice can decrypt it using Bob's public key.

However, unless Bob can meet with Alice in person to hand over his public key, this method is far from perfect.
Anybody with a pair of keys can claim to be Bob and there is no way Alice can find out.
On the Internet, where two parties exchanging messages often live half a globe away,
meeting in person is often not possible.

## Authentication

In SSL, authentication is addressed by introducing certificates.
A certificate contains the following:

- a public key
- information about the subject, i.e. the owner of the public key.
- the certificate issuer's name.
- some timestamp to make the certificate expire after a certain period of time.

The crucial thing about a certificate is that it must be digitally signed by a
trusted certificate issuer, such as VeriSign or Thawte.
To digitally sign an electronic file (a document, a jar file, etc)
is to add your signature to your document/file.
The original file is not encrypted, and the real purpose of signing is
to guarantee that the document/file has not been tampered with.
Signing a document involves creating a digest of the document and
encrypting the digest using the signer's private key.
To check if the document is still in its still original condition, you perform these two steps.

1. Decrypt the digest accompanying the document using the signer's public key.
   You will soon learn that the public key of a trusted certificate issuer is widely available.
2. Create a digest of the document.
3. Compare the result of Step 1 and the result of Step 2.
   If the two match, then the file has not been tampered with.

Such authentication method works because only the holder of the private key can encrypt the document digest,
and this digest can only be decrypted using the corresponding public key.
Assuming you trust that you hold the original public key, then you know that the file has not been changed.

## Data Integrity

Mallet, a malicious party, could be sitting between Alice and Bob, trying to decipher the messages being sent.
Unfortunately for him, even though he could copy the messages,
they are encrypted and Mallet does not know the key.
However, Mallet could still destroy the messages or not relay some of them.
To overcome this, SSL introduces a **message authentication code** (**MAC**).
A MAC is a piece of data that is computed by using a secret key and some transmitted data.
Because Mallet does not know the secret key, he cannot compute the right value for the digest.
The message receiver can and therefore will discover
if there is an attempt to tamper with the data, or if the data is not complete.
If this happens, both parties can stop communicating.

One of such message digest algorithm is MD5.
It is invented by RSA and is very secure.
If 128-bit MAC values are employed, for example,
the chance of a malicious party's of guessing the right value is about 1 in
18,446,744,073,709,551,616, or practically never.

## How SSL Works



