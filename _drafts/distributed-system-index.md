---
title: "Distributed Systems"
image: /assets/images/distributed/distributed-system-cover.png
permalink: /distributed-system.html
---

A distributed system is a collection of computer programs
that utilize computational resources across multiple, separate computation nodes to achieve a common, shared goal.
Distributed systems aim to remove bottlenecks or central points of failure from a system.

## Basic

<table>
    <thead>
    <tr>
        <th>Glossary</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.distributed |
where_exp: "item", "item.url contains '/distributed/glossary/'" |
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

## Node 算法

<table>
    <thead>
    <tr>
        <th>分布式共识算法</th>
        <th>分布式锁</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.distributed |
where_exp: "item", "item.url contains '/distributed/node/consensus/'" |
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
        <td>
{%
assign filtered_posts = site.distributed |
where_exp: "item", "item.url contains '/distributed/node/lock/'" |
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

## Data

<table>
    <thead>
    <tr>
        <th>缓存</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.distributed |
where_exp: "item", "item.url contains '/distributed/data/cache/'" |
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

- [What is a distributed system?](https://www.atlassian.com/microservices/microservices-architecture/distributed-architecture)
- [Everything About Distributed Systems](https://medium.com/@gmnchamikara/everything-about-distributed-systems-1d952dcc3118)
- [Fallacies of Distributed Systems](https://architecturenotes.co/fallacies-of-distributed-systems/)
- [Consensus Algorithms in Distributed Systems](https://www.baeldung.com/cs/consensus-algorithms-distributed-systems)
- [Tech Insights — Two-phase Commit Protocol for Distributed Transactions](https://alibaba-cloud.medium.com/tech-insights-two-phase-commit-protocol-for-distributed-transactions-ff7080eefe00)

