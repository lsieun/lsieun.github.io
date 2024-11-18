---
title: "Jekyll PlantUML"
sequence: "103"
---

## 操作

第 1 步，在 `_includes` 添加如下文件：

- [plantuml.liquid](https://github.com/RichDom2185/jekyll-plantuml/blob/main/_includes/plantuml.liquid):
  The main parser to generate the PlantUML diagrams
- [capturehtml.liquid](https://github.com/RichDom2185/jekyll-plantuml/blob/main/_includes/capturehtml.liquid):
  Un-escapes HTML special characters, used to parse HTML tags inside pre-formatted code blocks

第 2 步，在 `_layouts/post.html` 文件添加如下内容：

```html
{% capture content %}{% include plantuml.liquid html=content %}{% endcapture %}
<!-- Some other stuff... -->
{{ content }}
```

第 3 步，使用：

{% highlight text %}
{% raw %}
```plantuml
Alice -> Bob: Hi there!
Bob --> Alice: Hello to you too!
```
{% endraw %}
{% endhighlight %}

## Reference

- [RichDom2185/jekyll-plantuml](https://github.com/RichDom2185/jekyll-plantuml)


