---
title: "Jekyll 常用命令"
sequence: "102"
---

[UP](/jekyll/jekyll-index.html)

## Jekyll Serve Command

运行jekyll的命令：

```bash
# 运行
$ bundle exec jekyll serve
# 后台运行
$ bundle exec jekyll serve --detach
# 在80端口运行
$ bundle exec jekyll serve --detach --host 10.0.8.4 --port 80
# 使用https协议
$ bundle exec jekyll serve --detach --host 10.0.8.4 --port 443 --ssl-key private.key --ssl-cert cert.pem
```

结束jekyll进程的命令：

```bash
pkill -f jekyll
kill -9 process_id
```

## just-run.sh

```bash
#/bin/bash
bundle exec jekyll serve --unpublished
```

```text
bundle exec jekyll serve --drafts --unpublished
bundle exec jekyll build --drafts --unpublished --incremental
```

## References

- [jekyllrb.com: Serve Command Options](https://jekyllrb.com/docs/configuration/options/#serve-command-options)
