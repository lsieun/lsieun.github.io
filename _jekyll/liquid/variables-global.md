---
title: "Variables: Global"
categories: jekyll
---

[UP](/jekyll/jekyll-index.html)

- `site`: Site wide information + configuration settings from `_config.yml`.
  See [Site Variables]({% link _jekyll/liquid/variables-site.md %}) details.
- `page`: Page specific information + the front matter.
  Custom variables set via the front matter will be available here.
  See below for details.
- `layout`: Layout specific information + the front matter.
  Custom variables set via front matter in layouts will be available here.
- `content`: In layout files, the rendered content of the Post or Page being wrapped.
  Not defined in Post or Page files.
- `paginator`: When the `paginate` configuration option is set, this variable becomes available for use. See Pagination for details.
