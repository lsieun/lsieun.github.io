---
title: "异常处理"
sequence: "101"
---

## Intro

SpringBoot provides a very powerful annotation called `@ControllerAdvide`
under package `org.springframework.web.bind.annotation`.
This annotation makes our life easy to handle all kinds of exceptions at a central place in our application.
We don't need to catch any exception at each method or class separately
instead you can just throw the exception from the method,
and then it will be caught under the central exception handler class annotated by `@ControllerAdvide`.
Any class annotated with `@ControllerAdvice` will become a controller-advice class
which will be responsible for handling exceptions.
Under this class, we make use of annotations provided as `@ExceptionHandler`, `@ModelAttribute`, `@InitBinder`.

Exception handling methods annotated with `@ExceptionHandler` will catch the exception thrown by the declared class,
and we can perform various things whenever we come through the related type exceptions.

## @ControllerAdvice

```java
package org.springframework.web.bind.annotation;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface ControllerAdvice {
    @AliasFor("basePackages")
    String[] value() default {};

    @AliasFor("value")
    String[] basePackages() default {};

    Class<?>[] basePackageClasses() default {};

    Class<?>[] assignableTypes() default {};

    Class<? extends Annotation>[] annotations() default {};
}
```

`@ControllerAdvice` constructor comes with some special arguments,
which allows you to scan only the related portion of your application and
handle only those exceptions thrown by the respective classes mentioned in the constructor.

By default, it will scan and handle all the classes in your application.

Below are some types which we can use to restrict only specific classes to handle exceptions.

### annotations

`annotations` - Controllers that are annotated with the mentioned annotations
will be assisted by the `@ControllerAdvice` annotated class and are eligible for exception to those classes

```text
@ControllerAdvice(annotations = RestController.class)
```

Here the exception helper annotated by `@ControllerAdvice` will catch all the exceptions
thrown by the `@RestController` annotation classes.

### basePackages

`basePackages` - By Specifying the packages that we want to scan and handling exceptions for the same.

```text
@ControllerAdvice(basePackages = "org.example.controllers")
```

This will only scan call the mentioned package and handle the exceptions for the same.

### assignableTypes

`assignableTypes` - This argument will make sure to scan and handle the exceptions from the mentioned classes

```text
@ControllerAdvice(assignableTypes = {ControllerInterface.class, AbstractController.class})
```

## Example

### Before Using @ControllerAdvice

In the below code snippet, we see there are many duplications of lines,
and the controller code is not easily readable because of multiple try and catch blocks in each API.

```java
@RestController
@RequestMapping(path = "/employees")
public class EmployeeController {
    private static final Logger logger = LoggerFactory.getLogger(EmployeeController.class);

    private EmployeeDao employeeDao;

    @GetMapping(path = "/{employeeId}", produces = "application/json")
    public ResponseEntity<Employee> getEmployees(@PathVariable Long employeeId) {
        ResponseEntity<Employee> response = null;
        try {
            if (null == employeeId || positionId.equals(0L)) {
                throw new InvalidInputException("Employee Id is not valid");
            }
            employee = employeeDao.getEmployeeDetails(employeeId);
            response = new ResponseEntity<Employee>(employee, HttpStatus.OK);
        } catch (InvalidInputException e) {
            Logger.error("Invalid Input:", e.getMessage());
            response = new ResponseEntity<Employee>(employee, HttpStatus.BAD_REQUEST);
        } catch (BusinessException e) {
            Logger.error("Business Exception:", e.getMessage());
            response = new ResponseEntity<Employee>(employee, HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            Logger.error("System Error:", e.getMessage());
            response = new ResponseEntity<Employee>(employee, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return response;
    }

    @GetMapping(path = "/address/{employeeId}", produces = "application/json")
    public ResponseEntity<Address> getEmployeeAddress(@PathVariable Long employeeId, @RequestHeader Long userId) {
        ResponseEntity<Address> response = null;
        try {
            if (null == employeeId || positionId.equals(0L)) {
                throw new InvalidInputException("Employee Id is not valid");
            }
            if (null == userId || userId.equals(0L)) {
                throw new UnauthorizedException("Unauthorized user");
            }
            address = employeeDao.getEmployeeAddress(employeeId);
            response = new ResponseEntity<Address>(address, HttpStatus.OK);
        } catch (UnauthorizedException e) {
            Logger.error("Unauthorized:", e.getMessage());
            response = new ResponseEntity<Address>(address, HttpStatus.BAD_REQUEST);
        } catch (InvalidInputException e) {
            Logger.error("Invalid Input:", e.getMessage());
            response = new ResponseEntity<Address>(address, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            Logger.error("System Error:", e.getMessage());
            response = new ResponseEntity<Address>(address, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return response;
    }
}
```

### After Using @ControllerAdvice

The below code snippet makes the code easily readable and also reduces duplications of lines.

```java
@RestController
@RequestMapping(path = "/employees")
public class EmployeeController {
    private static final Logger logger = LoggerFactory.getLogger(EmployeeController.class);

    @GetMapping(path = "/{employeeId}", produces = "application/json")
    public ResponseEntity<Employee> getEmployees(@PathVariable Long employeeId) {
        if (null == employeeId || positionId.equals(0L)) {
            throw new InvalidInputException("Employee Id is not valid");
        }
        Employee employee = employeeDao.getEmployeeDetails(employeeId);
        return new ResponseEntity<Employee>(employee, HttpStatus.OK);
    }

    @GetMapping(path = "/address/{employeeId}", produces = "application/json")
    public ResponseEntity<Address> getEmployeeAddress(@PathVariable Long employeeId, @RequestHeader Long userId) {
        if (null == employeeId || employeeId.equals(0L)) {
            throw new InvalidInputException("Employee Id is not valid");
        }
        if (null == userId || userId.equals(0L)) {
            throw new UnauthorizedException("Unauthorized user");
        }
        Address address = employeeDao.getEmployeeAddress(employeeId, userId);
        return new ResponseEntity<Address>(address, HttpStatus.OK);
    }
}

@ControllerAdvice
public class ExceptionHelper {
    private static final Logger logger = LoggerFactory.getLogger(ExceptionHelper.class);

    @ExceptionHandler(value = {InvalidInputException.class})
    public ResponseEntity<Object> handleInvalidInputException(InvalidInputException ex) {
        LOGGER.error("Invalid Input Exception: ", ex.getMessage());
        return new ResponseEntity<Object>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = {Unauthorized.class})
    public ResponseEntity<Object> handleUnauthorizedException(Unauthorized ex) {
        LOGGER.error("Unauthorized Exception: ", ex.getMessage());
        return new ResponseEntity<Object>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = {BusinessException.class})
    public ResponseEntity<Object> handleBusinessException(BusinessException ex) {
        LOGGER.error("Business Exception: ", ex.getMessage());
        return new ResponseEntity<Object>(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(value = {Exception.class})
    public ResponseEntity<Object> handleException(Exception ex) {
        LOGGER.error("Exception: ", ex.getMessage());
        return new ResponseEntity<Object>(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
```

## Reference

- [Best Practice for Exception Handling In Spring Boot](https://dzone.com/articles/best-practice-for-exception-handling-in-spring-boo)
