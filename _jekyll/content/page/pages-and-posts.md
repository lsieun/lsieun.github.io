---
title: "Pages and Posts"
sequence: "102"
---

[UP](/jekyll/jekyll-index.html)

The main types of content for Jekyll sites are **pages** and **posts**.

## Page

A page is for standalone content that isn't associated with a specific date, such as an "About" page.

The default Jekyll site contains a file called `about.md`,
which renders as a page on your site at `YOUR-SITE-URL/about`.

For more information, see "[Pages](https://jekyllrb.com/docs/pages/)" in the Jekyll documentation.

## Post

A post is a blog post.

The default Jekyll site contains a directory named `_posts` that contains a default post file.

For more information, see "[Posts](https://jekyllrb.com/docs/posts/)" in the Jekyll documentation.

## Adding a new page to your site

In the root of your publishing source,
create a new file for your page called `PAGE-NAME.md`,
replacing `PAGE-NAME` with a meaningful filename for the page.

Add the following **YAML front matter** to the top of the file,
replacing `PAGE TITLE` with the page's title and `URL-PATH` with a path you want for the page's URL.

{% highlight liquid %}
layout: page
title: "PAGE TITLE"
permalink: /URL-PATH/
{% endhighlight %}

For example, if the base URL of your site is `https://octocat.github.io` and your `URL-PATH` is `/about/contact/`,
your page will be located at `https://octocat.github.io/about/contact`.

## Adding a new post to your site

Navigate to the `_posts` directory.

Create a new file called `YYYY-MM-DD-NAME-OF-POST.md`,
replacing `YYYY-MM-DD` with the date of your post and `NAME-OF-POST` with the name of your post.

Add the following **YAML front matter** to the top of the file,
replacing `POST TITLE` with the post's title,
`YYYY-MM-DD hh:mm:ss -0000` with the date and time for the post,
and `CATEGORY-1` and `CATEGORY-2` with as many categories you want for your post.

{% highlight liquid %}
layout: post
title: "POST TITLE"
date: YYYY-MM-DD hh:mm:ss -0000
categories: CATEGORY-1 CATEGORY-2
{% endhighlight %}
