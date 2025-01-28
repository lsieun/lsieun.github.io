---
title: "购买SSL证书"
sequence: "102"
---

## 概念

## 步骤

### 选择合适的https安全证书

### 生成证书请求文件CSR

用户进行https证书申请的第一步就是要生成CSR证书请求文件，系统会产生2个密钥，一个是公钥就是这个CSR文件，另外一个是私钥，存放在服务器上。
要生成CSR文件，站长可以参考WEB SERVER的文档，一般APACHE等，
使用OPENSSL命令行来生成KEY+CSR2个文件，Tomcat，JBoss，Resin等使用KEYTOOL来生成JKS和CSR文件，IIS通过向导建立一个挂起的请求和一个CSR文件。

### 将CSR提交给CA机构认证

CA机构一般有2种认证方式：

**域名认证**，一般通过对管理员邮箱认证的方式，这种方式认证速度快，但是签发的证书中没有企业的名称，只显示网站域名，也就是我们经常说的域名型https证书。

**企业文档认证**，需要提供企业的营业执照。国外https证书申请CA认证一般需要1-5个工作日。

同时认证以上2种方式的证书，叫EV SSL证书，EV SSL证书可以使浏览器地址栏变成绿色，所以认证也最严格。
EV SSL证书多应用于金融、电商、证券等对信息安全保护要求较高的领域。

### 获取https证书并安装

在收到CA机构签发的https证书后，将https证书部署到服务器上

## https安全证书多少钱？

安信SSL证书可提供Symantec、Geotrust、Comodo、Thawte以及RapidSSL等多家全球权威CA机构的SSL数字证书。
不同的SSL证书品牌价格不一样，便宜的有Comodo、RapidSSL的证书，一般几百元就可以申请一个，
高端的产品有Symantec、Geotrust等SSL证书，一般在百元至万元之间。

## 网站

### 阿里云

- 推荐指数：★★☆☆☆
- 免费证书类型：DV 域名型
- 免费证书品牌：DigiCert（原赛门铁克（Symantec））
- 免费通配符证书：不支持
- 易操作性：简单
- 证书有效期： 1年
- 自动更新：不支持
- 自动部署： 不支持
- 优点：有效期长

阿里云仅提供免费的单域名HTTPS证书，如果你仅只需要一个单域名的证书，可以使用阿里云的免费证书，毕竟DigiCert是大品牌，值得信赖。
在证书即将到期前，需要再次手动申请证书，不支持自动化申请和部署。申请链接：

### 腾讯云

- 推荐指数：★★☆☆☆
- 免费证书类型：DV 域名型
- 免费证书品牌：TrustAsia（即亚洲诚信）
- 免费通配符证书：不支持
- 易操作性：简单
- 证书有效期：1年
- 自动更新：不支持
- 自动部署：不支持

腾讯云同阿里云一样，仅提供免费的单域名HTTPS证书，如果你仅只需要一个单域名的证书，同样可以使用腾讯云的免费证书，TrustAsia也是比较大的品牌。
在证书即将到期前，需要再次手动申请证书，不支持自动化申请和部署。

### freessl.cn

- 推荐指数：★★★☆☆
- 免费证书类型：DV 域名型
- 免费证书品牌：Let's Encrypt、TrustAsia
- 免费通配符证书：支持Let's Encrypt的通配符类型证书
- 易操作性：简单
- 证书有效期：Let's Encrypt通配符证书有效期90天、TrustAsia双域名证书有效期1年
- 自动更新：不支持
- 自动部署：不支持

[freessl.cn][freessl-url]提供免费的Let's Encrypt和TrustAsia证书申请，Let's Encrypt支持通配符类型，TrustAsia仅支持双域名类型证书。
申请界面比较友好，根据提示在域名解析记录中添加指定的TXT类型域名解析即可，对于不会使用命令行的小白用户来说使用起来比较简单。
申请链接：https://freessl.cn/

### certbot

- 推荐指数：★★★☆☆
- 免费证书类型：DV 域名型
- 免费证书品牌：Let's Encrypt
- 免费通配符证书：支持
- 易操作性：困难
- 证书有效期： 90天
- 自动更新：支持
- 自动部署： 支持

这里先说下Let's Encrypt证书品牌：Let's Encrypt是免费、开放和自动化的世界知名证书颁发机构，由非盈利组织互联网安全研究小组（ISRG）运营。
Let's Encrypt已为全世界1.8亿个网站提供HTTPS证书，可放心使用。 

再说下这个certbot：certbot是一个脚本类型的Let's Encrypt证书申请客户端，需要一定的命令行使用经验方可操作，
如需自动更新，还需要添加插件，使用起来比较困难。
如有自动更新和自动部署需求，建议使用下面介绍的acme.sh和ohttps.com。

### acme.sh

- 推荐指数：★★★★★
- 免费证书类型：DV 域名型
- 免费证书品牌：Let's Encrypt
- 免费通配符证书：支持
- 易操作性：一般
- 证书有效期：90天
- 自动更新：支持
- 自动部署：支持

[acme.sh](https://github.com/acmesh-official/acme.sh)是一个知名的用于申请Let's Encrypt证书的开源项目，
项目地址：https://github.com/acmesh-official/acme.sh，也是属于脚本类型，有比较详细的文档，支持自动化更新和自动化部署。

唯一缺点，如果有更新后自动部署至多个节点的需求的话，`acme.sh`无法满足。

如果你有一定的命令行使用经验，`acme.sh`使用起来还是非常方便，强烈推荐！
关于更新后自动部署至多个节点的需求，建议使用下面介绍的ohttps.com。

### ohttps.com

- 推荐指数：★★★★★
- 免费证书类型：DV 域名型
- 免费证书品牌：Let's Encrypt
- 免费通配符证书：支持
- 易操作性：简单
- 证书有效期： 90天
- 自动更新：支持
- 自动部署：支持

[ohttps.com][ohttps-url]提供了类似于acme.sh的功能，不过提供了友好的管理界面，
可申请Let's Encrypt免费通配符类型证书，还提供了证书吊销、到期前提醒、自动更新、自动部署功能。
另外比acme.sh增加了一些非常实用的功能，主要包括可自动部署至阿里云、腾讯云、七牛云的负载均衡、内容分发CDN、SSL证书列表等，并可自动部署至多个nginx容器中。
如果你有在证书更新后自动部署至多个不同节点的需求，使用ohttps.com就对了，
在这里强烈推荐大家使用ohttps.com申请和管理Let's Encrypt颁发的免费HTTPS证书。申请链接：https://ohttps.com

## Reference

- [bitcert][bitcert-url]
  - [域名级 (DV) SSL/TLS 证书](https://bitcert.com/ssl/domain-validation)
  - [企业级 (OV) SSL/TLS 证书](https://bitcert.com/ssl/organization-validation)
  - [单域名 SSL/TLS 证书](https://bitcert.com/ssl/single-domain)
  - [通配符 SSL/TLS 证书](https://bitcert.com/ssl/wildcard)
- [freessl.cn][freessl-url]
- [OHTTPS - 免费 HTTPS 评书](https://ohttps.com/)

参考文章

- [免费申请HTTPS证书六大方法](https://zhuanlan.zhihu.com/p/138792764)
- [https安全证书如何申请 https证书申请流程及费用](https://zhuanlan.zhihu.com/p/77934782)

[bitcert-url]: https://bitcert.com
[freessl-url]: https://freessl.cn
[ohttps-url]: https://ohttps.com


