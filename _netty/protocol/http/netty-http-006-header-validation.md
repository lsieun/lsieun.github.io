---
title: "Http header validation"
sequence: "106"
---

[UP](/netty.html)


Header Validation
It is recommended to always enable header validation.
Without header validation, your system can become vulnerable to CWE-113:
Improper Neutralization of CRLF Sequences in HTTP Headers ('HTTP Response Splitting')  

```text
https://cwe.mitre.org/data/definitions/113.html
```
