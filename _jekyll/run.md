---
title:  "Run"
categories: jekyll
---

[UP]({% link _posts/2021-04-20-jekyll-cheat-sheet.md %})

{% highlight bash %}
# 运行
$ bundle exec jekyll serve
# 后台运行
$ bundle exec jekyll serve --detach
# 在80端口运行
$ bundle exec jekyll serve --detach --port 80
# 使用https协议
$ bundle exec jekyll serve --detach --ssl-key private.key --ssl-cert cert.pem
{% endhighlight %}
