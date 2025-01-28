---
title: "npm与包"
sequence: "202"
---

## 包

### 什么是包

Node.js中的第三方模块，又叫作**包**。换句话说，第三方模块和包指的是同一个概念，只不过叫法不同。

### 包的来源

不同于Node.js中的内置模块与自定义模块，包是由第三方个人或团队开发出来的，免费供所有人使用。

注意：Node.js中的包都是免费且开源的，不需要付费即可免费下载使用。

### 为什么需要包

由于Node.js的内置模块仅提供了一些底层的API，导致在基于内置模块进行项目开发时，效率很低。

包是基于内置模块封装出来的，提供了更高级、更方便的API，极大的提高了开发效率。

包和内置模块之间的关系，类似于jQuery和浏览器内置API之间的关系。

### 从哪里下载包

国外有一家IT公司，叫作**npm, Inc.** 

这家公司旗下有一个非常著名的网站：[https://www.npmjs.com/][npm-search]
它是全球最大的包共享平台，从这个网站上可以搜索到任何需要的包。

**npm, Inc.公司**提供了一个地址为[https://registry.npmjs.org/][npm-repo]
的服务器，来对外共享所有的包，我们可以从这个服务器上下载自己所需要的包。

注意：

- 从[https://www.npmjs.com/][npm-search]网站上搜索自己的所需要的包
- 从[https://registry.npmjs.org/][npm-repo]服务器上下载自己需要的包

### 如何下载包

**npm, Inc.公司**提供了一个包管理工作，我们可以使用这个包管理工具，
从[https://registry.npmjs.org/][npm-repo]服务器把需要的包下载到本地使用。

这个包管理工具的名字叫做**Node Package Manager**（简称 **npm包管理工具**），
这个包管理工具随着Node.js的安装包一起被安装到用户的电脑上。

查看npm包管理工具的版本：

```text
npm -v
```

## npm初体验

### 格式化时间的传统做法

### 格式化时间的高级做法

- 使用npm包管理工具，在项目中安装格式化时间的包 moment
- 使用`require()`导入格式化时间的包
- 参考moment的官方API文档对时间进行格式化

```text
// 1. 导入moment包
const moment = require('moment');

// 2. 参考moment官方API文档，调用对应的方法，对时间进行格式化
// 2.1. 调用moment()方法，得到当前的时间
// 2.2. 针对当前的时间，调用format()方法，按照指定的格式进行时间的格式化。
const dt = moment().format('YYYY-MM-DD HH:mm:ss');

console.log(dt);
```

### 在项目中安装包的命令

如果想在项目中安装指定名称的包，需要运行如下的命令：

```text
npm install 包的完整名称
```

上述的装包命令，可以简写成如下格式：

```text
npm i 完整的包名称
```

### 初次装包后多了哪些文件

初次装包完成后，在项目文件夹下多一个叫作`node_modules`的文件夹
和`pakcage-lock.json`的配置文件。

其中，

- `node_modules`文件夹用来存放所有已安装到项目中的包。`require()`导入第三方包时，就是从这个目录中查找并加载包。
- `package-lock.json`配置文件用来记录`node_modules`目录下的每一个包的下载信息，例如包的名字、版本号、下载地址等。

注意：程序员不要手动修改`node_modules`或`package-lock.json`文件中的任何代码，npm包管理工具会自动维护它们。

### 安装指定版本的包

默认情况下，使用`npm install`命令安装包的时候，**会自动安装最新版本的包**。
如果需要安装指定版本的包，可以在包名之后，通过`@`符号指定具体的版本：

```text
npm install moment@2.22.2
```

### 包的语义化版本规范

包的版本号是以“点分十进制”形式进行定义，总共有三位数字，例如`2.24.0`

其中每一位数字所代表的含义如下：

- 第1位数字：大版本 （底层发生重构）
- 第2位数字：功能版本
- 第3位数字：Bug修复版本

**版本号提升的规则**：只要前面的版本号增长了，则后面的版本号**归零**。

```text
npm view webpack versions
```

[npm-search]: https://www.npmjs.com/
[npm-repo]: https://registry.npmjs.org/
