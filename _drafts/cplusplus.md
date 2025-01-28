---
title: "C++"
permalink: /cplusplus.html
---

C++ is a general-purpose programming language created by Bjarne Stroustrup
as an extension of the C programming language, or "C with Classes".

## Preprocessor

- [Preprocessor Intro]({% link _cplusplus/preprocessor/preprocessor-intro.md %})
- [#define]({% link _cplusplus/preprocessor/define.md %})
- [#include]({% link _cplusplus/preprocessor/include.md %})
- [Conditional Compilation: #ifdef, #endif]({% link _cplusplus/preprocessor/conditional-compilation.md %})
- [Predefined Macro Names]({% link _cplusplus/preprocessor/predefined-macro-names.md %})

## All

{%
assign filtered_posts = site.cplusplus |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}" target="_blank">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>

## Reference

- [cplusplus](https://www.cplusplus.com/doc/tutorial/)
- [Microsoft: C++ language documentation](https://docs.microsoft.com/en-us/cpp/cpp/)
