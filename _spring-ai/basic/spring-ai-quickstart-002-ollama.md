

```text
curl -X 'GET' \
    "http://localhost:8080/chat?message=hello' \
    -H 'accept: */*'
http://localhost:8080/chat?message=%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD%E7%9A%84%E6%9C%AC%E8%B4%A8%E6%98%AF%E4%BB%80%E4%B9%88
```

```text
curl -X 'GET' \
    "http://localhost:8080/chat/cooking?dish=fish' \
    -H 'accept: */*'
```

```text
curl -X GET http://localhost:8080/chat/cooking?dish=fish
```

```text
curl -X POST https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions \
-H "Authorization: Bearer $DASHSCOPE_API_KEY" \
-H "Content-Type: application/json" \
-d '{
    "model": "qwen-plus",
    "messages": [
        {
            "role": "system",
            "content": "You are a helpful assistant."
        },
        {
            "role": "user",
            "content": "你是谁？"
        }
    ]
}'
```
