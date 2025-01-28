---
title: "RestController"
sequence: "101"
---

The `@RestController` is a shorthand to include both the `@ResponseBody` and the `@Controller` annotations in our class.

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)

@Controller
@ResponseBody
public @interface RestController {

	/**
	 * The value may indicate a suggestion for a logical component name,
	 * to be turned into a Spring bean in case of an autodetected component.
	 * @return the suggested component name, if any (or empty String otherwise)
	 * @since 4.0.1
	 */
	@AliasFor(annotation = Controller.class)
	String value() default "";

}
```
