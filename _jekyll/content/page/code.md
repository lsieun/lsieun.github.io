---
title: "代码"
sequence: "108"
---

[UP](/jekyll/jekyll-index.html)

这个话题属于Liquid Tags的范畴。

Jekyll has built in support for syntax highlighting of over 100 languages thanks to [Rouge](http://rouge.jneen.net/).

Rouge is the default highlighter in Jekyll 3 and above.

## Code snippet highlighting

To render a code block with syntax highlighting, surround your code as follows:

{% highlight plaintext %}
{% raw %}
{% highlight ruby %}
def foo
  puts 'foo'
end
{% endhighlight %}
{% endraw %}
{% endhighlight %}

{% highlight ruby %}
def foo
  puts 'foo'
end
{% endhighlight %}

The argument to the `highlight` tag (`ruby` in the example above) is the language identifier.

To find the appropriate identifier to use for the language you want to highlight,
look for the "short name" on the [Rouge wiki](https://github.com/jayferd/rouge/wiki/List-of-supported-languages-and-lexers).

- `c`: The C programming language
- `csharp`: a multi-paradigm language targeting .NET [aliases: c#,cs]
- `css`: Cascading Style Sheets, used to style web pages
- `go`: The Go programming language (http://golang.org) [aliases: go,golang]
- `html`: HTML, the markup language of the web
- `http`: http requests and responses
- `java`: The Java programming language (java.com)
- `javascript`: JavaScript, the browser scripting language [aliases: js]  
- `json`: JavaScript Object Notation (json.org)
- `kotlin`: Kotlin Programming Language (http://kotlinlang.org)
- `liquid`: Liquid is a templating engine for Ruby (liquidmarkup.org)
- `plaintext`: A boring lexer that doesn't highlight anything [aliases: text]
- `ruby`: The Ruby programming language (ruby-lang.org) [aliases: rb]
- `scala`: The Scala programming language (scala-lang.org) [aliases: scala]
- `shell`: Various shell languages, including sh and bash [aliases: bash,zsh,ksh,sh]
- `xml`: XML
- `yaml`: Yaml Ain't Markup Language (yaml.org) [aliases: yml]


> **Jekyll processes all Liquid filters in code blocks**  
> If you are using a language that contains curly braces,  
> you will likely need to place  `{{ "{% raw " }}%}` and `{{ "{% endraw " }}%}` tags around your code.  
> Since Jekyll 4.0, you can add `render_with_liquid: false` in your front matter   
> to disable Liquid entirely for a particular document.

## Line numbers

There is a second argument to `highlight` called `linenos` that is optional.

Including the `linenos` argument will force the highlighted code to include **line numbers**.

For instance, the following code block would include line numbers next to each line:

{% highlight plaintext %}
{% raw %}
{% highlight ruby linenos %}
def foo
  puts 'foo'
end
{% endhighlight %}
{% endraw %}
{% endhighlight %}

{% highlight ruby linenos %}
def foo
  puts 'foo'
end
{% endhighlight %}

## Stylesheets for syntax highlighting

In order for the highlighting to show up, you'll need to include a **highlighting stylesheet**.

For Pygments or Rouge you can use a stylesheet for Pygments,
you can find an example gallery [here](https://jwarby.github.io/jekyll-pygments-themes/languages/ruby.html) or from [its repository](https://github.com/jwarby/jekyll-pygments-themes).

Copy the CSS file (`native.css` for example) into your css directory and
import the syntax highlighter styles into your `main.css`:

```text
@import "native.css";
```
