---
title: "新建静态网站（快速开始）"
sequence: "101"
---

[UP](/jekyll/jekyll-index.html)

## First Example

Create a new Jekyll site at `./myblog`.

{% highlight bash %}
jekyll new myblog
{% endhighlight %}

Change into your new directory.

{% highlight bash %}
cd myblog
{% endhighlight %}

Build the site and make it available on a local server.

{% highlight bash %}
bundle exec jekyll serve
{% endhighlight %}

Browse to [http://localhost:4000](http://localhost:4000)

## Creating a GitHub Pages site with Jekyll

Navigate to the location where you want to store your site's source files,
replacing `PARENT-FOLDER` with the folder you want to contain the folder for your repository.

{% highlight bash %}
$ cd PARENT-FOLDER
{% endhighlight %}

Initialize a local Git repository, replacing `REPOSITORY-NAME` with the name of your repository.

{% highlight bash %}
$ git init REPOSITORY-NAME
{% endhighlight %}

Change directories to the repository.

{% highlight bash %}
$ cd REPOSITORY-NAME
# Changes the working directory
{% endhighlight %}

To create a new Jekyll site, use the `jekyll new` command:

{% highlight bash %}
$ jekyll new .
# Creates a Jekyll site in the current directory
{% endhighlight %}

Open the `Gemfile` that Jekyll created.

Add "#" to the beginning of the line that starts with `gem "jekyll"` to comment out this line.

Add the `github-pages` gem by editing the line starting with `# gem "github-pages"`. Change this line to:

{% highlight bash %}
gem "github-pages", "~> GITHUB-PAGES-VERSION", group: :jekyll_plugins
{% endhighlight %}

Replace `GITHUB-PAGES-VERSION` with the latest supported version of the `github-pages` gem.
You can find this version here: "[Dependency versions](https://pages.github.com/versions/)."

{% highlight bash %}
gem "github-pages", "~> 231", group: :jekyll_plugins
{% endhighlight %}

The correct version Jekyll will be installed as a dependency of the `github-pages` gem.

Save and close the `Gemfile`.

From the command line, run `bundle update`.

Add your GitHub repository as a remote, replacing `USER` with the account that owns the repository and `REPOSITORY` with the name of the repository.

{% highlight bash %}
$ git remote add origin https://github.com/USER/REPOSITORY.git
{% endhighlight %}

Push the repository to GitHub, replacing `BRANCH` with the name of the branch you're working on.

{% highlight bash %}
$ git push -u origin BRANCH
{% endhighlight %}
