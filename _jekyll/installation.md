---
title:  "Installation"
categories: jekyll
---

[UP]({% link _posts/2021-04-20-jekyll-cheat-sheet.md %})

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
