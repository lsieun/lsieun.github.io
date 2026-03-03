---
title: "Selenium"
image: /assets/images/selenium/selenium-automation.webp
permalink: /selenium/index.html
---

**Selenium automates browsers.** That's it!
What you do with that power is entirely up to you.
Primarily it is for automating web applications for testing purposes.

## Basic

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Basic</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.selenium |
where_exp: "item", "item.path contains 'selenium/basic/'" |
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
        </td>
    </tr>
    </tbody>
</table>

## Reference

- [lsieun/learn-selenium-java](https://github.com/lsieun/learn-selenium-java)

- [Downloads](https://www.selenium.dev/downloads/)

- [known-good-versions-with-downloads.json](https://googlechromelabs.github.io/chrome-for-testing/known-good-versions-with-downloads.json)
- [Web Browsers](https://www.free-codecs.com/software/web-browsers.htm)
    - [Google Chrome / ChromeDriver 145.0.7632.117](https://www.free-codecs.com/google-chrome_download.htm)
