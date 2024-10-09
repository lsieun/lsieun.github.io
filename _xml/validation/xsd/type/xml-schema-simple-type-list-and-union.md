---
title: "Union and List"
sequence: "121"
---

## Union types

### Defining union types

Union types allow a value to conform to any one of several different simple types.

```xml
<xsd:simpleType name="sizeType">
    <xsd:union>
        <xsd:simpleType>
            <xsd:restriction base="xsd:integer">
                <xsd:minInclusive value="2"/>
                <xsd:maxInclusive value="18"/>
            </xsd:restriction>
        </xsd:simpleType>
        <xsd:simpleType>
            <xsd:restriction base="xsd:token">
                <xsd:enumeration value="small"/>
                <xsd:enumeration value="medium"/>
                <xsd:enumeration value="large"/>
            </xsd:restriction>
        </xsd:simpleType>
    </xsd:union>
</xsd:simpleType>
```

The simple types that compose a union type are known as its **member types**.
Member types must always be simple types;
there is no such thing as a union of complex types.
There must be at least one member type,
and there is no limit for how many member types may be specified.

### Restricting union types

Of all the facets, only three may be applied to union types: `pattern`, `enumeration`, and `assertion`.
These restrictions are considered to be in addition to the restrictions of the individual member types.

```xml
<xsd:simpleType name="smallSizeType">
    <xsd:restriction base="sizeType">
        <xsd:enumeration value="2"/>
        <xsd:enumeration value="4"/>
        <xsd:enumeration value="6"/>
        <xsd:enumeration value="small"/>
    </xsd:restriction>
</xsd:simpleType>
```

### Unions of unions

### Specifying the member type in the instance

An **instance element** can optionally use the `xsi:type` attribute to specify its type.
In the case of union types, you can use `xsi:type` to specify which of the **member types** the element conforms to.
This allows more targeted validation and provides a clue to the application
that processes the instance about what type of value to expect.

## List types

### Defining list types

List types are whitespace-separated lists of atomic values.
A list type is defined by designating another simple type (an atomic or union type) as its item type.

```text
<xsd:simpleType name="numSizeType">
    <xsd:restriction base="xsd:integer">
        <xsd:minInclusive value="2"/>
        <xsd:maxInclusive value="18"/>
    </xsd:restriction>
</xsd:simpleType>

<xsd:simpleType name="availableSizeType">
    <xsd:list itemType="numSizeType"/>
</xsd:simpleType>
```

Alternatively, the item type can be specified anonymously in a `simpleType` child within the list type definition.

```text
<xsd:simpleType name="availableSizeType">
    <xsd:list>
        <xsd:simpleType>
            <xsd:restriction base="xsd:integer">
                <xsd:minInclusive value="2"/>
                <xsd:maxInclusive value="18"/>
            </xsd:restriction>
        </xsd:simpleType>
    </xsd:list>
</xsd:simpleType>
```

There is no way to represent an absent or nil item in a list.
The `whiteSpace` facet for all list types is fixed at `collapse`,
which means that if multiple whitespace characters appear consecutively, they are collapsed into one space.

### Restricting list types

A limited number of facets may be applied to list types.
These facets have a slightly different behavior when applied to a list type,
because they apply to the list as a whole, not to the individual items in the list.
To restrict the values of each item in the list, you should restrict the item type, not the list type itself.

When applying facets to a list type, you do not specify the facets directly in the list type definition.
Instead, you **define the list type**, then **define a restriction of that list type**.
This can be done with two separate named simple types, or it can be accomplished all in one definition.

```text
<xsd:simpleType name="availableSizeType">
    <xsd:restriction>
        <xsd:simpleType>
            <xsd:list itemType="numSizeType"/>
        </xsd:simpleType>
        <xsd:maxLength value="3"/>
    </xsd:restriction>
</xsd:simpleType>
```

#### Length facets

Length facets `length`, `minLength`, and `maxLength` may be used to restrict list types.
The length is measured as number of items in the list, not the length of each item.

When you define a list type, there are no automatic restrictions on the length of the list.
Therefore, a list with zero items (i.e., empty elements or just whitespace) is considered valid.
If you do not want a list to be valid if it is empty, restrict the list type by setting its `minLength` to `1`.

#### Enumeration facet

The `enumeration` facet may also be used to restrict list types.
However, the enumeration specified applies to the whole list, not to each item in the list.












