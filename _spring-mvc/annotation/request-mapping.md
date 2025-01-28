---
title: "@RequestMapping"
sequence: "113"
---

Simply put, the `@RequestMapping` annotation is used to map web requests to Spring Controller methods.

## Basics

### by Path

```text
@RequestMapping(value = "/ex/foos", method = RequestMethod.GET)
@ResponseBody
public String getFoosBySimplePath() {
    return "Get some Foos";
}
```

```text
curl -i http://localhost:8080/spring-rest/ex/foos
```

### the HTTP Method

The HTTP method parameter has **no default**. So, if we don't specify a value, it's going to map to any HTTP request.

Here's a simple example, similar to the previous one, but this time mapped to an HTTP `POST` request:

```text
@RequestMapping(value = "/ex/foos", method = POST)
@ResponseBody
public String postFoos() {
    return "Post some Foos";
}
```

```text
curl -i -X POST http://localhost:8080/spring-rest/ex/foos
```

## HTTP Headers

### headers Attribute

The mapping can be narrowed even further by specifying a header for the request:

```text
@RequestMapping(value = "/ex/foos", headers = "key=val", method = GET)
@ResponseBody
public String getFoosWithHeader() {
    return "Get some Foos with Header";
}
```

To test the operation, we're going to use the curl header support:

```text
curl -i -H "key:val" http://localhost:8080/spring-rest/ex/foos
```

and even multiple headers via the `headers` attribute of `@RequestMapping`:

```text
@RequestMapping(
  value = "/ex/foos", 
  headers = { "key1=val1", "key2=val2" }, method = GET)
@ResponseBody
public String getFoosWithHeaders() {
    return "Get some Foos with Header";
}
```

We can test this with the command:

```text
curl -i -H "key1:val1" -H "key2:val2" http://localhost:8080/spring-rest/ex/foos
```

### Consumes and Produces

Mapping **media types produced by a controller** method is worth special attention.

We can map a request based on its `Accept` header via the `@RequestMapping` headers attribute introduced above:

```text
@RequestMapping(
  value = "/ex/foos", 
  method = GET, 
  headers = "Accept=application/json")
@ResponseBody
public String getFoosAsJsonFromBrowser() {
    return "Get some Foos with Header Old";
}
```

The matching for this way of defining the `Accept` header is flexible — it uses **contains** instead of **equals**,
so a request such as the following would still map correctly:

```text
curl -H "Accept:application/json,text/html" 
  http://localhost:8080/spring-rest/ex/foos
```

Starting with Spring 3.1, **the `@RequestMapping` annotation now has the `produces` and `consumes` attributes**,
specifically for this purpose:

```text
@RequestMapping(
  value = "/ex/foos", 
  method = RequestMethod.GET, 
  produces = "application/json"
)
@ResponseBody
public String getFoosAsJsonFromREST() {
    return "Get some Foos with Header New";
}
```

Also, the old type of mapping with the `headers` attribute will automatically
be converted to the new `produces` mechanism starting with Spring 3.1, so the results will be identical.

This is consumed via curl in the same way:

```text
curl -H "Accept:application/json" 
  http://localhost:8080/spring-rest/ex/foos
```

Additionally, `produces` supports multiple values as well:

```text
@RequestMapping(
  value = "/ex/foos", 
  method = GET,
  produces = { "application/json", "application/xml" }
)
```

Keep in mind that these — the old and new ways of specifying the `Accept` header — are basically the same mapping,
so Spring won't allow them together.

Having both these methods active would result in:

```text
Caused by: java.lang.IllegalStateException: Ambiguous mapping found. 
Cannot map 'fooController' bean method 
java.lang.String 
org.baeldung.spring.web.controller
  .FooController.getFoosAsJsonFromREST()
to 
{ [/ex/foos],
  methods=[GET],params=[],headers=[],
  consumes=[],produces=[application/json],custom=[]
}: 
There is already 'fooController' bean method
java.lang.String 
org.baeldung.spring.web.controller
  .FooController.getFoosAsJsonFromBrowser() 
mapped.
```

A final note on the new `produces` and `consumes` mechanisms,
which behave differently from most other annotations:
**When specified at the type level, the method-level annotations do not complement but override the type-level information**.

## Path Variables

Parts of the mapping URI can be bound to variables via the `@PathVariable` annotation.

### Single @PathVariable

A simple example with a single path variable:

```text
@RequestMapping(value = "/ex/foos/{id}", method = GET)
@ResponseBody
public String getFoosBySimplePathWithPathVariable(@PathVariable("id") long id) {
    return "Get a specific Foo with id=" + id;
}
```

