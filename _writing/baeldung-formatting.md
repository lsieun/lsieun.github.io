---
title: "Baeldung formatting"
sequence: "202"
---

## title capitalization

- the **title**, **main sections** and **subsections** should follow Title Capitalization ([rules](http://grammar.yourdictionary.com/capitalization/rules-for-capitalization-in-titles.html)) ([online tool](https://capitalizemytitle.com/) - option 1)

## sections and subsections

- the structure of the article should be organized in **Sections** and **Subsections**
- sections should `H2`
- sub-sections should use `H3`

- example:

```text
1. Overview // H2
2. Stuff  // H2
2.1. Subsection 1  // H3
2.2. Subsection 2  // H3
3. More Stuff // H2
4. Conclusion // H2
```

- generally - there should be **no sub-sub-sections**
  ex: 3.1.1. Something


- all sections and subsections should **have numbers** (including the **Overview** and the **Conclusion**)
- **correct**:

```text
2.1. Text
```

- **incorrect**:

```text
2.1 Text         // missing period char
2.1.  Text       // two spaces before the text
…
```

## code snippets in text (not full code samples)

- any small code snippet used within normal text **should be Italicized**
- for example: Each _HttpMessageConverter_ implementation has one or several associated MIME Types
- notice how **the name of the class** is italicized

- this applies to **sections** and **subsections** as well

- **Java imports should be skipped** from code samples (unless they're absolutely necessary)

## double spaces

- there should be no occurrence of double spaces in the article;

ex:

- **correct**: `the code`（单词the和code之间有1个空格）
- **incorrect**: `the  code`（单词the和code之间有2个空格）
- note: this of course doesn't apply to **code samples** - these will indeed have double spaces - these are fine, since it's the normal way to indent the code

## bulleted lists

- **the rule**: the elements of a bulleted list shouldn't end with **a period** (the exception being when a bullet point contains a full sentence)

- **example - incorrect**:

Here's a list of stuff:（错误示例，结尾不应该有"."）

- Point number one.
- Another point.
- Yet another point.

- **example - correct**:

Here's a list of stuff:（正确示例）

- Point number one
- Another point
- Yet another point


## using images

- most articles don't actually have images
- but, when you do need to use images in an article, preview the article and make sure the images are actually readable
- notice that, in the editor - if you click on an image and edit it - you'll be able to select a custom size
- if the full size is too large, you can go with a width of 500px - that is usually good (but still preview it to check)
- if the image displays lot of extra space below it, choose "Align center" for the image


## links shouldn't include the spacing around a word

- example 1 - incorrect: [FastJson ](https://github.com/alibaba/fastjson)is a lightweight Java library [...]
- example 1 - correct: [FastJson](https://github.com/alibaba/fastjson) is a lightweight Java library [...]

## disable converting plain text characters

- Wordpress automatically converts certain [characters](https://developer.wordpress.org/reference/functions/wptexturize/#more-information) to formatted entities (such as em-dash or quotation marks)
- you can disable this by using the "**Disable wptexturize**" checkbox in the editor


