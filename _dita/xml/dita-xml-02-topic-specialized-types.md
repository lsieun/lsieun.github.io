---
title: "Specialized topic types"
sequence: "102"
---

The `<topic>` element is the most generic topic type.
There are four more specialized topic types: `<concept>`, `<task>`, `<reference>`, `<glossentry>`.

When appropriate, use a specialized topic type rather than a plain `<topic>`.

## The `<concept>` element

Create a `<concept>` element when you need to provide your reader with background information
which must be absorbed in order to understand the rest of the document.

Example:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE concept PUBLIC "-//OASIS//DTD DITA Concept//EN" "concept.dtd">
<concept id="what_is_a_cache">
    <title>What is a cache?</title>
    <shortdesc>
        Everything you'll ever need to know about
        <term>cache</term>s.
    </shortdesc>
    <conbody>
        <p>
            In computer science, a cache is a temporary storage area where
            frequently accessed data can be stored for rapid access.
        </p>
    </conbody>
    
    <related-links>
        <link format="html" href="http://en.wikipedia.org/wiki/Cache" scope="external">
            <linktext>Wikipedia definition of a cache</linktext>
        </link>
    </related-links>
</concept>
```

Notice how the structure of a `<concept>` element is similar to the structure of a `<topic>` element.
Moreover, a `<conbody>` element has almost the same content model as a `<body>` element.

## The `<task>` element

Create a `<task>` element when you need to explain step by step
which procedure is to be followed in order to accomplish a given task.

Example:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE task PUBLIC "-//OASIS//DTD DITA Task//EN" "task.dtd">
<task id="installing_gnu_emacs">
    <title>Installing GNU Emacs</title>
    <shortdesc/>
    <taskbody>
        <prereq> Windows NT 4.0 or any subsequent version of Windows. 5Mb of free disk space. </prereq>

        <steps>
            <step>
                <cmd>Unzip the distribution anywhere.</cmd>
                
                <info> We recommend to use the free, open source, <xref format="html"
                        href="http://www.info-zip.org/" scope="external">Info-ZIP</xref> utility to
                    do so. 
                </info>
                
                <stepxmp><screen>C:\&gt; unzip emacs-21.3-bin-i386.zip</screen></stepxmp>
                
                <stepresult>
                    <p>
                        Doing this will create an <filepath>emacs-21.3</filepath> directory.
                    </p>
                </stepresult>
            </step>
            
            <step>
                <cmd>Go to the bin subdirectory.</cmd>
                
                <stepxmp><screen>C:\&gt; cd emacs-21.3\bin</screen></stepxmp>
            </step>
            
            <step>
                <cmd>Run <cmdname>addpm</cmdname>.</cmd>
                
                <stepxmp><screen>C:\emacs-21.3\bin&gt; addpm</screen></stepxmp>
                
                <stepresult>A confirmation dialog box is displayed.<fig>
                    <image href="abc.jpg"/>
                </fig></stepresult>
            </step>
            
            <step>
                <cmd>Click <uicontrol>OK</uicontrol> to confirm.</cmd>
            </step>
        </steps>
    </taskbody>
</task>
```

Albeit being the most complex specialized topic type,
the `<task>` element is also the most useful one.
Its `<taskbody>` is mainly organized around the `<steps>` element.
Other useful elements are `<prereq>` (pre-requisite section of a task),
`<context>` (background information for the task), `<result>` (expected outcome of a task).

The `<step>` element has several useful child elements other than the required `<cmd>` element:
`<info>` (additional information about the step),
`<stepxmp>` (example that illustrates a step),
`<substeps>`, `<choices>` (the user needs to choose one of several actions),
`<stepresult>` (expected outcome of a step).

## The `<reference>` element

Create a `<reference>` element when you need to add an entry to a reference manual.
The `<reference>` element is typically used to document a command or a function.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE reference PUBLIC "-//OASIS//DTD DITA Reference//EN" "reference.dtd">
<reference id="pwd_command">
    <title>The <cmdname>pwd</cmdname> command</title>
    <shortdesc></shortdesc>
    <refbody>
        <refsyn><cmdname>pwd</cmdname></refsyn>
        
        <section>
            <title>DESCRIPTION</title>
            <p>
                Print the full filename of the current working directory.
            </p>
            <note>
                Your shell may have its own version of <cmdname>pwd</cmdname>, which usually supersedes the version described here.
            </note>
        </section>
        
        <section>
            <title>AUTHOR</title>
            <p>Written by John Doe. </p>
        </section>
    </refbody>
    
    <related-links>
        <link format="html" href="http://www.manpagez.com/man/3/getcwd/" scope="external">
            <linktext><cmdname>getcwd</cmdname>(3)</linktext>
        </link>
    </related-links>
</reference>
```

The `<refbody>` child element of a `<reference>` can contain the following **generic elements**:
`<section>`s, `<example>`s, `<simpletable>`s and `<table>`s,
but also more **specific elements**:
`<refsyn>` (contains the syntax of a command-line utility or the prototype of a function) and
`<properties>` (a special kind of table having 3 columns: `type`, `value` and `description`).

## The `<glossentry>` element

Create a `<glossentry>` element when you need to add entry to a glossary.

The following example shows three glossary entries having the following IDs: `ajax`, `dhtml`, `javascript`.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE glossgroup PUBLIC "-//OASIS//DTD DITA Glossary Group//EN" "glossgroup.dtd">
<glossgroup id="sample_glossary">
    <title>Sample glossary</title>

    <glossentry id="ajax">
        <glossterm>AJAX</glossterm>
        
        <glossdef>
            <b>A</b>synchronous <b>Ja</b>vaScript and <b>X</b>ML.
            Web development techniques used on the client-side to create interactive web applications.
        </glossdef>
    </glossentry>
    
    <glossentry id="dhtml">
        <glossterm>DHTML</glossterm>
        
        <glossdef>
            <b>D</b>ynamic <b>HTML</b>. Web development techniques used on
            the client-side to create interactive web sites.
        </glossdef>
    </glossentry>
    
    <glossentry id="javascript">
        <glossterm>JavaScript</glossterm>
        
        <glossdef>
            JavaScript is an object-oriented scripting language supported by all major web browsers.
            It allows the development of interactive web sites and web applications.
        </glossdef>
        
        <related-links>
            <link format="html" href="https://developer.mozilla.org/en/JavaScript" scope="external">
                <linktext>Mozilla's Official Documentation on JavaScript</linktext>
            </link>
        </related-links>
    </glossentry>
</glossgroup>
```

The `<glossentry>` element is the simplest specialized topic type.
It contains a `<glossterm>` child element (the term being defined) followed by
a `<glossdef>` (the definition of the term) child element,
optionally followed by the `<related-links>` element common to all topic types.

In the above example, the `<glossgroup>` element is used as a container for the three `<glossentry>` elements.

**Remember**

- It is not recommended to create XML files containing several topics because if you do so,
  first this makes it harder reusing your topics in different documents and second,
  this makes the topic map slightly harder to specify.
  However, if you need to create multi-topic files,
  you'll have to use the `<dita>` element as a wrapper for your topics.
- A topic may contain other topics.
  The DITA grammar allows to add a topic child element after the `<body>` or `<related-links>` element
  (whichever is the last child) of the parent topic.
  It is not recommended to use this nested topics facility which, in our opinion, is almost never useful.
  The hierarchy of topics (that is, chapters containing sections containing subsections, etc.)
  is better expressed in a map using a hierarchy of `<topicref>`s.



