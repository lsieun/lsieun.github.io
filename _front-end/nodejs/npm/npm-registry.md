---
title: "npm源"
sequence: "202"
---

对应于`~/.npmrc`文件

## npm

```text
npm config set registry https://registry.npmmirror.com/
```

```text
$ npm config get registry
https://registry.npmmirror.com/
```

```text
npm config set registry http://192.168.1.22:8081/repository/npm-public/
```

```text
npm config set registry http://nexus.lan.net:8081/repository/npm-public/
```

测试一下：

```text
npm info underscore
```

## yarn

```text
yarn config get registry
https://registry.yarnpkg.com
```

```text
yarn config set registry http://192.168.1.22:8081/repository/npm-public/
```

测试一下：

```text
yarn info underscore
```

```text
yarn install --verbose
```

## nrm

安装`nrm`：

```text
$ npm install -g nrm
```

列出源的候选项：

```text
$ nrm ls

  npm ---------- https://registry.npmjs.org/
  yarn --------- https://registry.yarnpkg.com/
  tencent ------ https://mirrors.cloud.tencent.com/npm/
  cnpm --------- https://r.cnpmjs.org/
  taobao ------- https://registry.npmmirror.com/
  npmMirror ---- https://skimdb.npmjs.com/registry/
```

切换源：

```text
nrm use taobao
```

测试速度：

```text
nrm test npm
```

## Reference

- [阿里云-开发者社区-npm](https://developer.aliyun.com/mirror/NPM)
- [阿里云-镜像站](https://developer.aliyun.com/mirror/)

