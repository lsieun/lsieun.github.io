---
title: "XPath"
sequence: "204"
---

XPath = XML Path

作用：主要是用于快速获取所需的节点对象。

在Dom4j中如何使用XPath技术：

- 导入XPath的Jar包：`jaxen`
- 使用XPath的方法：
  - List<Node> selectNodes(String xpathExpression)
  - List<Node> selectNodes(String xpathExpression, String comparisonXPathExpression);
  - List<Node> selectNodes(String xpathExpression, String comparisonXPathExpression, boolean removeDuplicates);
  - single
    - Node selectSingleNode(String xpathExpression);
    - String valueOf(String xpathExpression);
    - Number numberValueOf(String xpathExpression);

- 目录
  - `/`：表示“根”
  - `//`：不考虑层级关系，进行匹配
- 元素
  - `xxx`：查找`xxx`元素
  - `*`：表示所有元素：`/*/*/*/BBB`
- 属性（索引）
  - `[1]`：找到第1个元素
  - `[last()]`：找到最后一个元素
- 属性
  - `@`: `//@id`选择所有的id属性
  - `//BBB[@id]`：选择有id属性的BBB元素
  - `//BBB[@id='b1']`：选择含有id属性且其值为'b1'的BBB元素
  - `//BBB[@*]`：选择有任意属性的BBB元素
  - `//BBB[not(@*)]`：选择没有属性的BBB元素

- `//*`: 选择所有元素

## Reference

- [XPath Tutorial](https://www.w3schools.com/xml/xpath_intro.asp)
- [XPathTutorial](http://www.zvon.org/xxl/XPathTutorial/General/examples.html)