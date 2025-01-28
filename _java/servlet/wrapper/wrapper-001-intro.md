---
title: "The Decorator Pattern"
sequence: "101"
---

The Servlet API comes with four wrapper classes
that you can use to change the behavior of servlet requests and servlet responses.

The wrappers allow you to “wrap” any method in the `ServletRequest` and `ServletResponse`
or their HTTP equivalents (`HttpServletRequest` and `HttpServletReponse`, respectively).

These wrappers follow the Decorator or Wrapper pattern,
and to utilize these wrappers you need to understand what the pattern is.

## The Decorator Pattern

The Decorator or Wrapper pattern allows you to decorate or wrap
(in plain language, modify the behavior of) an object
even if you don't have the source code for the object's class or even if the class is declared final.

The Decorator pattern is suitable for situations
where inheritance will not work (for example, if the class of the object in question is final) or
you do not create the object yourself but rather get it from another subsystem.
For example, the servlet container creates a `ServletRequest` and a `ServletResponse` and
pass them to the servlet's `service` method.
The only way to change the behavior of the `ServletRequest` and `ServletResponse` is
by wrapping them in other objects.
The only condition that must be met is
that the class of a decorated object implements an interface and
the methods that will be wrapped are inherited from that interface.



