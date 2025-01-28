---
title: "Epoch"
sequence: "102"
---

[UP](/java-time.html)


## Epoch vs. LocalDate

To do the conversion, it is important to understand the concept behind `Epoch` and `LocalDate`.
The ‘ Epoch ‘ in Java refers to the time instant of 1970-01-01T00:00:00Z.
Time instants after the Epoch will have positive values.
Similarly, any time instants before the Epoch will have negative values.

**All instances of `Epoch`, `LocalDate`, and `LocalDateTime` are timezone-dependent**,
hence, when converting from one to another, we have to know the timezone.
In Java, a timezone can be represented through the `ZoneId` class.
