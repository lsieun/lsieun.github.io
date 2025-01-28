---
title: "Spring Boot: @Validated and @Valid"
sequence: "102"
---

In many cases, however, Spring does the validation for us.
We don't even need to create a validator object ourselves.
Instead, we can let Spring know that we want to have a certain object validated.
This works by using the `@Validated` and `@Valid` annotations.

## @Validated

The `@Validated` annotation is a **class-level annotation**
that we can use to tell Spring to validate parameters
that are passed into a method of the annotated class.

## @Valid

We can put the `@Valid` annotation on **method parameters** and **fields**
to tell Spring that we want a method parameter or field to be validated.

## Use `@Valid` on Complex Types

If the `Input` class contains a field with another complex type
that should be validated, this field, too, needs to be annotated with `@Valid`.

