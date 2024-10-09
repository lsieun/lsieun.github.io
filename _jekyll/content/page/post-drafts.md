---
title: "Post: Drafts"
sequence: "103"
---

[UP](/jekyll/jekyll-index.html)

## folder and filename

Drafts are posts without a date in the filename. They're posts you're still working on and don't want to publish yet.

To get up and running with drafts, create a `_drafts` folder in your site's root and create your first draft:

{% highlight text %}
.
├── _drafts
│   └── a-draft-post.md
...
{% endhighlight %}

## run

To preview your site with drafts, run `jekyll serve` or `jekyll build` with the `--drafts` switch.

## Time

Each will be assigned the value modification time of the draft file for its `date`, and thus you will see currently edited drafts as the latest posts.

## References

- [jekyllrb: Posts](https://jekyllrb.com/docs/posts/#drafts)
