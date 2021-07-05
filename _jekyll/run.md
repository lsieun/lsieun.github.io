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
$ bundle exec jekyll serve --detach --host 10.0.8.4 --port 80
# 使用https协议
$ bundle exec jekyll serve --detach --host 10.0.8.4 --port 443 --ssl-key private.key --ssl-cert cert.pem
{% endhighlight %}

{% highlight text %}
pkill -f jekyll
kill -9 process_id
{% endhighlight %}

