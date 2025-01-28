---
title: "分词器"
sequence: "104"
---

IK分词全名为IK Analyzer

IK分词是一款国人作者林良益开发的相对简单的中文分词器，IKAnalyzer 是一个开源的，基于java语言开发的轻量级的中文分词工具包。
从2006年12月推出1.0版开始，IKAnalyzer已经推出 了3个大版本。
最初，它是以开源项目 Lucene为应用主体的，结合词典分词和文法分析算法的中文分词组件。
新版本的IKAnalyzer3.0则发展为 面向Java的公用分词组件，独立于Lucene项目，同时提供了对Lucene的默认优化实现。

IK 这个名字是来源于暗黑破坏神2这款游戏，它是游戏中武器装备的名字。
刚好我在做这个分词器的时候，我也在玩这款游戏，而且刚好打到这个装备，很开心。
我们想想 Java 也是开发人员在开发的过程中正好在喝咖啡，所以就叫了 Java 这个名字。
所以那时候我也在想，给这个分词器命名的话，我就把它命名为 Immortal King，中文名叫不朽之王，是那个装备的名称。
这个名字就是这么来的。

Elasticsearch

- 在创建倒排索引时，需要对文档分词；
- 在搜索时，需要对用户输入内容分词。

但是，默认的分词规则对中文处理并不友好。

在 Kibana 的 DevTools 中测试：

```text
POST /_analyze
{
  "analyzer": "standard",
  "text": "我现在正在学习Elasticsearch"
}
```

```text
POST /_analyze
{
  "analyzer": "english",
  "text": "我现在正在学习Elasticsearch"
}
```

POST /_analyze
{
"analyzer": "chinese",
"text": "我现在正在学习Elasticsearch"
}

```text
{
  "tokens" : [
    {
      "token" : "我",
      "start_offset" : 0,
      "end_offset" : 1,
      "type" : "<IDEOGRAPHIC>",
      "position" : 0
    },
    {
      "token" : "现",
      "start_offset" : 1,
      "end_offset" : 2,
      "type" : "<IDEOGRAPHIC>",
      "position" : 1
    },
    {
      "token" : "在",
      "start_offset" : 2,
      "end_offset" : 3,
      "type" : "<IDEOGRAPHIC>",
      "position" : 2
    },
    {
      "token" : "正",
      "start_offset" : 3,
      "end_offset" : 4,
      "type" : "<IDEOGRAPHIC>",
      "position" : 3
    },
    {
      "token" : "在",
      "start_offset" : 4,
      "end_offset" : 5,
      "type" : "<IDEOGRAPHIC>",
      "position" : 4
    },
    {
      "token" : "学",
      "start_offset" : 5,
      "end_offset" : 6,
      "type" : "<IDEOGRAPHIC>",
      "position" : 5
    },
    {
      "token" : "习",
      "start_offset" : 6,
      "end_offset" : 7,
      "type" : "<IDEOGRAPHIC>",
      "position" : 6
    },
    {
      "token" : "elasticsearch",
      "start_offset" : 7,
      "end_offset" : 20,
      "type" : "<ALPHANUM>",
      "position" : 7
    }
  ]
}
```

## 中文分词器

处理中文分词，一般会使用 IK 分词器：

```text
https://github.com/medcl/elasticsearch-analysis-ik
```

## 安装 IK 分词器

### 安装 IK 插件 （在线较慢）

```bash
# 进入容器内部
docker exec -it elasticsearch /bin/bash

# 在线下载并安装
./bin/elasticsearch-plugin install https://github.com/medcl/elasticsearch-analysis-ik/releases/download/v8.7.0/elasticsearch-analysis-ik-8.7.0.zip

# 退出
exit

# 重启容器
docker restart elasticsearch
```

### 离线安装 IK 插件 （推荐）

#### 查看数据卷目录

安装插件需要知道 Elasticsearch 的 `plugins` 目录位置。而我们用了数据卷挂载，因此需要查看 Elasticsearch 的数据卷目录。
通过以下命令查看：

```text
docker volume inspect es-plugins
```

#### 解压缩分词器安装包

将 `elasticsearch-analysis-ik-8.7.0.zip` 解压缩，重命名为 `ik`：

```text
$ unzip elasticsearch-analysis-ik-8.7.0.zip -d ~/ik
```

移动到 `/opt/elasticsearch/plugins` 目录：

```text
$ mv ~/ik /opt/elasticsearch/plugins/
```

#### 重启容器

