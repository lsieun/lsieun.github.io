---
title: "分割文件"
sequence: "104"
---


```text
# 1. 截取前段 (从开头到第60秒)
ffmpeg -i input.mp4 -ss 00:00:00 -t 60 -c copy part1.mp4

# 2. 截取后段 (从第60秒到视频结尾)
ffmpeg -i input.mp4 -ss 00:00:60 -c copy part2.mp4

```

命令详解

- `-i input.mp4`: 指定输入视频文件。
- `-ss`: 指定开始时间（格式：`hh:mm:ss` 或秒数）。
- `-t`: 指定截取的持续时间（如 `-t 60` 表示截取60秒）。
- `-to`: 指定截取的结束时间（如 `-to 00:01:30` 表示截取到1分30秒位置）。
- `-c copy`: **关键参数**，表示直接复制视频和音频流，不进行重新编码，速度极快且无损。
- `part1.mp4` / `part2.mp4`: 输出文件名。

```text
ffmpeg -i input.mp4 -ss 00:00:00 -to 00:25:00 -c copy part1.mp4
ffmpeg -i input.mp4 -ss 00:25:00 -c copy part2.mp4
```
