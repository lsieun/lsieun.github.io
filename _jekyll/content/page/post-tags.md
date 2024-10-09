---
title: "Post: Tags"
sequence: "106"
---

[UP](/jekyll/jekyll-index.html)

Jekyll has first class support for `tags` and `categories` in blog posts.

Tag feature basically consists of three abilities:

- a) adding tags to posts,
- b) displaying all tags, with posts count and
- c) browsing posts by tag.

## Adding tags to posts

Tags for a post are defined in the post's **front matter** using either the key `tag` for a single entry or `tags` for multiple entries.

Since Jekyll expects multiple items mapped to the key `tags`,
it will automatically split a string entry if it contains whitespace.
For example, while front matter `tag: classic hollywood` will be processed into a singular entity `"classic hollywood"`,
front matter `tags: classic hollywood` will be processed into an array of entries `["classic", "hollywood"]`.

Irrespective of the front matter key chosen(`tag` or `tags`),
Jekyll stores the metadata mapped to the plural key which is exposed to Liquid templates.



## Displaying Tags

### displaying tags on a post

{% highlight liquid %}
{% raw %}
{% if page.tags.size > 0 %}
{% for tagName in page.tags %}
- {{ tagName }}
{% endfor %}
{% endif %}
{% endraw %}
{% endhighlight %}

### displaying all tags in a site

Jekyll offers global array `site.tags` which contains information on all the tags.

Each element is an array as follows: `[0]` - tag name and `[1]` - all posts for the tag.

{% highlight liquid %}
{% raw %}
{% if site.tags.size > 0 %}
<ul>
    {% for tag in site.tags %}
    {% assign tagName = tag | first | downcase %}
    {% assign postsCount = tag | last | size %}
    <li><a href="/tags?tagName={{ tagName }}">{{ tagName }}</a>({{ postsCount }})</li>
    {% endfor %}
</ul>
{% endif %}
{% endraw %}
{% endhighlight %}

示例如下：

<div class="div-block">
{% if site.tags.size > 0 %}
<ul>
    {% for tag in site.tags %}
    {% assign tagName = tag | first | downcase %}
    {% assign postsCount = tag | last | size %}
    <li><a href="/tags?tagName={{ tagName }}">{{ tagName }}</a>({{ postsCount }})</li>
    {% endfor %}
</ul>
{% endif %}
</div>

All tags registered in the current site are exposed to Liquid templates via `site.tags`.
Iterating over `site.tags` on a page will yield another array with two items,
where the **first item** is **the name of the tag** and the **second item** being **an array of posts with that tag**.

{% highlight liquid %}
{% raw %}
{% for tag in site.tags %}
  <p>{{ tag[0] }}</p>
  <ul>
    {% for post in tag[1] %}
      <li><a href="{{ post.url }}">{{ post.title }}</a></li>
    {% endfor %}
  </ul>
{% endfor %}
{% endraw %}
{% endhighlight %}

示例如下：

<div class="div-block">
{% for tag in site.tags %}
  <p>{{ tag[0] }}</p>
  <ul>
    {% for post in tag[1] %}
      <li><a href="{{ post.url }}">{{ post.title }}</a></li>
    {% endfor %}
  </ul>
{% endfor %}
</div>

## Browsing posts by tag



## References

- [jekyllrb: Posts](https://jekyllrb.com/docs/posts/#tags)
- [Implementing tags in Jekyll](https://medium.com/dan-on-coding/implementing-tags-in-jekyll-4bafe41002db)
