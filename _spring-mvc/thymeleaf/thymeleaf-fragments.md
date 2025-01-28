---
title: "Fragments in Thymeleaf"
sequence: "102"
---

We will often want to include in our templates fragments from other templates.
Common uses for this are footers, headers, menus…

In order to do this, Thymeleaf needs us to define the fragments available for inclusion,
which we can do by using the `th:fragment` attribute.

## 两个文件

### foot.html

```html
<!DOCTYPE html SYSTEM "http://www.thymeleaf.org/dtd/xhtml1-strict-thymeleaf-4.dtd">

<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:th="http://www.thymeleaf.org">

<body>

<div th:fragment="copy">
    &copy; 2011 The Good Thymes Virtual Grocery
</div>

</body>

</html>
```

### index.html

The code above defines a fragment called `copy` that we can easily include in our home page
using one of the `th:include` or `th:replace` attributes:

```text
<body>

  ...

  <div th:include="footer :: copy"></div>
  
</body>
```

## 三种方式

There are three different formats:

"`templatename::domselector`" or the equivalent `templatename::[domselector]`:
Includes the fragment resulting from executing the specified DOM Selector on the template named `templatename`.

> 第一种格式

Note that `domselector` can be a mere fragment name,
so you could specify something as simple as `templatename::fragmentname` like in the `footer :: copy` above.

"`templatename`" Includes the complete template named `templatename`.

> 第二种格式

Note that the template name you use in `th:include`/`th:replace` tags will have to be resolvable
by the Template Resolver currently being used by the Template Engine.

`::domselector` or `this::domselector`: Includes a fragment from the same template.

> 第三种格式

## fully-featured expressions

Both `templatename` and `domselector` in the above examples
can be fully-featured expressions (even conditionals!) like:

```text
<div th:include="footer :: (${user.isAdmin}? #{footer.admin} : #{footer.normaluser})"></div>
```

Fragments can include any `th:*` attributes.
These attributes will be evaluated once the fragment is included into the target template
(the one with the `th:include`/`th:replace` attribute),
and they will be able to reference any context variables defined in this target template.

A big advantage of this approach to fragments is that
you can write your fragments' code in pages that are perfectly displayable by a browser,
with a complete and even validating XHTML structure,
while still retaining the ability to make Thymeleaf include them into other templates.

## Referencing fragments without th:fragment

Besides, thanks to the power of DOM Selectors, we can include fragments that do not use any `th:fragment` attributes.
It can even be markup code coming from a different application with no knowledge of Thymeleaf at all:

```text
...
<div id="copy-section">
  &copy; 2011 The Good Thymes Virtual Grocery
</div>
...
```

We can use the fragment above simply referencing it by its `id` attribute, in a similar way to a CSS selector:

```text
<body>
  ...
  <div th:include="footer :: #copy-section"></div>

</body>
```

## Difference between th:include and th:replace

And what is the difference between `th:include` and `th:replace`?
Whereas `th:include` will include the contents of the fragment into its host tag,
`th:replace` will actually substitute the host tag by the fragment's.
So that an HTML5 fragment like this:

```text
<footer th:fragment="copy">
  &copy; 2011 The Good Thymes Virtual Grocery
</footer>
```

…included twice in host `<div>` tags, like this:

```text
<body>

  ...

  <div th:include="footer :: copy"></div>
  <div th:replace="footer :: copy"></div>
  
</body>
```

…will result in:

```text
<body>

  ...

  <div>
    &copy; 2011 The Good Thymes Virtual Grocery
  </div>
  <footer>
    &copy; 2011 The Good Thymes Virtual Grocery
  </footer>
  
</body>
```

The `th:substituteby` attribute can also be used as an alias for `th:replace`, but the latter is recommended.
Note that `th:substituteby` might be deprecated in future versions.

## Parameterizable fragment signatures

In order to create a more function-like mechanism for the use of template fragments,
fragments defined with `th:fragment` can specify a set of parameters:

