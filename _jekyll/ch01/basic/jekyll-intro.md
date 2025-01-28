---
title: "Jekyll 介绍"
sequence: "101"
---

[UP](/jekyll/jekyll-index.html)

## Bundler

**Bundler** provides a consistent environment for Ruby projects
by tracking and installing the exact gems and versions that are needed.

```text
Ruby --> Bundler --> gems
```

To install Bundler:

- First, Install Ruby.
- Second, Install Bundler

## Jekyll

Bundler manages Ruby gem dependencies, reduces Jekyll build errors, and prevents environment-related bugs.

```text
Ruby --> Bundler --> gems --> Jekyll
```

Run your Jekyll site locally.

```text
$ bundle exec jekyll serve
```

```text
$ bundle exec jekyll build --drafts --unpublished --incremental --watch
```
