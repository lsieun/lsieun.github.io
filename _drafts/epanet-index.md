---
title: "EPANET"
layout: post
image: /assets/images/epanet/epanet-cover-example.png
permalink: /epanet.html
---

EPANET is a software application used throughout the world to model water distribution systems.

![](/assets/images/epanet/EPANET-220px.gif)

## Overview

{%
assign filtered_posts = site.epanet |
where_exp: "item", "item.url contains '/epanet/overview/'" |
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

## Usage

{%
assign filtered_posts = site.epanet |
where_exp: "item", "item.url contains '/epanet/usage/'" |
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

## Example

{%
assign filtered_posts = site.epanet |
where_exp: "item", "item.url contains '/epanet/example/'" |
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

## API

{%
assign filtered_posts = site.epanet |
where_exp: "item", "item.url contains '/epanet/api/'" |
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

## Compile

{%
assign filtered_posts = site.epanet |
where_exp: "item", "item.url contains '/epanet/compile/'" |
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

## INP

Overview

{%
assign filtered_posts = site.epanet |
where_exp: "item", "item.url contains '/epanet/inp/overview/'" |
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

<table>
    <caption>Input File</caption>
    <thead>
    <tr>
        <th>Network Components</th>
        <th>System Operation</th>
        <th>Water Quality</th>
        <th>Options & Reporting</th>
        <th>Network Map/Tags</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.epanet |
where_exp: "item", "item.url contains '/epanet/inp/network-components/'" |
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
assign filtered_posts = site.epanet |
where_exp: "item", "item.url contains '/epanet/inp/system-operation/'" |
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
assign filtered_posts = site.epanet |
where_exp: "item", "item.url contains '/epanet/inp/water-quality/'" |
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
assign filtered_posts = site.epanet |
where_exp: "item", "item.url contains '/epanet/inp/options-and-reporting/'" |
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
assign filtered_posts = site.epanet |
where_exp: "item", "item.url contains '/epanet/inp/network-map/'" |
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


## Dev

{%
assign filtered_posts = site.epanet |
where_exp: "item", "item.url contains '/epanet/dev/'" |
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

## Reference

- [lsieun/learn-java-epanet](https://github.com/lsieun/learn-java-epanet)

- [EPANET](https://www.epa.gov/water-research/epanet)
- [EPANET 2.2 User Manual](https://epanet22.readthedocs.io/en/latest/index.html)
    - [3. The Network Model](https://epanet22.readthedocs.io/en/latest/3_network_model.html)
    - [Input File Format](https://epanet22.readthedocs.io/en/latest/back_matter.html#input-file-format)

Github

- [Open Water Analytics](https://github.com/OpenWaterAnalytics)
    - [OpenWaterAnalytics/EPANET](https://github.com/OpenWaterAnalytics/EPANET):
      This project covers only the EPANET hydraulic and water quality solver engine, not the graphical user interface.
    - [OpenWaterAnalytics/epanet-dev](https://github.com/OpenWaterAnalytics/epanet-dev):
      This is a collaborative project to develop a new version of
      the EPANET computational engine for analyzing water distribution systems.

Wiki

- [EPANET](https://en.wikipedia.org/wiki/EPANET)

Software

- [StormDesk](http://info-water.com/product/stormDesk)
- [OpenFlows WaterGEMS](https://www.bentley.com/software/openflows-watergems/)


