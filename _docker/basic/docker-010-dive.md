---
title: "dive"
sequence: "110"
---

## Intro

dive: A tool for exploring a docker image, layer contents,
and discovering ways to shrink the size of your Docker/OCI image.

GitHub:

```text
https://github.com/wagoodman/dive
```

GitHub Release

```text
https://github.com/wagoodman/dive/releases
```

## Installation

### RHEL/Centos

```text
$ curl -OL https://github.com/wagoodman/dive/releases/download/v0.10.0/dive_0.10.0_linux_amd64.rpm
$ sudo rpm -i dive_0.10.0_linux_amd64.rpm
```

## Usage

To analyze a Docker image simply run dive with an image tag/id/digest:

```text
dive <your-image-tag>
```

or if you want to build your image then jump straight into analyzing it:

```text
dive build -t <some-tag> .
```

## KeyBinding

| Key Binding    | Description                                        |
|----------------|----------------------------------------------------|
| `Ctrl + C`     | Exit                                               |
| `Tab`          | Switch between the layer and filetree views        |
| `Ctrl + F`     | Filter files                                       |
| `PageUp`       | Scroll up a page                                   |
| `PageDown`     | Scroll down a page                                 |
| `Ctrl + A`     | Layer view: see aggregated image modifications     |
| `Ctrl + L`     | Layer view: see current layer modifications        |
| `Space`        | Filetree view: collapse/uncollapse a directory     |
| `Ctrl + Space` | Filetree view: collapse/uncollapse all directories |
| `Ctrl + A`     | Filetree view: show/hide added files               |
| `Ctrl + R`     | Filetree view: show/hide removed files             |
| `Ctrl + M`     | Filetree view: show/hide modified files            |
| `Ctrl + U`     | Filetree view: show/hide unmodified files          |
| `Ctrl + B`     | Filetree view: show/hide file attributes           |
| `PageUp`       | Filetree view: scroll up a page                    |
| `PageDown`     | Filetree view: scroll down a page                  |
