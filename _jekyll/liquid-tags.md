---
title:  "Liquid: Tags"
categories: jekyll
---

[UP]({% link _posts/2021-04-20-jekyll-cheat-sheet.md %})

## Control flow

### if

Executes a block of code only if a certain condition is `true`.

Input:（判断两个值是否相等）

{% highlight liquid %}
{% raw %}
{% if product.title == "Awesome Shoes" %}
  These shoes are awesome!
{% endif %}
{% endraw %}
{% endhighlight %}

Output:

{% highlight text %}
{% raw %}
These shoes are awesome!
{% endraw %}
{% endhighlight %}

Another Example:（判断一个值是否为空）

{% highlight liquid %}
{% raw %}
{%- if page.title -%}
  <h1 class="page-heading">{{ page.title }}</h1>
{%- endif -%}
{% endraw %}
{% endhighlight %}

## References

- [Github: Liquid](https://shopify.github.io/liquid/)
