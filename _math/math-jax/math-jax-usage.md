---
title: "MathJax Usage"
sequence: "102"
---

<p class="indented">
    By default, the <code>tex2jax</code> preprocessor defines the LaTeX math delimiters.
</p>

<ul>
    <li><code>\(...\)</code> for in-line math</li>
    <li><code>\[...\]</code> for displayed equations</li>
</ul>

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

<p>
    It also defines the TeX delimiters <code>$$...$$</code> for displayed equations,
    but it does not define <code>$...$</code> as in-line math delimiters.
    That is because dollar signs appear too often in non-mathematical settings, which could cause some text to be treated as mathematics unexpectedly.
</p>

```text
<div>
$$ \begin{align}
Area &= \pi r^{2}\\
     &= \pi \times r \times r
\end{align} $$
</div>
```

<fieldset>
    <legend>显示效果</legend>
    <div>
    $$ \begin{align}
    Area &= \pi r^{2}\\
         &= \pi \times r \times r
    \end{align} $$
    </div>
</fieldset>

## Syntax

### Operation symbols

<table style="width: 500px; color:black">
    <caption>Operation symbols</caption>
    <tr>
        <th>LaTex</th>
        <th>See</th>
    </tr>
    <tr class="w3-hover-blue">
        <td>+</td>
        <td>\(+\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td>-</td>
        <td>\(-\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td>
            <code>*</code><br/>
            <code>\ast</code>
        </td>
        <td>\(\ast\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>/</code></td>
        <td>\(/\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\%</code></td>
        <td>\(\%\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\cdot</code></td>
        <td>\(\cdot\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\star</code></td>
        <td>\(\star\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td>
            <code>\backslash</code><br/>
            <code>\setminus</code>
        </td>
        <td>\(\setminus\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\times</code></td>
        <td>\(\times\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\div</code></td>
        <td>\(\div\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\ltimes</code></td>
        <td>\(\ltimes\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\rtimes</code></td>
        <td>\(\rtimes\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\bowtie</code></td>
        <td>\(\bowtie\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\circ</code></td>
        <td>\(\circ\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\oplus</code></td>
        <td>\(\oplus\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\otimes</code></td>
        <td>\(\otimes\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\odot</code></td>
        <td>\(\odot\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\sum</code></td>
        <td>\(\sum\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\prod</code></td>
        <td>\(\prod\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\wedge</code></td>
        <td>\(\wedge\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\bigwedge</code></td>
        <td>\(\bigwedge\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\vee</code></td>
        <td>\(\vee\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\bigvee</code></td>
        <td>\(\bigvee\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\cap</code></td>
        <td>\(\cap\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\bigcap</code></td>
        <td>\(\bigcap\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\cup</code></td>
        <td>\(\cup\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\bigcup</code></td>
        <td>\(\bigcup\)</td>
    </tr>
</table>

### Miscellaneous Symbols

<table style="width: 500px; color:black">
    <caption>Miscellaneous Symbols</caption>
    <tr>
        <th>LaTex</th>
        <th>See</th>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\frac{2}{3}</code></td>
        <td>\(\frac{2}{3}\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>{a \over b}</code></td>
        <td>\( {a \over b}\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>2^3</code></td>
        <td>\(2^3\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\sqrt {x}</code></td>
        <td>\(\sqrt {x}\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\sqrt[n]{x}</code></td>
        <td>\(\sqrt[n]{x}\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\int</code></td>
        <td>\(\int\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\oint</code></td>
        <td>\(\oint\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\partial</code></td>
        <td>\(\partial\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\nabla</code></td>
        <td>\(\nabla\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\pm</code></td>
        <td>\(\pm\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\emptyset</code></td>
        <td>\(\emptyset\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\infty</code></td>
        <td>\(\infty\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\aleph</code></td>
        <td>\(\aleph\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\therefore</code></td>
        <td>\(\therefore\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\because</code></td>
        <td>\(\because\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>|\ldots|</code></td>
        <td>\(|\ldots|\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>|\cdots|</code></td>
        <td>\(|\cdots|\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\vdots</code></td>
        <td>\(\vdots\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\ddots</code></td>
        <td>\(\ddots\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>|\quad|</code></td>
        <td>\(|\quad|\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\angle</code></td>
        <td>\(\angle\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\frown</code></td>
        <td>\(\frown\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\triangle</code></td>
        <td>\(\triangle\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\diamond</code></td>
        <td>\(\diamond\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\square</code></td>
        <td>\(\square\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\lfloor</code></td>
        <td>\(\lfloor\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\rfloor</code></td>
        <td>\(\rfloor\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\lceil</code></td>
        <td>\(\lceil\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\rceil</code></td>
        <td>\(\rceil\)</td>
    </tr>
</table>

### Relation symbols

<table style="width: 500px; color:black">
    <caption>Relation symbols</caption>
    <tr>
        <th>LaTex</th>
        <th>See</th>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>=</code></td>
        <td>\(=\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\ne</code></td>
        <td>\(\ne\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\lt</code></td>
        <td>\(\lt\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\gt</code></td>
        <td>\(\gt\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\le</code></td>
        <td>\(\le\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\ge</code></td>
        <td>\(\ge\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\prec</code></td>
        <td>\(\prec\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\preceq</code></td>
        <td>\(\preceq\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\succ</code></td>
        <td>\(\succ\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\succeq</code></td>
        <td>\(\succeq\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\in</code></td>
        <td>\(\in\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\notin</code></td>
        <td>\(\notin\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\subset</code></td>
        <td>\(\subset\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\supset</code></td>
        <td>\(\supset\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\subseteq</code></td>
        <td>\(\subseteq\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\supseteq</code></td>
        <td>\(\supseteq\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\equiv</code></td>
        <td>\(\equiv\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\cong</code></td>
        <td>\(\cong\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\approx</code></td>
        <td>\(\approx\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\propto</code></td>
        <td>\(\propto\)</td>
    </tr>
</table>

### Logical symbols

<table style="width: 500px; color:black">
    <caption>Logical symbols</caption>
    <tr>
        <th>LaTex</th>
        <th>See</th>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>and</code></td>
        <td>\(and\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>or</code></td>
        <td>\(or\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\neg</code></td>
        <td>\(\neg\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\implies</code></td>
        <td>\(\implies\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>if</code></td>
        <td>\(if\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\iff</code></td>
        <td>\(\iff\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\forall</code></td>
        <td>\(\forall\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\exists</code></td>
        <td>\(\exists\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\bot</code></td>
        <td>\(\bot\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\top</code></td>
        <td>\(\top\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\vdash</code></td>
        <td>\(\vdash\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\models</code></td>
        <td>\(\models\)</td>
    </tr>
</table>

### Grouping brackets

<table style="width: 500px; color:black">
    <caption>Grouping symbols</caption>
    <tr>
        <th>LaTex</th>
        <th>See</th>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>(</code></td>
        <td>\((\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>)</code></td>
        <td>\()\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>[</code></td>
        <td>\([\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>]</code></td>
        <td>\(]\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\{</code></td>
        <td>\(\{\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\}</code></td>
        <td>\(\}\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\langle</code></td>
        <td>\(\langle\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\rangle</code></td>
        <td>\(\rangle\)</td>
    </tr>
</table>

### Arrows

<table style="width: 500px; color:black">
    <caption>Arrows symbols</caption>
    <tr>
        <th>LaTex</th>
        <th>See</th>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\uparrow</code></td>
        <td>\(\uparrow\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\downarrow</code></td>
        <td>\(\downarrow\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\rightarrow</code></td>
        <td>\(\rightarrow\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\leftarrow</code></td>
        <td>\(\leftarrow\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\to</code></td>
        <td>\(\to\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\rightarrowtail</code></td>
        <td>\(\rightarrowtail\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\twoheadleftarrow</code></td>
        <td>\(\twoheadleftarrow\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\twoheadrightarrow</code></td>
        <td>\(\twoheadrightarrow\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\mapsto</code></td>
        <td>\(\mapsto\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\leftrightarrow</code></td>
        <td>\(\leftrightarrow\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\rightarrow</code></td>
        <td>\(\rightarrow\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\leftarrow</code></td>
        <td>\(\leftarrow\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\leftrightarrow</code></td>
        <td>\(\leftrightarrow\)</td>
    </tr>
</table>

### Accents

<table style="width: 500px; color:black">
    <caption>Accents symbols</caption>
    <tr>
        <th>LaTex</th>
        <th>See</th>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\hat x</code></td>
        <td>\(\hat x\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td>
            <code>\bar x</code><br/>
            <code>\overline x</code>
        </td>
        <td>\(\overline x\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\underline x</code></td>
        <td>\(\underline x\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\vec x</code></td>
        <td>\(\vec x\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\overrightarrow {AB}</code></td>
        <td>\(\overrightarrow {AB}\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\overleftarrow {AB}</code></td>
        <td>\(\overleftarrow {AB}\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\dot x</code></td>
        <td>\(\dot x\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\ddot x</code></td>
        <td>\(\ddot x\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\overset{x}{=}</code></td>
        <td>\(\overset{x}{=}\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\underset{x}{=}</code></td>
        <td>\(\underset{x}{=}\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\underbrace{1+2}</code></td>
        <td>\(\underbrace{1+2}\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\overbrace{1+2}</code></td>
        <td>\(\overbrace{1+2}\)</td>
    </tr>
</table>

### Greek Letters

<table style="width: 500px; color:black">
    <caption>Greek Letters</caption>
    <tr>
        <th>LaTex</th>
        <th>See</th>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\alpha</code></td>
        <td>\(\alpha\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\beta</code></td>
        <td>\(\beta\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\gamma</code></td>
        <td>\(\gamma\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\Gamma</code></td>
        <td>\(\Gamma\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\delta</code></td>
        <td>\(\delta\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\Delta</code></td>
        <td>\(\Delta\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\epsilon</code></td>
        <td>\(\epsilon\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\varepsilon</code></td>
        <td>\(\varepsilon\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\zeta</code></td>
        <td>\(\zeta\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\eta</code></td>
        <td>\(\eta\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\theta</code></td>
        <td>\(\theta\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\Theta</code></td>
        <td>\(\Theta\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\vartheta</code></td>
        <td>\(\vartheta\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\iota</code></td>
        <td>\(\iota\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\kappa</code></td>
        <td>\(\kappa\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\lambda</code></td>
        <td>\(\lambda\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\Lambda</code></td>
        <td>\(\Lambda\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\mu</code></td>
        <td>\(\mu\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\nu</code></td>
        <td>\(\nu\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\xi</code></td>
        <td>\(\xi\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\Xi</code></td>
        <td>\(\Xi\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\pi</code></td>
        <td>\(\pi\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\Pi</code></td>
        <td>\(\Pi\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\rho</code></td>
        <td>\(\rho\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\sigma</code></td>
        <td>\(\sigma\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\Sigma</code></td>
        <td>\(\Sigma\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\tau</code></td>
        <td>\(\tau\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\upsilon</code></td>
        <td>\(\upsilon\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\phi</code></td>
        <td>\(\phi\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\Phi</code></td>
        <td>\(\Phi\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\varphi</code></td>
        <td>\(\varphi\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\chi</code></td>
        <td>\(\chi\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\psi</code></td>
        <td>\(\psi\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\Psi</code></td>
        <td>\(\Psi\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\omega</code></td>
        <td>\(\omega\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\Omega</code></td>
        <td>\(\Omega\)</td>
    </tr>
</table>

### Space

<table style="width: 500px; color:black">
    <caption>Space</caption>
    <tr>
        <th>LaTex</th>
        <th>See</th>
        <th>Memo</th>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>a\qquad b</code></td>
        <td>\(a\qquad b\)</td>
        <td>两个quad空格</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>a\quad b</code></td>
        <td>\(a\quad b\)</td>
        <td>一个quad空格</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>a\  b</code></td>
        <td>\(a\  b\)</td>
        <td>大空格，表示间距1/3m宽度</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>a\; b</code></td>
        <td>\(a\; b\)</td>
        <td>中等空格，表示间距2/7m宽度。</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>a\, b</code></td>
        <td>\(a\, b\)</td>
        <td>小空格，表示间距1/6m宽度</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>ab</code></td>
        <td>\(ab\)</td>
        <td>没有空格</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>a\!b</code></td>
        <td>\(a\!b\)</td>
        <td>紧缩，表示缩进1/6m宽度</td>
    </tr>
</table>

## Standard Functions

`sin`, `cos`, `tan`, `sec`, `csc`, `cot`, `arcsin`, `arccos`, `arctan`, `sinh`, `cosh`, `tanh`,
`sech`, `csch`, `coth`, `exp`, `log`, `ln`, `det`, `dim`, `mod`, `gcd`, `lcm`, `lub`, `glb`, `min`, `max`, `f`, `g`.

## Align

```text
$$\begin{align} B'&=-\nabla \times E,\\E'&=\nabla \times B - 4\pi j,\end{align} $$
```

<div>
    $$\begin{align} B'&=-\nabla \times E,\\E'&=\nabla \times B - 4\pi j,\end{align} $$
</div>

```text
$$ \begin{align}
Area &= \pi r^{2}\\
     &= \pi \times r \times r
\end{align} $$
```

<div>
$$ \begin{align}
Area &= \pi r^{2}\\
     &= \pi \times r \times r
\end{align} $$
</div>

## Matrix

### 矩阵表示

可以用 `$$\begin{matrix}…\end{matrix}$$` 来表示矩阵。将矩阵元素放在 `\begin{matrix}` 和 `\end{matrix}` 之间即可。
用 `\\` 来分割行，用 `&` 来分割同一行的矩阵元素。如：

```text
$$
\begin{matrix}
	1 & x & x^2 \\
	1 & y & y^2 \\
	1 & z & z^2 \\
\end{matrix}
$$
```

<p>
$$
\begin{matrix}
	1 & x & x^2 \\
	1 & y & y^2 \\
	1 & z & z^2 \\
\end{matrix}
$$
</p>

MathJax 会自动调整行列的尺寸。

### 矩阵两端的括号

给矩阵两端加上括号，可以用`\left…\right` 或者

把 `{matrix}` 替换为 `{pmatrix}`， 变成

<p>
$$
\begin{pmatrix}
	1 & 2 \\
	3 & 4
\end{pmatrix}
$$
</p>

替换为 `{bmatrix}`，变成

<p>
$$
\begin{bmatrix}
	1 & 2 \\
	3 & 4
\end{bmatrix}
$$
</p>

替换为 `{Bmatrix}`，变成

<p>
$$
\begin{Bmatrix}
	1 & 2 \\
	3 & 4
\end{Bmatrix}
$$
</p>

替换为 `{vmatrix}`，变成

<p>
$$
\begin{vmatrix}
	1 & 2 \\
	3 & 4
\end{vmatrix}
$$
</p>

替换为 `{Vmatrix}`，变成

<p>
$$
\begin{Vmatrix}
	1 & 2 \\
	3 & 4
\end{Vmatrix}
$$
</p>

### 在中间省略一些项

可以用 `\cdots`、`\ddots`、`vdots`来在中间省略一些项。

比如：

<p>
$$
\begin {pmatrix}
     1 & a_1 & a_1^2 & \cdots & a_1^n \\
     1 & a_2 & a_2^2 & \cdots & a_2^n \\
     \vdots  & \vdots& \vdots & \ddots & \vdots \\
     1 & a_m & a_m^2 & \cdots & a_m^n    
\end {pmatrix} 
$$
</p>

### 增广矩阵 augmented matrix

对于增广矩阵，要用到 `{array}` 语句。如：


`{cc|c}` 的作用是，在第二列和第三列之间画一条垂直线，`c` 表示列中心对齐。

<p>
$$
\left [
    \begin {array} {cc|c}
      1&2&3\\
      4&5&6
    \end {array}
\right ] 
$$
</p>

### 在行内画小矩阵

如果只是需要在行内画个小矩阵，可以用 `\bigl(\begin{smallmatrix} ... \end{smallmatrix}\bigr)`来画。


如 `\(\bigl( \begin{smallmatrix} a & b \\ c & d \end{smallmatrix} \bigr)\)`

<p>
可以画出 \(\bigl( \begin{smallmatrix} a & b \\ c & d \end{smallmatrix} \bigr)\)
</p>


## Calculus

### Integral Calculus

### Differential Calculus

<table style="width: 500px; color:black">
    <caption>Miscellaneous Symbols</caption>
    <tr>
        <th>LaTex</th>
        <th>See</th>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\prod</code></td>
        <td>\(\prod\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\int</code></td>
        <td>\(\int\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\bigcup</code></td>
        <td>\(\bigcup\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\bigcap</code></td>
        <td>\(\bigcap\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\iint</code></td>
        <td>\(\iint\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\iiint</code></td>
        <td>\(\iiint\)</td>
    </tr>
    <tr class="w3-hover-blue">
        <td><code>\idotsint</code></td>
        <td>\(\idotsint\)</td>
    </tr>
</table>

<p>
$$
\int_{a}^{b}
$$
</p>

### Displaystyle and Textstyle

Many things like fractions, sums, limits, and integrals display differently
when written inline versus in a displayed formula.
You can switch styles back and forth with `\displaystyle` and `\textstyle` in order to achieve the desired appearance.

```text
$$\sum_{n=1}^\infty \frac{1}{n^2} \to
      \textstyle \sum_{n=1}^\infty \frac{1}{n^2} \to
      \displaystyle \sum_{n=1}^\infty \frac{1}{n^2}$$
```

<p>
$$\sum_{n=1}^\infty \frac{1}{n^2} \to
      \textstyle \sum_{n=1}^\infty \frac{1}{n^2} \to
      \displaystyle \sum_{n=1}^\infty \frac{1}{n^2}$$
</p>

```text
Compare \(\displaystyle \lim_{t \to 0} \int_t^1 f(t)\, dt\)
versus \(\lim_{t \to 0} \int_t^1 f(t)\, dt\).
```

<p>
Compare \(\displaystyle \lim_{t \to 0} \int_t^1 f(t)\, dt\)
versus \(\lim_{t \to 0} \int_t^1 f(t)\, dt\).
</p>

## Reference

- [MathJax basic tutorial and quick reference](https://math.meta.stackexchange.com/questions/5020/mathjax-basic-tutorial-and-quick-reference)

