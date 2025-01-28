---
title: "Alarm: Notify"
sequence: "103"
---

## WeChat Hook

```yaml
wechatHooks:
  textTemplate: |-
    {
      "msgtype": "text",
      "text": {
        "content": "Apache SkyWalking Alarm: \n %s."
      }
    }    
  webhooks:
    - https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=dummy_key
```

请求方法：`POST`

请求体：

```json
{
  "msgtype": "text",
  "text": {
    "content": "Apache SkyWalking Alarm: \n %s."
  }
}
```

返回：

```json
{
    "errcode": 0,
    "errmsg": "ok"
}
```

- [WebHook 对企业微信的支持](https://help.gitee.com/webhook/webhook-for-wecom-robot)
- [企业微信 群机器人 配置说明](https://developer.work.weixin.qq.com/document/path/91770)

## DingTalk Hook

```yaml
dingtalkHooks:
  textTemplate: |-
    {
      "msgtype": "text",
      "text": {
        "content": "Apache SkyWalking Alarm: \n %s."
      }
    }    
  webhooks:
    - url: https://oapi.dingtalk.com/robot/send?access_token=dummy_token
      secret: dummysecret
```

```yaml
webhooks:
  - http://192.168.1.181:8019/msg/alert/notify

dingtalkHooks:
  textTemplate: |-
    {
      "msgtype": "text",
      "text": {
        "content": "Apache SkyWalking Alarm: \n %s."
      }
    }
  webhooks:
    - url: https://oapi.dingtalk.com/robot/send?access_token=7cc35d49186ada7bf5d17a6e79e41d18a0a4fe33498d6289f8e5add4bd6bb8c4
      secret: SECf1b2c4107a10c9fe0c7036b4ad50635691907cbf1604be9479e4ebdff7b552b0
```

## Slack

```yaml
slackHooks:
  textTemplate: |-
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": ":alarm_clock: *Apache Skywalking Alarm* \n **%s**."
      }
    }    
  webhooks:
    - https://hooks.slack.com/services/x/y/z
```

```yaml
slackHooks:
  textTemplate: |-
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": ":alarm_clock: *Apache Skywalking Alarm* \n **%s**."
      }
    }    
  webhooks:
    - https://hooks.slack.com/services/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
```

```text
curl -X POST -H 'Content-type: application/json' --data '{"text":"Hello, World!"}' https://hooks.slack.com/services/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
```

```text
https://hooks.slack.com/services/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
```

## Feishu

```yaml
feishuHooks:
  textTemplate: |-
    {
      "msg_type": "text",
      "content": {
        "text": "Apache SkyWalking Alarm: \n %s."
      },
      "ats":"feishu_user_id_1,feishu_user_id_2"
    }    
  webhooks:
    - url: https://open.feishu.cn/open-apis/bot/v2/hook/dummy_token
      secret: dummysecret
```

```yaml
feishuHooks:
  textTemplate: |-
    {
      "msg_type": "text",
      "content": {
        "text": "Apache SkyWalking Alarm: \n %s."
      },
      "ats":"feishu_user_id_1,feishu_user_id_2"
    }    
  webhooks:
    - url: https://open.feishu.cn/open-apis/bot/v2/hook/9af31600-85d8-4560-a063-2a179d3e0c18
      secret: AqaB4zzg5S59HY7N4oKT0c
```

```text
https://open.feishu.cn/open-apis/bot/v2/hook/9af31600-85d8-4560-a063-2a179d3e0c18
AqaB4zzg5S59HY7N4oKT0c
```