This can be tested with curl:

```text
curl http://localhost:8080/spring-rest/ex/foos/1
```

If the name of the method parameter matches the name of the path variable exactly,
then this can be simplified by using `@PathVariable` with no value:

```text
@RequestMapping(value = "/ex/foos/{id}", method = GET)
@ResponseBody
public String getFoosBySimplePathWithPathVariable(@PathVariable String id) {
    return "Get a specific Foo with id=" + id;
}
```

Note that `@PathVariable` benefits from automatic type conversion, so we could have also declared the `id` as:

```text
@PathVariable long id
```

### Multiple @PathVariable

A more complex URI may need to map multiple parts of the URI to **multiple values**:

```text
@RequestMapping(value = "/ex/foos/{fooid}/bar/{barid}", method = GET)
@ResponseBody
public String getFoosBySimplePathWithPathVariables
  (@PathVariable long fooid, @PathVariable long barid) {
    return "Get a specific Bar with id=" + barid + 
      " from a Foo with id=" + fooid;
}
```

This is easily tested with a curl in the same way:

```text
curl http://localhost:8080/spring-rest/ex/foos/1/bar/2
```

### @PathVariable With Regex

Regular expressions can also be used when mapping the `@PathVariable`.

For example, we will restrict the mapping to only accept numerical values for the id:

```text
@RequestMapping(value = "/ex/bars/{numericId:[\\d]+}", method = GET)
@ResponseBody
public String getBarsBySimplePathWithPathVariable(
  @PathVariable long numericId) {
    return "Get a specific Bar with id=" + numericId;
}
```

This will mean that the following URIs will match:

```text
http://localhost:8080/spring-rest/ex/bars/1
```

But this will not:

```text
http://localhost:8080/spring-rest/ex/bars/abc
```

## Request Parameters

`@RequestMapping` allows easy mapping of URL parameters with the `@RequestParam` annotation.

We are now mapping a request to a URI:

```text
http://localhost:8080/spring-rest/ex/bars?id=100
```

```text
@RequestMapping(value = "/ex/bars", method = GET)
@ResponseBody
public String getBarBySimplePathWithRequestParam(
  @RequestParam("id") long id) {
    return "Get a specific Bar with id=" + id;
}
```

We are then extracting the value of the `id` parameter using the `@RequestParam("id")`
annotation in the controller method signature.

To send a request with the `id` parameter, we'll use the parameter support in `curl`:

```text
curl -i -d id=100 http://localhost:8080/spring-rest/ex/bars
```

In this example, the parameter was bound directly without having been declared first.

For more advanced scenarios, `@RequestMapping` can optionally define the parameters
as yet another way of narrowing the request mapping:

```text
@RequestMapping(value = "/ex/bars", params = "id", method = GET)
@ResponseBody
public String getBarBySimplePathWithExplicitRequestParam(
  @RequestParam("id") long id) {
    return "Get a specific Bar with id=" + id;
}
```

Even more flexible mappings are allowed.
Multiple params values can be set, and not all of them have to be used:

```text
@RequestMapping(
  value = "/ex/bars", 
  params = { "id", "second" }, 
  method = GET)
@ResponseBody
public String getBarBySimplePathWithExplicitRequestParams(
  @RequestParam("id") long id) {
    return "Narrow Get a specific Bar with id=" + id;
}
```

And of course, a request to a URI such as:

```text
http://localhost:8080/spring-rest/ex/bars?id=100&second=something
```

will always be mapped to the best match — which is the narrower match,
which defines both the `id` and the `second` parameter.

## Corner Cases

### Multiple Paths

Although a single `@RequestMapping` path value is usually used for a single controller method
(just good practice, not a hard and fast rule),
there are some cases where **mapping multiple requests to the same method** may be necessary.

In that case, **the value attribute of `@RequestMapping` does accept multiple mappings**, not just a single one:

```text
@RequestMapping(
  value = { "/ex/advanced/bars", "/ex/advanced/foos" }, 
  method = GET)
@ResponseBody
public String getFoosOrBarsByPath() {
    return "Advanced - Get some Foos or Bars";
}
```

Now both of these curl commands should hit the same method:

```text
curl -i http://localhost:8080/spring-rest/ex/advanced/foos
curl -i http://localhost:8080/spring-rest/ex/advanced/bars
```

### Multiple HTTP Request Methods

Multiple requests using different HTTP verbs can be mapped to the same controller method:

```text
@RequestMapping(
  value = "/ex/foos/multiple", 
  method = { RequestMethod.PUT, RequestMethod.POST }
)
@ResponseBody
public String putAndPostFoos() {
    return "Advanced - PUT and POST within single method";
}
```

