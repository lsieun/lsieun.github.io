---
title:  "Jekyll CheatSheet"
categories: jekyll
image: /assets/images/jekyll/jekyll-logo.png
tags: jekyll
---

Jekyll Cheat Sheet

## Index

<ul>
{% for post in site.jekyll %}
<li>
<a href="{{ post.url }}">
{{ post.title }}
</a>
</li>

{% endfor %}
</ul>

  
## Reference

- [Jekyll](https://jekyllrb.com/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [The GitHub Training Team: GitHub Pages](https://lab.github.com/githubtraining/github-pages)  
- [Jekyll Notes](http://stories.upthebuzzard.com/jekyll_notes/)
