---
title: "Chinese Culture"
image: /assets/images/chinese-culture/chinese-culture-cover.png
permalink: /chinese-culture.html
---

Since ancient times, China has been known as the "Celestial Empire."
This refers not only to China's strength and position as East Asia's Middle Kingdom,
it also captures a more profound meaning, describing a land where the divine and mortal once coexisted.
It refers to the belief that the divine, through various dynasties,
transmitted a rich and abundant culture to the Chinese people.
Chinese culture is thus known as "divinely inspired,"
and is the only culture in the world to have a continuous recorded history of 5,000 years.
It has left behind countless literary classics, historical documents, cultural relics,
and national records reflecting its immense scope.

Chinese culture is said to have begun with the Yellow Emperor, over 5,000 years ago.
He was a cultivator of the Tao (or the Way), and was said to have great power and wisdom.
He taught his subjects how to live in accordance with the heavenly Way.
Ancient Chinese legends speak of many deities who passed on to humans essential elements of culture.
For example, Cangjie created Chinese characters, Shennong imparted agriculture, and Suiren revealed the uses of fire.

Taoist thought, considered a wellspring of Chinese culture,
was systemized by the sage Lao Zi over 2,500 years ago in his book Dao De Jing (Tao Te Ching).
The book expounds on the mysterious Way of the universe, which he calls the Tao.

In 67 C.E., Buddhism reached China from ancient India.
Its focus on personal salvation and meditation had a profound effect on Chinese culture, lasting until today.
It was during the Tang Dynasty (618 C.E.– 907 C.E.) that religious practice in China reached its peak,
an era often seen as the pinnacle of Chinese civilization.

Under the influence of these faiths, Chinese culture has generated a rich and profound system of values.
The concepts of "man and nature must be in balance," "respect the heavens to know one's destiny,"
and the five cardinal virtues of benevolence, righteousness, propriety, wisdom, and faithfulness (ren yi li zhi xin)
are all products of these three religions' teachings.
These principles have constantly played out over China's 5,000-year-long history.

## 汉字

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
assign filtered_posts = site.chinese-culture |
where_exp: "item", "item.path contains 'chinese-culture/character/'" |
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

## 春秋和战国

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
assign filtered_posts = site.chinese-culture |
where_exp: "item", "item.path contains 'chinese-culture/you-ming/'" |
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



## 易经

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
assign filtered_posts = site.chinese-culture |
where_exp: "item", "item.path contains 'chinese-culture/yi-jing/'" |
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
