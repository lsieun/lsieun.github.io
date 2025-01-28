---
title: "Quick Start"
sequence: "101"
---

- [company.xsd](/assets/xml/xsd/company.xsd)
- [company-instance-xsd.xml](/assets/xml/instance/company-instance-xsd.xml)

File: `company.xsd`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xsd:schema xmlns="https://lsieun.github.io/assets/xml/company"
            xmlns:xsd="http://www.w3.org/2001/XMLSchema"
            targetNamespace="https://lsieun.github.io/assets/xml/company"
            elementFormDefault="qualified">

    <xsd:element name="company" type="companyType"/>
    <xsd:complexType name="companyType">
        <xsd:sequence>
            <xsd:element name="website" type="xsd:string" minOccurs="1"/>
            <xsd:element ref="department" minOccurs="1"/>
        </xsd:sequence>
        <xsd:attribute name="since" type="xsd:date"/>
    </xsd:complexType>

    <xsd:element name="department" type="departmentType"/>
    <xsd:complexType name="departmentType">
        <xsd:sequence>
            <xsd:element ref="employee" minOccurs="0" maxOccurs="unbounded"/>
        </xsd:sequence>
    </xsd:complexType>

    <xsd:element name="employee" type="employeeType"/>
    <xsd:complexType name="employeeType">
        <xsd:sequence>
            <xsd:element name="first-name" type="xsd:string"/>
            <xsd:element name="last-name" type="xsd:string"/>
            <xsd:element name="age" type="ageType"/>
        </xsd:sequence>
    </xsd:complexType>

    <xsd:simpleType name="ageType">
        <xsd:restriction base="xsd:integer">
            <xsd:minInclusive value="1"/>
            <xsd:maxInclusive value="100"/>
        </xsd:restriction>
    </xsd:simpleType>
</xsd:schema>
```

File: `company-instance-xsd.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<company xmlns="https://lsieun.github.io/assets/xml/company"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="https://lsieun.github.io/assets/xml/company ../xsd/company.xsd"
         since="2022-01-01">

    <website>https://lsieun.github.io</website>

    <department>
        <employee>
            <first-name>Tom</first-name>
            <last-name>Cat</last-name>
            <age>10</age>
        </employee>
    </department>
</company>
```
