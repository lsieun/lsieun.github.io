---
title: "Jekyll 安装（CentOS 7）"
sequence: "centos07"
---

[UP](/jekyll/jekyll-index.html)

## Install Ruby

### CentOS 7.6

默认安装的是ruby 2.0，但是jekyll要求ruby的版本在2.4以上

于是，我找到了这个[How to Install Ruby on CentOS/RHEL 7/6](https://tecadmin.net/install-ruby-latest-stable-centos/)文章。

### Check Ruby Version

{% highlight bash %}
$ ruby --version
ruby 2.7.2p137 (2020-10-01 revision 5445e04352) [x86_64-linux]
$ gem --version
3.1.4
{% endhighlight %}

## Install Jekyll

Install Jekyll and Bundler:

{% highlight bash %}
$ gem install jekyll bundler
{% endhighlight %}

Check if Jekyll has been installed properly:

{% highlight bash %}
$ jekyll -v
jekyll 4.2.0
{% endhighlight %}

## Run Jekyll

CentOS 7.6

{% highlight bash %}
$ bundle exec jekyll serve --detach
$ bundle exec jekyll serve --detach --port 80
$ bundle exec jekyll serve --detach --ssl-key private.key --ssl-cert cert.pem
{% endhighlight %}

## Exit Jekyll

CentOS 7.6

{% highlight bash %}
# 查看哪些端口正在运行
$ netstat -nltp

$ pkill -f jekyll
# 或者
$ kill -9 process_id
{% endhighlight %}