With curl, both of these will now hit the same method:

```text
curl -i -X POST http://localhost:8080/spring-rest/ex/foos/multiple
curl -i -X PUT http://localhost:8080/spring-rest/ex/foos/multiple
```

### A Fallback for All Requests

To implement a simple fallback for all requests using a particular HTTP method, for example, for a GET:

```text
@RequestMapping(value = "*", method = RequestMethod.GET)
@ResponseBody
public String getFallback() {
    return "Fallback for GET Requests";
}
```

or even for all requests:

```text
@RequestMapping(
  value = "*", 
  method = { RequestMethod.GET, RequestMethod.POST ... })
@ResponseBody
public String allFallback() {
    return "Fallback for All Requests";
}
```

### Ambiguous Mapping Error

The ambiguous mapping error occurs
when Spring evaluates two or more request mappings to be the same for different controller methods.
A request mapping is the same when it has the same HTTP method, URL, parameters, headers, and media type.

For example, this is an ambiguous mapping:

```text
@GetMapping(value = "foos/duplicate" )
public String duplicate() {
    return "Duplicate";
}

@GetMapping(value = "foos/duplicate" )
public String duplicateEx() {
    return "Duplicate";
}
```

The exception thrown usually does have error messages along these lines:

```text
Caused by: java.lang.IllegalStateException: Ambiguous mapping.
  Cannot map 'fooMappingExamplesController' method 
  public java.lang.String org.baeldung.web.controller.FooMappingExamplesController.duplicateEx()
  to {[/ex/foos/duplicate],methods=[GET]}:
  There is already 'fooMappingExamplesController' bean method
  public java.lang.String org.baeldung.web.controller.FooMappingExamplesController.duplicate() mapped.
```

A careful reading of the error message points to the fact that Spring is
unable to map the method `org.baeldung.web.controller.FooMappingExamplesController.duplicateEx()`,
as it has a conflicting mapping with
an already mapped `org.baeldung.web.controller.FooMappingExamplesController.duplicate()`.

**The code snippet below will not result in ambiguous mapping error because both methods return different content types**:

```text
@GetMapping(value = "foos/duplicate", produces = MediaType.APPLICATION_XML_VALUE)
public String duplicateXml() {
    return "<message>Duplicate</message>";
}
    
@GetMapping(value = "foos/duplicate", produces = MediaType.APPLICATION_JSON_VALUE)
public String duplicateJson() {
    return "{\"message\":\"Duplicate\"}";
}
```

This differentiation allows our controller to return the correct data representation
based on the Accepts header supplied in the request.

Another way to resolve this is to update the URL assigned to either of the two methods involved.

## New Request Mapping Shortcuts

Spring Framework 4.3 introduced a few new HTTP mapping annotations, all based on @RequestMapping:

- `@GetMapping`
- `@PostMapping`
- `@PutMapping`
- `@DeleteMapping`
- `@PatchMapping`

These new annotations can improve the readability and reduce the verbosity of the code.

Let's look at these new annotations in action by creating a RESTful API that supports CRUD operations:

```text
@GetMapping("/{id}")
public ResponseEntity<?> getBazz(@PathVariable String id){
    return new ResponseEntity<>(new Bazz(id, "Bazz"+id), HttpStatus.OK);
}

@PostMapping
public ResponseEntity<?> newBazz(@RequestParam("name") String name){
    return new ResponseEntity<>(new Bazz("5", name), HttpStatus.OK);
}

@PutMapping("/{id}")
public ResponseEntity<?> updateBazz(
  @PathVariable String id,
  @RequestParam("name") String name) {
    return new ResponseEntity<>(new Bazz(id, name), HttpStatus.OK);
}

@DeleteMapping("/{id}")
public ResponseEntity<?> deleteBazz(@PathVariable String id){
    return new ResponseEntity<>(new Bazz(id), HttpStatus.OK);
}
```

## Spring Configuration

The Spring MVC Configuration is simple enough, considering that our `FooController` is defined in the following package:

```text
package org.baeldung.spring.web.controller;

@Controller
public class FooController { ... }
```

We simply need a `@Configuration` class to enable the full MVC support and configure classpath scanning for the controller:

```text
@Configuration
@EnableWebMvc
@ComponentScan({ "org.baeldung.spring.web.controller" })
public class MvcConfig {
    //
}
```


## Reference

- [Spring RequestMapping](https://www.baeldung.com/spring-requestmapping)
- [Spring @RequestMapping New Shortcut Annotations](https://www.baeldung.com/spring-new-requestmapping-shortcuts)