```text
<div th:fragment="frag (onevar,twovar)">
    <p th:text="${onevar} + ' - ' + ${twovar}">...</p>
</div>
```

This requires the use of one of these two syntaxes to call the fragment from `th:include`, `th:replace`:

```text
<div th:include="::frag (${value1},${value2})">...</div>
<div th:include="::frag (onevar=${value1},twovar=${value2})">...</div>
```

Note that order is not important in the last option:

```text
<div th:include="::frag (twovar=${value2},onevar=${value1})">...</div>
```

### Fragment local variables without fragment signature

Even if fragments are defined without signature, like this:

```text
<div th:fragment="frag">
    ...
</div>
```

We could use the second syntax specified above to call them (and only the second one):

```text
<div th:include="::frag (onevar=${value1},twovar=${value2})">
```

This would be, in fact, equivalent to a combination of `th:include` and `th:with`:

```text
<div th:include="::frag" th:with="onevar=${value1},twovar=${value2}">
```

Note that this specification of local variables for a fragment
—no matter whether it has a signature or not— does not cause the context to emptied previously to its execution.
Fragments will still be able to access every context variable being used at the calling template like they currently are.

### th:assert for in-template assertions

The `th:assert` attribute can specify a comma-separated list of expressions
which should be evaluated and produce `true` for every evaluation, raising an exception if not.

```text
<div th:assert="${onevar},(${twovar} != 43)">...</div>
```

This comes in handy for validating parameters at a fragment signature:

```text
<header th:fragment="contentheader(title)" th:assert="${!#strings.isEmpty(title)}">...</header>
```

## Simple Fragment Inclusion

First of all, we'll use reuse common parts in our pages.

We can define these parts as fragments, either in isolated files or in a common page.
In this project, these reusable parts are defined in a folder named `fragments`.

There are three basic ways to include content from a fragment:

- **insert** – inserts content inside the tag
- **replace** – replaces the current tag with the tag defining the fragment
- **include** – this is deprecated but it may still appear in a legacy code

The next example, `fragments.html`, shows the use of all three ways.
This Thymeleaf template adds fragments in the head and the body of the document:

```text
<!DOCTYPE HTML>
<html xmlns:th="http://www.thymeleaf.org">
<head>
<title>Thymeleaf Fragments: home</title>
<!--/*/ <th:block th:include="fragments/general.html :: headerfiles">
        </th:block> /*/-->
</head>
<body>
    <header th:insert="fragments/general.html :: header"> </header>
    <p>Go to the next page to see fragments in action</p>
    <div th:replace="fragments/general.html :: footer"></div>
</body>
</html>
```

Now, let's take a look at a page that holds some fragments.
It's called `general.html`,
and it's like a whole page with some parts defined as fragments ready to be used:

```html
<!DOCTYPE HTML>
<html xmlns:th="http://www.thymeleaf.org">
<head th:fragment="headerfiles">
<meta charset="UTF-8" />
<link th:href="@{/css/styles.css}" rel="stylesheet">
</head>
<body>
    <div th:fragment="header">
        <h1>Thymeleaf Fragments sample</h1>
    </div>
    <p>Go to the next page to see fragments in action</p>
    <aside>
        <div>This is a sidebar</div>
    </aside>
    <div class="another">This is another sidebar</div>
    <footer th:fragment="footer">
        <a th:href="@{/fragments}">Fragments Index</a> | 
        <a th:href="@{/markup}">Markup inclussion</a> | 
        <a th:href="@{/params}">Fragment params</a> | 
        <a th:href="@{/other}">Other</a>
    </footer>
</body>
</html>
```

## References

- [Template Layout](https://www.thymeleaf.org/doc/tutorials/2.1/usingthymeleaf.html#including-template-fragments)
- [Fragments in Thymeleaf](https://www.baeldung.com/spring-thymeleaf-fragments)
