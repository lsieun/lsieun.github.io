---
title: "Link"
sequence: "101"
---

[UP](/jekyll/jekyll-index.html)

## Liquid Tags

Since Jekyll 4.0, you don't need to prepend `link` and `post_url` tags with `site.baseurl`.

### Linking to pages

To link to a post, a page, collection item, or file,
the `link` tag will generate the correct permalink URL for the path you specify.

For example, if you use the `link` tag to link to `mypage.html`,
even if you change your permalink style to include the file extension or omit it,
the URL formed by the `link` tag will always be valid.

You must include the **file's original extension** when using the `link` tag.
Here are some examples:

{% highlight plaintext %}
{% raw %}
{% link _collection/name-of-document.md %}
{% link _posts/2016-07-26-name-of-post.md %}
{% link news/index.html %}
{% link /assets/files/doc.pdf %}
{% endraw %}
{% endhighlight %}

You can also use the `link` tag to create a link in Markdown as follows:

{% highlight plaintext %}
{% raw %}
[Link to a document]({% link _collection/name-of-document.md %})
[Link to a post]({% link _posts/2016-07-26-name-of-post.md %})
[Link to a page]({% link news/index.html %})
[Link to a file]({% link /assets/files/doc.pdf %})
{% endraw %}
{% endhighlight %}

The path to the **post**, **page**, or **collection** is defined as the path relative to the **root directory**
(where your config file is) to the file, not the path from your existing page to the other page.

> 这里**post**、**page**和**collection**的link是相对于**root directory**的路径。

For example, suppose you're creating a link in `page_a.md` (stored in `pages/folder1/folder2`) to `page_b.md` (stored in `pages/folder1`).
Your path in the link would not be `../page_b.html`. Instead, it would be `/pages/folder1/page_b.md`.

### Display the path

If you're unsure of the path, add `{% raw %}{{ page.path }}{% endraw %}` to the page and it will display the path.

### Linking to posts

If you want to include a link to a **post** on your site,
the `post_url` tag will generate the correct permalink URL for the post you specify.

{% highlight liquid %}
{% raw %}
{% post_url 2010-07-21-name-of-post %}
{% endraw %}
{% endhighlight %}

If you organize your posts in **subdirectories**, you need to include subdirectory path to the post:

{% highlight liquid %}
{% raw %}
{% post_url /subdir/2010-07-21-name-of-post %}
{% endraw %}
{% endhighlight %}

There is **no need** to include the **file extension** when using the `post_url` tag.

You can also use this tag to **create a link** to a post in Markdown as follows:

{% highlight liquid %}
{% raw %}
[Name of Link]({% post_url 2010-07-21-name-of-post %})
{% endraw %}
{% endhighlight %}

## References

- [jekyllrb: Liquid Tags](https://jekyllrb.com/docs/liquid/tags/)
