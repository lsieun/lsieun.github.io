---
title: "Jenkins"
image: /assets/images/jenkins/jenkins-logo.png
permalink: /jenkins.html
---

Jenkins is a tool that is used for automation,
and it is an open-source server that allows all the developers to build, test and deploy software.
It works or runs on java as it is written in java.
By using Jenkins we can make a continuous integration of projects(jobs) or end-to-endpoint automation.

## Basic

{%
assign filtered_posts = site.jenkins |
where_exp: "item", "item.url contains '/jenkins/'" |
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

- [B 站讲的最透彻的 Jenkins 教程](https://www.bilibili.com/video/BV1pF411Y7tq/)


- [Jenkins 权限控制 -Role Strategy Plugin 插件使用](https://www.cnblogs.com/hahaha111122222/p/13130093.html)

- [Baeldung Tag: Jenkins](https://www.baeldung.com/tag/jenkins)
  - [Send Email Notification From Jenkins](https://www.baeldung.com/ops/jenkins-send-email-notifications)
  - [Enable HTTPS in Jenkins](https://www.baeldung.com/ops/jenkins-enable-https)
  - [Guide to Jenkins Parameterized Builds](https://www.baeldung.com/ops/jenkins-parameterized-builds)
  - [How to Inject Git Secrets in Jenkins](https://www.baeldung.com/ops/jenkins-inject-git-secrets)
  - [How to Set Environment Variables in Jenkins?](https://www.baeldung.com/ops/jenkins-environment-variables)
  - [Intro to Jenkins 2 and the Power of Pipelines](https://www.baeldung.com/ops/jenkins-pipelines)
