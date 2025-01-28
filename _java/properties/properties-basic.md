---
title: "Properties Intro"
sequence: "101"
---

[UP]({% link _java/properties-index.md %})

The `java.util.Properties` class is a specialized hash table for strings.
`Properties` are generally used to hold textual configuration data.

More generally, you can use a `Properties` table to hold arbitrary configuration information for an application in an easily accessible format.
The neat thing about a `Properties` object is that it can load and store its information in a plain text
or XML text format using streams.

Any string values can be stored as `key/value` pairs in a `Properties` table.
However, the convention is to use a dot-separated naming hierarchy to group property names into logical structures.
(Unfortunately, this is just a convention, and you can't really work with groups of properties in a hierarchical way as this might imply.)
For example, you can create an empty `Properties` object and add String `key/value` pairs just as you could with a `Map`:

```text
Properties props = new Properties();
props.setProperty("myApp.xsize", "52");
props.setProperty("myApp.ysize", "79");
```

Thereafter, you can retrieve values with the `getProperty()` method:

```text
String xsize = props.getProperty("myApp.xsize");
```

If the named property doesn't exist, `getProperty()` returns `null`.

You can get an `Enumeration` of the property names with the `propertyNames()` method:

```text
for ( Enumeration e = props.propertyNames(); e.hasMoreElements(); ) {
    String name = e.nextElement();
    // ...
}
```


