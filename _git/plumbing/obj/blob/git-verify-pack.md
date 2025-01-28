---
title: "git verify-pack"
sequence: "102"
---

[UP](/git/git-index.html)


```bash
$ $ git verify-pack -v .git/objects/pack/pack-6e226ea29a3891991819463824eee83d0f588ee8.pack
dcded94392fb60d6575827e506917cb8214dd4fd commit 639 500 12
beac5622f7f675eb0a44fb546c9a1e8084ca99d6 tree   110 115 512
a1c2a238a965f004ff76978ac1086aa6fe95caea blob   278 209 627
55ddb8deb18592a80d41dc178f77c293329563b4 blob   1063 632 836
ccdd7896696872982841a74e9b040013d7154ad9 blob   32 40 1468
non delta: 5 objects
.git/objects/pack/pack-6e226ea29a3891991819463824eee83d0f588ee8.pack: ok
```
