---
title: "Variables: Page"
categories: jekyll
---

[UP](/jekyll/jekyll-index.html)

## ID

- `page.id`: An identifier unique to a document in a Collection or a Post (useful in RSS feeds). e.g. `/2008/12/14/my-post/my-collection/my-document`

## 主体信息

- `page.title`: The title of the Page.
- `page.excerpt`: The un-rendered excerpt of a document.
- `page.content`: The content of the Page, rendered or un-rendered depending upon what Liquid is being processed and what `page` is.

## URL

- `page.url`: The URL of the Post without the domain, but with a leading slash, e.g. `/2008/12/14/my-post.html`
- `page.path`: The path to the raw post or page.
  Example usage: Linking back to the page or post's source on GitHub.
  This can be overridden in the front matter.
- `page.dir`: The path between the source directory and the file of the post or page, e.g. `/pages/`.
  This can be overridden by `permalink` in the front matter.
- `page.name`: The filename of the post or page, e.g. `about.md`


Example:

- page.url: {{ page.url }}
- page.path: {{ page.path }}  
- page.dir: {{ page.dir }}
- page.name: {{ page.name }}


## Time

- `page.date`: The Date assigned to the Post.
  This can be overridden in a Post's front matter by specifying a new date/time in the format `YYYY-MM-DD HH:MM:SS` (assuming UTC),
  or `YYYY-MM-DD HH:MM:SS +/-TTTT` (to specify a time zone using an offset from UTC. e.g. `2008-12-14 10:30:00 +0900`).

## 目录/分类/标签

- `page.categories`: The list of categories to which this post belongs.
  Categories are derived from the directory structure above the `_posts` directory.
  For example, a post at `/work/code/_posts/2008-12-24-closures.md` would have this field set to `['work', 'code']`.
  These can also be specified in the front matter.
- `page.collection`: The label of the collection to which this document belongs. e.g. `posts` for a post,
  or `puppies for` a document at path `_puppies/rover.md`.
  If not part of a collection, an empty string is returned.
- `page.tags`: The list of tags to which this post belongs. These can be specified in the front matter.
