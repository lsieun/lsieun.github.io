---
title: "Liquid: Filters"
categories: jekyll
---

[UP](/jekyll/jekyll-index.html)

## Jekyll Liquid Filters



## Standard Liquid Filters

### default

Allows you to specify a fallback in case a value doesn't exist. `default` will show its value if the left side is `nil`, `false`, or empty.

In this example, `product_price` is not defined, so the default value is used.

Input:（第一种情况，没定义的情况）

{% highlight liquid %}
{% raw %}
{{ product_price | default: 2.99 }}
{% endraw %}
{% endhighlight %}

Output:

{% highlight text %}
{% raw %}
2.99
{% endraw %}
{% endhighlight %}

In this example, `product_price` is defined, so the default value is not used.

Input:（第二种情况，已经定义的情况）

{% highlight liquid %}
{% raw %}
{% assign product_price = 4.99 %}
{{ product_price | default: 2.99 }}
{% endraw %}
{% endhighlight %}

Output:

{% highlight text %}
{% raw %}
4.99
{% endraw %}
{% endhighlight %}

In this example, `product_price` is empty, so the default value is used.

Input:（第三种情况，已经定义，但内容为空）

{% highlight liquid %}
{% raw %}
{% assign product_price = "" %}
{{ product_price | default: 2.99 }}
{% endraw %}
{% endhighlight %}

Output:

{% highlight text %}
{% raw %}
2.99
{% endraw %}
{% endhighlight %}

### escape

Escapes a string by replacing characters with escape sequences (so that the string can be used in a URL, for example).
It doesn't change strings that don't have anything to escape.

{% highlight java %}
{% raw %}
{{ "Have you read 'James & the Giant Peach'?" | escape }}
{% endraw %}
{% endhighlight %}

Output:

{% highlight text %}
{% raw %}
Have you read &#39;James &amp; the Giant Peach&#39;?
{% endraw %}
{% endhighlight %}

## References

- [jekyllrb: Liquid Filters](https://jekyllrb.com/docs/liquid/filters/)
- [Github: Liquid](https://shopify.github.io/liquid/)
