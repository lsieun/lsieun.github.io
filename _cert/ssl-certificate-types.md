---
title: "SSL Certificate Types"
sequence: "ssl-certificate-type"
---

## Single Domain SSL Certificate

This type is meant to be used for a **single domain** and offers **no support for subdomains**.
For example, if the certificate is to be used for `www.phoenixnap.com`,
it will not support any other domain name.

## Multiple Domain (SAN/UC Certificates)

Multiple domain certificates are used for **numerous domains and subdomains**.
Besides the FQDN, you can add support for other (sub)domains by adding them to the Subject Alternative Name Field.
For example, a SAN certificate can include the domain `www.phoenixnap.com`,
its subdomain `help.phoenixnap.com` as well as another domain (e.g., `www.examplesite.com`).

## Wildcard Certificate

Wildcard certificates can be used for a **domain**, including **all of its subdomains**.
The main difference is that instead of it being issued for a specific FQDN,
wildcard certificates are used for a wide range of subdomains.

For example, a wildcard certificate issued to `*.phoenixnap.com` could be used for a wide range of subdomains
under the main `www.phoenixnap.com` domain.