```text
docker restart elasticsearch
```

查看日志：

```text
docker logs -f elasticsearch
```

```text
java.lang.IllegalArgumentException:
 Plugin [analysis-ik] was built for Elasticsearch version 8.7.0 but version 7.17.10 is running
	at org.elasticsearch.plugins.PluginsService.verifyCompatibility(PluginsService.java:391)
```

#### 测试

IK 分词器包含两种模式：

- `ik_smart`：最少切分
- `ik_max_word`：最细切分

```text
POST /_analyze
{
  "analyzer": "ik_smart",
  "text": "IK Analyzer是林良益开发的中文分词器。"
}
```

```text
POST /_analyze
{
  "analyzer": "ik_max_word",
  "text": "IK Analyzer是林良益开发的中文分词器。"
}
```

## 拓展词库

要拓展 IK 分词器的词库，只需要修改一个 IK 分词器目录中的 `cofig` 目录中的 `IKAnalyzer.cfg.xml` 文件：

```text
$ cat IKAnalyzer.cfg.xml
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE properties SYSTEM "http://java.sun.com/dtd/properties.dtd">
<properties>
    <comment>IK Analyzer 扩展配置</comment>
    <!--用户可以在这里配置自己的扩展字典 -->
    <entry key="ext_dict"></entry>
    <!--用户可以在这里配置自己的扩展停止词字典-->
    <entry key="ext_stopwords"></entry>
    <!--用户可以在这里配置远程扩展字典 -->
    <!-- <entry key="remote_ext_dict">words_location</entry> -->
    <!--用户可以在这里配置远程扩展停止词字典-->
    <!-- <entry key="remote_ext_stopwords">words_location</entry> -->
</properties>
```

### 扩展词词典

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE properties SYSTEM "http://java.sun.com/dtd/properties.dtd">
<properties>
    <comment>IK Analyzer 扩展配置</comment>
    <!--用户可以在这里配置自己的扩展字典 -->
    <entry key="ext_dict">ext.dic</entry>
</properties>
```

### 停用词词典

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE properties SYSTEM "http://java.sun.com/dtd/properties.dtd">
<properties>
    <comment>IK Analyzer 扩展配置</comment>
    <!--用户可以在这里配置自己的扩展字典 -->
    <entry key="ext_dict">ext.dic</entry>
    <!--用户可以在这里配置自己的扩展停止词字典-->
    <entry key="ext_stopwords">stopword.dic</entry>
</properties>
```

```text
$ vi ext.dic
```

```text
$ cat ext.dic 
林良益

```

```text
$ vi stopword.dic
```

```text
$ cat stopword.dic
...
是
的
```

```text
POST /_analyze
{
  "analyzer": "ik_smart",
  "text": "IK Analyzer是林良益开发的中文分词器。"
}
```

```text
{
  "tokens" : [
    {
      "token" : "ik",
      "start_offset" : 0,
      "end_offset" : 2,
      "type" : "ENGLISH",
      "position" : 0
    },
    {
      "token" : "analyzer",
      "start_offset" : 3,
      "end_offset" : 11,
      "type" : "ENGLISH",
      "position" : 1
    },
    {
      "token" : "林良益",
      "start_offset" : 12,
      "end_offset" : 15,
      "type" : "CN_WORD",
      "position" : 2
    },
    {
      "token" : "开发",
      "start_offset" : 15,
      "end_offset" : 17,
      "type" : "CN_WORD",
      "position" : 3
    },
    {
      "token" : "中文",
      "start_offset" : 18,
      "end_offset" : 20,
      "type" : "CN_WORD",
      "position" : 4
    },
    {
      "token" : "分词器",
      "start_offset" : 20,
      "end_offset" : 23,
      "type" : "CN_WORD",
      "position" : 5
    }
  ]
}
```

## 总结

- 第一，分词器的作用是什么？
    - 创建倒排索引时对文档分词
    - 用户搜索时，对输入的内容分词
- 第二，IK 分词器有几种模式？
    - `ik_smart`：智能切分，粗粒度
    - `ik_max_word`：最细切分，细粒度。

trade off：切分粒度越细，文档被搜索到的概率越高，但占用的内存也越大。

- 第三，IK 分词器如何拓展词条？如何停用词条？
  - 通过修改 IK 分词器目录中的 `cofig` 目录中的 `IKAnalyzer.cfg.xml` 文件

## Reference

- [IK Analysis for Elasticsearch](https://github.com/medcl/elasticsearch-analysis-ik)
