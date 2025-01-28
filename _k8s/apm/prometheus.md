---
title: "Prometheus"
sequence: "102"
---

- Prometheus 监控
    - 自定义配置
        - 创建 ConfigMap 配置
        - 部署 Prometheus
        - 配置访问权限
        - 服务发现配置
        - 系统时间同步
        - 监控 K8s 集群
            - 从 kubelet 获取节点容器资源使用情况
            - Exporter 监控资源使用情况
            - 对 Ingress 和 Service 进行网络探测
        - Grafana 可视化
            - 基本概念
                - 数据源（Data Source）
                - 仪表盘（Dashboard）
                - 组织和用户
            - 集成 Grafana
                - 部署 Grafana
                - 服务发现
                - 配置 Grafana 面板
    - kube-prometheus
        - 替换国内镜像
        - 修改访问入口
        - 安装
        - 配置 Ingress
        - 卸载

## 自定义配置

## kube-prometheus

## Reference

- [prometheus-operator/kube-prometheus](https://github.com/prometheus-operator/kube-prometheus)
- [K8s 安装 kube-promethues（超详细）](https://developer.aliyun.com/article/1046920)
- [K8s v1.27 部署 prometheus](https://blog.csdn.net/m0_60100524/article/details/131454826)

