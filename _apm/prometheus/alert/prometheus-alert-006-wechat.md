---
title: "微信告警"
sequence: "106"
---


```yaml
route:
  group_by: [ 'alertname' ]
  group_wait: 30s
  group_interval: 1m
  repeat_interval: 1h
  receiver: 'webchat'
receivers:
  - name: 'wechat'
    wechat_configs:
      - api_url: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=20211ef7-984d-45e3-b4b9-272a65131d28'
        api_secret: '20211ef7-984d-45e3-b4b9-272a65131d28'
```

