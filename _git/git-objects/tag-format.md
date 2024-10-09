---
title: "git objects: tag format"
---

[UP](/git/git-index.html)


The content of a tag object is as follows:

```text
object <commit-sha1>
type commit
tag <tag-name>
tagger <author-with-timestamp>

<tag-message>
```
