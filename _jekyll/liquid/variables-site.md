---
title: "Variables: Site"
categories: jekyll
---

[UP](/jekyll/jekyll-index.html)

## CONFIGURATION_DATA

- `site.[CONFIGURATION_DATA]`: All the variables set via the command line and your `_config.yml` are available through the site variable.
  For example, if you have `foo: bar` in your configuration file, then it will be accessible in Liquid as `site.foo`.
  Jekyll does not parse changes to `_config.yml` in `watch` mode, you must restart Jekyll to see changes to variables.

## URL

- `site.url`: Contains the url of your site as it is configured in the `_config.yml`.
  For example, if you have `url: http://mysite.com` in your configuration file, then it will be accessible in Liquid as `site.url`.
  For the development environment there is an exception,
  if you are running `jekyll serve` in a development environment `site.url` will be set to the value of `host`, `port`, and SSL-related options.
  This defaults to `url: http://localhost:4000`.

## Pages and Posts

### Pages

- `site.pages`: A list of all Pages.
- `site.html_pages`: A subset of `site.pages` listing those which end in `.html`.

### Posts

- `site.posts`: A reverse chronological list of all Posts.
- `site.related_posts`: If the page being processed is a Post, this contains a list of up to ten related Posts.
  By default, these are the ten most recent posts.
  For high quality but slow to compute results, run the `jekyll` command with the `--lsi` (latent semantic indexing) option.
  Also note **GitHub Pages does not support** the `lsi` option when generating sites.

### Other

- `site.static_files`: A list of all static files (i.e. files not processed by Jekyll's converters or the Liquid renderer).
  Each file has five properties: `path`, `modified_time`, `name`, `basename` and `extname`.
- `site.documents`: A list of all the documents in every collection.
- `site.html_files`: A subset of `site.static_files` listing those which end in `.html`.

## Collections

- `site.collections`: A list of all the collections (including posts).

## Data

- `site.data`: A list containing the data loaded from the YAML files located in the `_data` directory.

## Time

- `site.time`: The current time (when you run the `jekyll` command).

## 分类

- `site.categories.CATEGORY`: The list of all Posts in category `CATEGORY`.
- `site.tags.TAG`: The list of all Posts with tag `TAG`.
