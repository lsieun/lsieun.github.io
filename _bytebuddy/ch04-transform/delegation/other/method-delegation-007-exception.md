---
title: "Exception"
sequence: "107"
---

Furthermore, you might already have noticed that the above `LoggerInterceptor` declares a checked `Exception`.
On the other side, the instrumented source method which invokes this method does not declare any checked exception.

Usually, the Java compiler would refuse to compile such an invocation.
However, in contrast to the compiler the Java runtime does not treat checked exceptions differently
than their unchecked counterparts and permits this invocation.

For this reason, we decided to ignore checked exceptions and grant full flexibility in their use.
However, be careful when throwing undeclared checked exceptions from dynamically created methods
since the encounter of such an exception might confuse the users of your application.
