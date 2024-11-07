---
title: "Kubernetes (K8s)"
image: /assets/images/k8s/kubernetes-cover.webp
permalink: /k8s.html
---

Kubernetes, also known as **K8s**, is an open-source system for
automating deployment, scaling, and management of containerized applications.

The name Kubernetes originates from Greek, meaning helmsman or pilot.
K8s as an abbreviation results from counting the eight letters between the "K" and the "s".

## Basic

{%
assign filtered_posts = site.k8s |
where_exp: "item", "item.url contains '/k8s/basic/'" |
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

## Installation

<table>
    <thead>
    <tr>
        <th>Basic</th>
        <th>CentOS</th>
        <th>Ubuntu</th>
        <th>Other</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.k8s |
where_exp: "item", "item.url contains '/k8s/installation/basic/'" |
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
assign filtered_posts = site.k8s |
where_exp: "item", "item.url contains '/k8s/installation/centos/'" |
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
assign filtered_posts = site.k8s |
where_exp: "item", "item.url contains '/k8s/installation/ubuntu/'" |
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
assign filtered_posts = site.k8s |
where_exp: "item", "item.url contains '/k8s/installation/other/'" |
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


## Config

{%
assign filtered_posts = site.k8s |
where_exp: "item", "item.url contains '/k8s/config/'" |
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

## Concept

{%
assign filtered_posts = site.k8s |
where_exp: "item", "item.url contains '/k8s/concept/'" |
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

## Command

{%
assign filtered_posts = site.k8s |
where_exp: "item", "item.url contains '/k8s/cmd/'" |
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

## Workload

<table>
    <thead>
    <tr>
        <th>Basic</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.k8s |
where_exp: "item", "item.url contains '/k8s/workload/basic/'" |
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

### Pod

<table>
    <thead>
    <tr>
        <th>Container</th>
        <th>Creating Pod</th>
        <th>Interacting Pod</th>
        <th>Pod Lifecycle</th>
        <th>Network</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.k8s |
where_exp: "item", "item.url contains '/k8s/workload/pod/container/'" |
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
assign filtered_posts = site.k8s |
where_exp: "item", "item.url contains '/k8s/workload/pod/create/'" |
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
assign filtered_posts = site.k8s |
where_exp: "item", "item.url contains '/k8s/workload/pod/interact/'" |
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
assign filtered_posts = site.k8s |
where_exp: "item", "item.url contains '/k8s/workload/pod/lifecycle/'" |
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
assign filtered_posts = site.k8s |
where_exp: "item", "item.url contains '/k8s/workload/pod/network/'" |
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

### Workload Resources

<table>
    <thead>
    <tr>
        <th>Deployment</th>
        <th>StatefulSet</th>
        <th>DaemonSet</th>
        <th>Job</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.k8s |
where_exp: "item", "item.url contains '/k8s/workload/resource/deploy/'" |
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
assign filtered_posts = site.k8s |
where_exp: "item", "item.url contains '/k8s/workload/resource/stateful/'" |
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
assign filtered_posts = site.k8s |
where_exp: "item", "item.url contains '/k8s/workload/resource/daemon/'" |
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
assign filtered_posts = site.k8s |
where_exp: "item", "item.url contains '/k8s/workload/resource/job/'" |
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

## Network

<table>
    <thead>
    <tr>
        <th>Service</th>
        <th>Ingress</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.k8s |
where_exp: "item", "item.url contains '/k8s/network/service/'" |
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
assign filtered_posts = site.k8s |
where_exp: "item", "item.url contains '/k8s/network/ingress/'" |
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

## Storage

<table>
    <thead>
    <tr>
        <th>Basic</th>
        <th>Volume</th>
        <th>PV + PVC</th>
        <th>Storage Class</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.k8s |
where_exp: "item", "item.url contains '/k8s/storage/basic/'" |
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
assign filtered_posts = site.k8s |
where_exp: "item", "item.url contains '/k8s/storage/volume/'" |
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
assign filtered_posts = site.k8s |
where_exp: "item", "item.url contains '/k8s/storage/pv/'" |
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
assign filtered_posts = site.k8s |
where_exp: "item", "item.url contains '/k8s/storage/sc/'" |
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


---

<table>
    <thead>
    <tr>
        <th>Basic</th>
        <th>ConfigMap</th>
        <th>Secret</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.k8s |
where_exp: "item", "item.url contains '/k8s/storage/config/basic/'" |
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
assign filtered_posts = site.k8s |
where_exp: "item", "item.url contains '/k8s/storage/config/map/'" |
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
assign filtered_posts = site.k8s |
where_exp: "item", "item.url contains '/k8s/storage/config/secret/'" |
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

## Scheduler

{%
assign filtered_posts = site.k8s |
where_exp: "item", "item.url contains '/k8s/scheduler/'" |
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

## Policies

{%
assign filtered_posts = site.k8s |
where_exp: "item", "item.url contains '/k8s/policies/'" |
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

## Helm

{%
assign filtered_posts = site.k8s |
where_exp: "item", "item.url contains '/k8s/helm/'" |
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

![](/assets/images/k8s/running-applications-in-containers-on-kubernetes.webp)


## Reference

- [Kubernetes Documentation](https://kubernetes.io/docs/home/)
    - [Production environment](https://kubernetes.io/docs/setup/production-environment/)
        - [Container Runtimes](https://kubernetes.io/docs/setup/production-environment/container-runtimes/)

- [Installing Addons](https://kubernetes.io/docs/concepts/cluster-administration/addons/)

- [Play with Kubernetes](https://labs.play-with-k8s.com/)
- [K8s - 免费的 Kubernetes 在线实验平台介绍 1（Play with Kubernetes）](https://www.hangge.com/blog/cache/detail_2420.html)

书籍：

- [Kubernetes in Action(Second Edition)](https://wangwei1237.github.io/Kubernetes-in-Action-Second-Edition/) 网页版的书籍，感觉很有用
- [GitHub: kubernetes-in-action-2nd-edition](https://github.com/luksa/kubernetes-in-action-2nd-edition)

- [Kubernetes 学习指南](https://www.k8stech.net/k8s-book/)

- [IT 老齐《Kubernetes》](https://www.yuque.com/g/itlaoqi/hel4ky/collaborator/join?token=nU5VGNVZJmmEgHE9#)

视频：

- [完整版 Kubernetes（K8s）全套入门 + 微服务实战项目](https://www.bilibili.com/video/BV1MT411x7GH/)
  - [k8s 详细教程](https://znunwm.top/archives/k8s-xiang-xi-jiao-cheng)
- [【编程不良人】kubernetes (k8s) 实战教程](https://www.bilibili.com/video/BV1cd4y1J7qE/)
- [K8s 全栈架构师 初级篇 + 进阶篇 + 高级篇 + 运维篇](https://www.bilibili.com/video/BV14d4y1v73E/)
- [Kubernetes(K8S) 入门进阶实战完整教程 - 2020 - 黑马](https://www.bilibili.com/video/BV1Qv41167ck/)
- [完整版 -k8s(kubernetes)与 SpringCloud 微服务项目实战](https://www.bilibili.com/video/BV1QV411H7Gg)
- [从零开始偷偷学运维 Kubernetes](https://www.bilibili.com/video/BV1HN4y1T7Gy/)
- [轻松掌握无坑部署 K8S 1.26 通用性集群技巧](https://www.bilibili.com/video/BV1ym4y1a7WD)
- [docker 容器部署与 Kubernetes](https://www.bilibili.com/video/BV1EW4y197bK)
- [从 docker 小白到 K8S 大神](https://www.bilibili.com/video/BV1Mh411T765)
- [k8s 教程全套 - 2020](https://www.bilibili.com/video/BV1W24y1X7D5)
- [kubeadm 安装 k8s-1.24.1-CRI-dockerd 安装](https://www.bilibili.com/video/av342175112/)

安装：

- [CentOS 安装 kubernetes（k8s）1.26.2](https://www.bilibili.com/video/BV1zY41167aa)
    - 文章：[gitlab-k8s](https://www.yuque.com/xuxiaowei-com-cn/gitlab-k8s)

- [minikube start](https://minikube.sigs.k8s.io/docs/start/)

- [Baeldung Tag: Kubernetes](https://www.baeldung.com/tag/kubernetes)
    - [Introduction to Kubernetes](https://www.baeldung.com/ops/kubernetes)


- [使用 kubeadm 方式搭建 Kubernetes 集群](https://blog.csdn.net/gyqailxj/article/details/128190738)
- [云原生 - kubernetes - 使用 cri-docker 部署基于 kubeadm-1.25.4 的集群](https://blog.csdn.net/alwaysbefine/article/details/128205684)
- [基于 Cri-dockerd 使用 Kubeadm 部署 Kubernetes1.25 集群](https://blog.51cto.com/u_15538119/5807537)
- [kubeadm+docker（cri-dockerd）方式部署 k8s 单 master 集群 (v1.24.3)](https://www.cnblogs.com/cyh00001/p/16492433.html)
- [k8s1.26.x 使用 kubeadm 的 cri-dockerd 部署](https://blog.51cto.com/flyfish225/5977053)
- [基于 docker 和 cri-dockerd 部署 k8sv1.26.3](https://www.cnblogs.com/qiuhom-1874/p/17279199.html)
- [centos7 部署 k8s1.25.3 版本 (使用 cri-dockerd 方式安装)](https://www.cnblogs.com/fenghua001/p/16849875.html)
- [centos7 部署 k8s1.25.3 （使用 containerd）](https://www.cnblogs.com/fenghua001/p/16877819.html)
- [centos 升级内核 和版本](https://www.cnblogs.com/fenghua001/p/16831890.html)
- [Install Kubernetes 1.24](https://www.etaon.top/2022/06/6/Install-Kubernetes-1.24.html)

- [在 K8s 中部署主从结构的 MySQL 服务](https://www.cnblogs.com/hahaha111122222/p/17138159.html)
- [Kubernetes 存储卷详解](https://www.cnblogs.com/hahaha111122222/p/16453411.html)
- [crictl 命令 - Kubernetes 管理命令详解](https://www.cnblogs.com/hahaha111122222/p/16451691.html)
- [Docker 与 Containerd 并用配置](https://www.cnblogs.com/hahaha111122222/p/16451663.html)
- [使用 kubeoperator 安装的 k8s 集群配置 Ingress 规则有关说明](https://www.cnblogs.com/hahaha111122222/p/16446510.html)
- [在 Kubernetes 容器集群，微服务项目最佳实践](https://www.cnblogs.com/hahaha111122222/p/16446196.html)
- [使用 kubeoperator 安装的 k8s 集群以及采用的 containerd 容器运行时，关于采用的是 cgroup 驱动还是 systemd 驱动的说明](https://www.cnblogs.com/hahaha111122222/p/16445834.html)
- [Kubernetes 上 Java 应用的最佳实践](https://www.cnblogs.com/hahaha111122222/p/17191731.html)
- [Docker 容器和 Kubernetes 退出码中文指南](https://www.cnblogs.com/hahaha111122222/p/17148590.html)


- [Kunbernetes- 基于 Nexus 构建私有镜像仓库](https://www.kubernetes.org.cn/4024.html)
- [kubectl 创建 Pod 背后到底发生了什么？](https://icloudnative.io/posts/what-happens-when-k8s/)

- [Four ways pods suddenly stop running on Kubernetes](https://home.robusta.dev/blog/oomkill-crashloops-evictions)
- [Robusta Blog](https://home.robusta.dev/blog)

Extension

- [Rancher](https://www.rancher.com/): Enterprise Kubernetes Management

