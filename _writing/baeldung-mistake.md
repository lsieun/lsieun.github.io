---
title: "Baeldung-我的错误"
sequence: "211"
---

## 格式

### 斜体

Words that are code elements, like types, classes, methods, etc, should be written in their natural case and italicized.

- Java语言当中的概念：
  - boolean类型的值：`true`和`false`。
  - primitive types: `int`, `float`, `long`, `double`等。
  - `null`要用斜体
  - Java关键字（例如`instanceof`）都用斜体。
  - 注解：When `@version` or `@since` appear in the section headings, it should be in **italics**
- 公式：`(indexbyte1 &lt;&lt; 8) | indexbyte2`

We need to italicize it only when referring to the Java data type "byte".
When talking about the general concept of bytes itself, no italics are needed.

### 加粗体

正确的做法：不要将最后的`.`也加粗

In the same way, <strong>we can utilize an intermediate <em>long</em> value and the <em>Double.longBitsToDouble()</em> method to convert a <em>byte</em> array to a <em>double</em> value</strong>.

### 双引号

好像对于package的名字，可以加斜体和双引号：

```text
"<em>sun.misc</em>"
```

## 书写

- 要用"Java"，不用"java"。（首字母大写）
- 有些内容之前，一定要加"the"：
  - 要用"the JVM"，不直接用"JVM"。
  - 要用"the Java compiler"，不直接用"Java compiler"。
- 一般要用"primitive types"（用复数形式），不用"primitive type"（单数形式）。因为大多数情况会涉及到`int`, `float`, `long`, `double`多个类型，

## 同义词替换

- so: therefore
- besides: additionally



When defining constants in the article, let's remove the "private static final" qualifiers.

错误的写法：

```text
private static final byte[] INT_BYTE_ARRAY = new byte[] {
    (byte) 0xCA, (byte) 0xFE, (byte) 0xBA, (byte) 0xBE
};
private static final int INT_VALUE = 0xCAFEBABE;
```

正确的写法：

```text
byte[] INT_BYTE_ARRAY = new byte[] {
    (byte) 0xCA, (byte) 0xFE, (byte) 0xBA, (byte) 0xBE
};
int INT_VALUE = 0xCAFEBABE;
```

我可能经常用错firstly和secondly：（错误的）

From the code snippet above, we can learn that a <em>byte</em> array can't be transformed directly into a <em>float</em> value. Basically, it takes two separate steps: **firstly**, we transfer from a <em>byte</em> array to an <em>int</em> value; **secondly**, we interpret the same bit pattern into a <em>float</em> value.

修改过之后（正确的）：

From the code snippet above, we can learn that a <em>byte</em> array can't be transformed directly into a <em>float</em> value. Basically, it takes two separate steps: **First**, we transfer from a <em>byte</em> array to an <em>int</em> value, **and then** we interpret the same bit pattern into a <em>float</em> value.

## 行文

### jump ahead

One of the problems is jump ahead. You are obviously a really clever guy. Because you know the maths behind this.

You are assuming that the reader can keep up, and I'm missing some of the steps.
That you're taking, so you start one place, and then suddenly you're somewhere along way down the road.

Often, you say how simple a solution is when you've jumped two steps ahead.
And generally, in our articles, we don't say things are simple, because if somebody doesn't find it simple.
It makes it harder for them, because you tell them it's easy, and they think it's hard, and so they feel bad, and so generally, we show them it's simple, but we don't say it.

解决方法：

So what we need to do in our articles is just unfold the information one simple step at a time,
so people can feel it, so they can follow it, so they can get us into their mind,
even if they don't have the background knowledge that that you have.

As I say, it's hard sometimes I think if you know a subject really well, it's hard to focus on.

The simple thing something means to do, and it's hard to realize that they won't see it as as naturally as you obviously see it. And you know, there are some really Clever.

yes, of course that's really clever, but the problem is that clever can be hard for somebody to understand.

第一步，说明“我想要做什么”。第二步，说明“怎么做的”。

### filler language

The next issue we have is that there's a lots of Talking, but no advancing of the story.
It's just filler language rather than direct information.

If it is easy, they know that; If it's not easy, they don't want to be told, it's easy to other people.

"The above code snippet is very straightforward", only if you understood, it.
Um, if it was that straightforward, we either wouldn't need to say it or we wouldn't need to explain it, so it's a lot simpler to just not say that.
just cutting it down and and making more precise.

### motivation

And I think we have to have a motivation for every option that we include, there has to be a reason for it.
Whether it's performance, whether it's Easier codes to write, I think, for example, in the big images section.

首先，预期目标。你知道自己要明确的做什么。
其次，整体思路。你对解决现在的这个问题也有了整体的思路。
最后，编码实现。唯一你所欠缺的只是技术细节的处理。

I don't know that there's a specific formula for how to do this, but a few ideas spring to mind:

- What's the simplest possible example?
- How do we add a small variation to that example?
- Where there's a more complex approach, can we break that down?
- Can we SHOW more than tell each step?
- Can we explain the important parts of what's just happened? (and not get slowed down by the bits the reader can guess)
- Can we build things up an easy piece at a time?
- What's "on track" and what's a distraction?

I think I use these questions when I edit, but more by instinct than by checklist.


"After Java 9 or later" is redundant. Remove "or later" or change to "In Java 9 and later versions".
