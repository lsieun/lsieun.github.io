---
title: "Liquid: Tags(if)"
categories: jekyll
---

[UP](/jekyll/jekyll-index.html)

## Basic operators

- `==`: equals
- `!=`: does not equal
- `>`: greater than
- `<`: less than
- `>=`: greater than or equal to
- `<=`: less than or equal to
- `or`: logical or
- `and`: logical and

## Control flow

### if

Executes a block of code only if a certain condition is `true`.

#### equal

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

#### exist

Another Example:（判断一个值是否为空）

{% highlight liquid %}
{% raw %}
{%- if page.title -%}
  <h1 class="page-heading">{{ page.title }}</h1>
{%- endif -%}
{% endraw %}
{% endhighlight %}

#### contains

`contains` checks for the presence of a substring inside a string.

{% highlight liquid %}
{% raw %}
{% if product.title contains "Pack" %}
  This product's title contains the word Pack.
{% endif %}
{% endraw %}
{% endhighlight %}

`contains` can also check for the presence of a string in an array of strings.

{% highlight liquid %}
{% raw %}
{% if product.tags contains "Hello" %}
  This product has been tagged with "Hello".
{% endif %}
{% endraw %}
{% endhighlight %}

`contains` can only search strings. You cannot use it to check for an object in an array of objects.

#### multi

You can do multiple comparisons in a tag using the `and` and `or` operators:

{% highlight liquid %}
{% raw %}
{% if product.type == "Shirt" or product.type == "Shoes" %}
  This is a shirt or a pair of shoes.
{% endif %}
{% endraw %}
{% endhighlight %}

## References

- [Github: Liquid](https://shopify.github.io/liquid/)
