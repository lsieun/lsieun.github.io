---
title: "Collections"
sequence: "101"
---

[UP](/jekyll/jekyll-index.html)

Collections are a great way to group related content.

## Liquid Attributes

### Collections

Collections are available under `site.collections`,  
with **the metadata** you specified in your `_config.yml` (if present) and the following information:

> 这里是针对每一个collection而言，它的attribute有两部分组成，第1部分是由_config.yml定义，第2部分是以下定义的属性。

<table>
  <thead>
    <tr>
      <th>Variable</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p><code>label</code></p>
      </td>
      <td>
        <p>
          The name of your collection, e.g. <code>my_collection</code>.
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <p><code>docs</code></p>
      </td>
      <td>
        <p>
          An array of documents.
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <p><code>files</code></p>
      </td>
      <td>
        <p>
          An array of static files in the collection.
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <p><code>relative_directory</code></p>
      </td>
      <td>
        <p>
          The path to the collection's source directory, relative to the site source.
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <p><code>directory</code></p>
      </td>
      <td>
        <p>
          The full path to the collections's source directory.
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <p><code>output</code></p>
      </td>
      <td>
        <p>
          Whether the collection's documents will be output as individual files.
        </p>
      </td>
    </tr>
  </tbody>
</table>

### Documents

In addition to any **front matter** provided in the document's corresponding file,  
each document has the following attributes:

> 这里是针对每一个collection里面的document而言，它的attribute有两部分组成，第1部分是由front matter定义，第2部分是以下定义的属性。

<table>
  <thead>
    <tr>
      <th>Variable</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p><code>content</code></p>
      </td>
      <td>
        <p>
          The (unrendered) content of the document. If no front matter is
          provided, Jekyll will not generate the file in your collection. If
          front matter is used, then this is all the contents of the file
          after the terminating
          `---` of the front matter.
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <p><code>output</code></p>
      </td>
      <td>
        <p>
          The rendered output of the document, based on the <code>content</code>.
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <p><code>path</code></p>
      </td>
      <td>
        <p>
          The full path to the document's source file.
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <p><code>relative_path</code></p>
      </td>
      <td>
        <p>
          The path to the document's source file relative to the site source.
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <p><code>url</code></p>
      </td>
      <td>
        <p>
          The URL of the rendered collection.
          The file is only written to the destination when the collection to which it belongs has <code>output: true</code> in the site's configuration.
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <p><code>collection</code></p>
      </td>
      <td>
        <p>
          The name of the document's collection.
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <p><code>date</code></p>
      </td>
      <td>
        <p>
          The date of the document's collection.
        </p>
      </td>
    </tr>
  </tbody>
</table>

## Iterate collections

Somewhat annoyingly, Jekyll's default list of collections is in alphabetical order of collection name.

### First Example

So if your `_config.yml` specifies

{% highlight text %}
collections:
moose_and_goose_stories:
title: The Moose and Goose Stories
grey_parrot_stories:
title: The Grey Parrot Stories
predicting_the_present:
title: Predicting the Present
{% endhighlight %}

and you process the collections using the default ordering

{% highlight plaintext %}
{% raw %}
{% for item in site.collections %}

- label: {{ item.label }}
    - directory: {{ item.directory }}
    - relative_directory: {{ item.relative_directory }}
    - output: {{ item.output }}
      {% endfor %}
      {% endraw %}
      {% endhighlight %}

it will give you

<ul>
  <li>label: grey_parrot_stories
    <ul>
      <li>directory: D:/git-repo/myblog/_grey_parrot_stories</li>
      <li>relative_directory: _grey_parrot_stories</li>
      <li>output: false</li>
    </ul>
  </li>
  <li>label: moose_and_goose_stories
    <ul>
      <li>directory: D:/git-repo/myblog/_moose_and_goose_stories</li>
      <li>relative_directory: _moose_and_goose_stories</li>
      <li>output: false</li>
    </ul>
  </li>
  <li>label: posts
    <ul>
      <li>directory: D:/git-repo/myblog/_posts</li>
      <li>relative_directory: _posts</li>
      <li>output: true</li>
    </ul>
  </li>
  <li>label: predicting_the_present
    <ul>
      <li>directory: D:/git-repo/myblog/_predicting_the_present</li>
      <li>relative_directory: _predicting_the_present</li>
      <li>output: false</li>
    </ul>
  </li>
</ul>

### Second Example

{% highlight plaintext %}
{% raw %}
{% for item in site.collections %}
{% if item.title %}

- {{ item.title | escape }}
  {% endif %}
  {% endfor %}
  {% endraw %}
  {% endhighlight %}

<ul>
  <li>
    <p>The Grey Parrot Stories</p>
  </li>
  <li>
    <p>The Moose and Goose Stories</p>
  </li>
  <li>
    <p>Predicting the Present</p>
  </li>
</ul>

### Third Example

Modify the `_config.yml` file, and add a `sequence` attribute to each collection.

{% highlight plaintext %}
collections:
moose_and_goose_stories:
title: The Moose and Goose Stories
sequence: 1
grey_parrot_stories:
title: The Grey Parrot Stories
sequence: 2
predicting_the_present:
title: Predicting the Present
sequence: 3
{% endhighlight %}

{% highlight plaintext %}
{% raw %}
{% assign collections = site.collections | sort: "sequence" %}
{% for item in collections %}
{% if item.title %}

- {{ item.title | escape }}
  {% endif %}
  {% endfor %}
  {% endraw %}
  {% endhighlight %}

<ul>
  <li>
    <p>The Moose and Goose Stories</p>
  </li>
  <li>
    <p>The Grey Parrot Stories</p>
  </li>
  <li>
    <p>Predicting the Present</p>
  </li>
</ul>

## Sort documents in a collection

For the sake of this example, let's assume we have a collection called `projects`.

### Sort a collection in ascending order

Here is how we can get a collection posts in ascending order on a page or index (oldest collection post first).

{% highlight plaintext %}
{% raw %}
{% assign projects = site.projects %}

{% for project in projects %}
{% endraw %}
{% endhighlight %}

### Sort a collection in reverse order

Sorting a Jekyll collection in reverse order (latest collection post first) is pretty straightforward in Jekyll.

{% highlight plaintext %}
{% raw %}
{% assign projects = site.projects %}

{% for project in projects reversed %}
{% endraw %}
{% endhighlight %}

### Sort a collection in reverse order and limit the number of results

Now let's look at how we can limit the number of posts from a collection and
sort the result in descending order (latest collection post first).
This is useful if you have a site with hundred of articles and
want to create an index with the latest results in a given collection.

{% highlight plaintext %}
{% raw %}
{% assign sorted = site.projects | sort: 'date' | reverse %}

{% for project in sorted limit: 12 %}
{% endraw %}
{% endhighlight %}

If you leave out `| reverse`, your collection will show up oldest post first.

## References

- [How to sort and order a Jekyll collection](https://templates.supply/sort-jekyll-collection-by-reverse-order-and-limit-results/)

