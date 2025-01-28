---
title: "Post: Excerpts"
sequence: "104"
---

[UP](/jekyll/jekyll-index.html)

You can access a snippet of a posts's content by using `excerpt` variable on a post.

By default this is the first paragraph of content in the post,  
however it can be customized by setting a `excerpt_separator` variable in **front matter** or `_config.yml`.

{% highlight liquid %}
{% raw %}
---
excerpt_separator: <!--more-->
---

Excerpt with multiple paragraphs

Here's another paragraph in the excerpt.
<!--more-->
Out-of-excerpt
{% endraw %}
{% endhighlight %}

Here's an example of outputting a list of blog posts with an excerpt:

{% highlight liquid %}
{% raw %}
<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
      {{ post.excerpt }}
    </li>
  {% endfor %}
</ul>
{% endraw %}
{% endhighlight %}
