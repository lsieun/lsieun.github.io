---
title: "MathJax Installation"
sequence: "101"
---

<h2>Introduction</h2>

<p class="indented">
    MathJax is an open-source JavaScript display engine for LaTeX, MathML, and AsciiMath notation that works in all modern browsers.
</p>

<h2>Minimize MathJax Package</h2>

<p class="indented">
    MathJax is a pretty big javascript package, but you can make it work after you stripped off most of the files.
    The final package size could be around <code>580KB</code>.
</p>

<h3>Download MathJax</h3>

<p class="indented">
    Download <a class="external" href="https://github.com/mathjax/MathJax/archive/2.7.7.zip" target="_blank">MathJax Version 2.7.7.zip</a>
</p>

<h3>Choose Your Configuration</h3>

<p class="indented">
    MathJax supports a very wide range of input and output methods. That is the reason that it is big package.
    Therefore the most important thing in MathJax size reduction is to decide what input and output method you want to support.
    In this way you only need to have those sources that implement that methods by throwing away the rest of the package.
</p>

<p class="indented">
    In my example, I wanted to have <strong>LaTEX</strong> input and <strong>Common HTML</strong> output.
</p>

<h3>The Reducing Method</h3>

<p class="indented">
    The best way to reduce your MathJax package is to create a simple html page, that uses MathJax as you would use it anyway,
    then remove almost every package content, and then add the ones that it tries to load but fails because the file isn't present.
    In this way you will end up a package that contains just the right resources to render your equations.
</p>



<p class="indented">
    A simple html page (<b>Note</b>: make sure to specify a <code>?config=</code> option):
</p>

```text
<script type="text/javascript" async src="mathjax/MathJax.js?config=TeX-AMS_CHTML"></script>
```

```text
<p>
    When \(a \ne 0\), there are two solutions to \(ax^2 + bx + c = 0\) and they are
    \[x = {-b \pm \sqrt{b^2-4ac} \over 2a}.\]
</p>
```

<fieldset>
    <legend>显示效果</legend>
    <p>
        When \(a \ne 0\), there are two solutions to \(ax^2 + bx + c = 0\) and they are
        \[x = {-b \pm \sqrt{b^2-4ac} \over 2a}.\]
    </p>
</fieldset>

<h3>Minimal MathJax Package</h3>

```text
MathJax-2.7.7
├── MathJax.js
├── config
│   └── TeX-AMS_CHTML.js
├── fonts
│   └── HTML-CSS
│       └── TeX
│           └── woff
│               ├── MathJax_AMS-Regular.woff
│               ├── MathJax_Main-Regular.woff
│               ├── MathJax_Math-Italic.woff
│               ├── MathJax_Size1-Regular.woff
│               ├── MathJax_Size2-Regular.woff
│               ├── MathJax_Size3-Regular.woff
│               ├── MathJax_Size4-Regular.woff
│               └── MathJax_Vector-Regular.woff
└── jax
    ├── output
    │   └── CommonHTML
    │       ├── jax.js
    │       ├── autoload
    │       │   └── mtable.js
    │       └── fonts
    │           └── TeX
    │               ├── fontdata.js
    │               └── AMS-Regular.js
    └── element
        └── mml
            └── optable
                ├── Arrows.js
                └── MathOperators.js
```


