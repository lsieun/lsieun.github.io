---
title: "Front Matter"
sequence: "101"
---

[UP](/jekyll/jekyll-index.html)

Any file that contains a YAML front matter block will be processed by Jekyll as a special file.

The front matter must be the first thing in the file and must take the form of valid YAML set between **triple-dashed lines**.

Here is a basic example:

{% highlight text %}
---
layout: post
title: Blogging Like a Hacker
---
{% endhighlight %}

Between these triple-dashed lines, you can set **predefined variables** or even create **custom ones** of your own.
These variables will then be available for you to access using [Liquid tags]({% link _jekyll/liquid/liquid-tags.md %})
both further down in the **file** and also in any **layouts** or **includes** that the page or post in question relies on.

## Predefined Variables

### Predefined Global Variables

There are a number of **predefined global variables** that you can set in the front matter of a **page** or **post**.

- `layout`: If set, this specifies the layout file to use.
  **Use the layout file name without the file extension.**
  Layout files must be placed in the `_layouts` directory.
  Using `null` will produce a file without using a layout file.
  This is overridden if the file is a post/document and has a layout defined in the [front matter defaults]({% link _jekyll/content/front/front-matter-defaults.md %}).
- `permalink`: If you need your processed blog post URLs to be something other than the site-wide style (default `/year/month/day/title.html`),
  then you can set this variable, and it will be used as the final URL.
- `published`: Set to `false` if you don't want a specific post to show up when the site is generated.

> Render Posts Marked As Unpublished  
> To preview unpublished pages, run `jekyll serve` or `jekyll build` with the `--unpublished` switch.

Jekyll also has a handy [drafts]({% link _jekyll/content/page/post-drafts.md %}) feature tailored specifically for blog posts.

### Predefined Variables for Posts

These are available out-of-the-box to be used in the front matter for a post.

- `date`: A date here overrides the date from the name of the post.
  This can be used to ensure correct sorting of posts.
  A date is specified in the format `YYYY-MM-DD HH:MM:SS +/-TTTT`;
  hours, minutes, seconds, and timezone offset are optional.
- `category`/`categories`: Instead of placing posts inside of folders,
  you can specify one or more categories that the post belongs to.
  When the site is generated the post will act as though it had been set with these categories normally.
  Categories (plural key) can be specified as a [YAML list](https://en.wikipedia.org/wiki/YAML#Basic_components) or a **space-separated string**.
- `tags`: Similar to `categories`, one or multiple tags can be added to a post.
  Also like `categories`, `tags` can be specified as a [YAML list](https://en.wikipedia.org/wiki/YAML#Basic_components) or a **space-separated string**.

## Custom Variables

You can also set your own front matter variables you can access in Liquid.

For instance, if you set a variable called `food`, you can use that in your page:

{% highlight java %}
{% raw %}
---
food: Pizza
---

<h1>{{ page.food }}</h1>
{% endraw %}
{% endhighlight %}

## Don't repeat yourself  
If you don't want to repeat your frequently used **front matter variables** over and over,  
define [defaults]({% link _jekyll/content/front/front-matter-defaults.md %}) for them and only override them where necessary (or not at all).  
This works both for **predefined** and **custom variables**.

## References

- [jekyllrb: Front Matter](https://jekyllrb.com/docs/front-matter/)