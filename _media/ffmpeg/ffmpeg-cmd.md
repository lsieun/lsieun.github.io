---
title: "ffmpeg cmd"
sequence: "102"
---



提取每一秒的帧：

```text
ffmpeg -i input.mp4 -vf fps=1 output_%04d.png
```

```text
ffmpeg -i input_video.mp4 -vf "select='gte(n\,0)'" -vsync vfr -q:v 2 output_%04d.png
```

-i input_video.mp4：输入视频文件。
-vf "select='gte(n\,0)'"：这个过滤器会按帧提取视频的每一帧。你可以根据需要修改过滤条件，比如只选择有字幕的部分（如果知道时间段的话）。
-vsync vfr：确保视频帧的同步。
-q:v 2：设置图像质量，2 是较高的质量。

```text
ffmpeg -i input_video.mp4 -vf "select='between(t,60,120)'" -vsync vfr -q:v 2 output_%04d.png
```

```text
crop=w:h:x:y
```

- `w`：截图的宽度（单位是像素）。
- `h`：截图的高度（单位是像素）。
- `x`：截图区域的起始位置（相对于左上角的水平位置）。
- `y`：截图区域的起始位置（相对于左上角的垂直位置）。

```text
ffmpeg -i input_video.mp4 -vf "crop=640:360:100:50" -vsync vfr -q:v 2 output_%04d.png
```

- `crop=640:360:100:50`：从视频的 (100, 50) 坐标位置开始，截取 640px 宽，360px 高的区域。
- `-vsync vfr`：确保视频帧的同步。
- `-q:v 2`：输出图像的质量设置。

示例：提取视频的特定区域并按比例缩放
如果你想在裁剪后还对图像进行缩放，可以使用 scale 过滤器。例如，假设你想将截取的区域缩放到 1280x720 的分辨率，可以这样写：

```text
ffmpeg -i input_video.mp4 -vf "crop=640:360:100:50,scale=1280:720" -vsync vfr -q:v 2 output_%04d.png
```

这个命令会先裁剪出 640x360 的区域，再将其缩放到 1280x720。

```text
ffmpeg -i input.mp4 -vf "crop=900:100:250:580" -vsync vfr -q:v 2 output_%05d.png
```

```text
ffmpeg -i input.mp4 -vf "crop=900:100:250:580,fps=4" output_%05d.png
ffmpeg -i input.mp4 -vf "crop=900:100:250:580,fps=1" output_%05d.png
```
