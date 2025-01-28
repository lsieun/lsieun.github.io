---
title: "Issues With the Existing Date/Time APIs"
sequence: "103"
---

[UP](/java-time.html)


## Thread safety

The Date and Calendar classes are not thread safe,
leaving developers to deal with the headache of hard-to-debug concurrency issues and
to write additional code to handle thread safety.
On the contrary, the new Date and Time APIs introduced in Java 8 are immutable and thread safe,
thus taking that concurrency headache away from developers.


## API design and ease of understanding

The Date and Calendar APIs are poorly designed with inadequate methods to perform day-to-day operations.
The new Date/Time API is ISO-centric and follows consistent domain models for date, time, duration and periods.
There are a wide variety of utility methods that support the most common operations.

## ZonedDate and Time

Developers had to write additional logic to handle time-zone logic with the old APIs,
whereas with the new APIs, handling of time zone can be done with Local and ZonedDate/Time APIs.
