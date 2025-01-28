---
title: "SPI Samples in the Java Ecosystem"
sequence: "104"
---

[UP]({% link _java-theme/java-spi-index.md %})

Java provides many SPIs. Here are some samples of the service provider interface and the service that it provides:

- `CurrencyNameProvider`: provides localized currency symbols for the Currency class.
- `LocaleNameProvider`: provides localized names for the Locale class.
- `TimeZoneNameProvider`: provides localized time zone names for the TimeZone class.
- `DateFormatProvider`: provides date and time formats for a specified locale.
- `NumberFormatProvider`: provides monetary, integer and percentage values for the NumberFormat class.
- `Driver`: as of version 4.0, the JDBC API supports the SPI pattern. Older versions uses the `Class.forName()` method to load drivers.
- `PersistenceProvider`: provides the implementation of the JPA API.
- `JsonProvider`: provides JSON processing objects.
- `JsonbProvider`: provides JSON binding objects.
- `Extension`: provides extensions for the CDI container.
- `ConfigSourceProvider`: provides a source for retrieving configuration properties.
