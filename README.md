# lsieun.github.io

[![Jekyll](https://img.shields.io/badge/built_for-Jekyll-red.svg)](https://jekyllrb.com/)
[![lsieun.github.io](https://img.shields.io/website/https/lsieun.github.io.svg?label=lsieun.github.io)](https://lsieun.github.io)

## Run

```shell
bundle exec jekyll serve
```

```shell
bundle exec jekyll serve --unpublished --drafts
```

## Code

```text
{% highlight java %}
{% raw %}

{% endraw %}
{% endhighlight %}
```

```text
{% highlight text %}

{% endhighlight %}
```

```text
{% highlight text %}
{% raw %}

{% endraw %}
{% endhighlight %}
```

```plantuml
@startmindmap

* MindMap

@endmindmap
```

```text
![My Image]({{ site.baseimg }}/images/example1.png)
```

```html
<table>
    <thead>
    <tr>
        <th style="text-align: center;">Basic</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td></td>
    </tr>
    </tbody>
</table>
```

根据 `item.path` 划分目录：

```text
{%
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/api/basic/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
```

根据 `item.url` 划分目录：

```text
{%
assign filtered_posts = site.java-theme |
where_exp: "item", "item.url contains '/java-theme/lambda/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
```

## 课程更新

- [ ] Git仓库的README文件
- [ ] 本网站的`about.markdown`页面的课程列表要更新
- [ ] 本网站的每个课程的页面，要指向视频的地址和代码的地址
