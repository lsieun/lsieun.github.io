---
title: "Function Pointers"
sequence: "101"
---

## Example Uses of Function Pointers

- Functions as Arguments to Other Functions
- Callback Functions

## Function Pointer Syntax

Let's look at a simple example:

```text
void (*foo)(int);
```

In this example, `foo` is a pointer to a function taking one argument, an integer, and that returns `void`.
It's as if you're declaring a function called "*foo", which takes an `int` and returns `void`;
now, if `*foo` is a function, then `foo` must be a pointer to a function.
(Similarly, a declaration like `int *x` can be read as `*x` is an `int`, so `x` must be a pointer to an `int`.)

The key to writing the declaration for a **function pointer** is that
you're just writing out the declaration of a function but with `(*func_name)` where you'd normally just put `func_name`.

### Initializing Function Pointers

To initialize a function pointer, you must give it the address of a function in your program.

The syntax is like any other variable:

```text
#include <stdio.h>
void my_int_func(int x)
{
    printf("%d\n", x );
}
 
int main()
{
    void (*foo)(int);
    /* the ampersand is actually optional */
    foo = &my_int_func;
 
    return 0;
}
```

### Using a Function Pointer

To call the function pointed to by a function pointer,
you treat the function pointer as though it were the name of the function you wish to call.
The act of calling it performs the dereference; there's no need to do it yourself:

```text
#include <stdio.h>
void my_int_func(int x)
{
    printf( "%d\n", x );
}
 
 
int main()
{
    void (*foo)(int);
    foo = &my_int_func;
 
    /* call my_int_func (note that you do not need to write (*foo)(2) ) */
    foo( 2 );
    /* but if you want to, you may */
    (*foo)( 2 );
 
    return 0;
}
```

Note that function pointer syntax is flexible;
it can either look like most other uses of pointers, with `&` and `*`, or you may omit that part of syntax.
This is similar to how arrays are treated, where a bare array decays to a pointer,
but you may also prefix the array with `&` to request its address.

## Typedef for Function Pointers

We can use `typedef` to simplify the usage of function pointers.

Imagine we have some functions, all having the same signature,
that use their argument to print out something in different ways:

```text
#include<stdio.h>

void print_to_n(int n)
{
    for (int i = 1; i <= n; ++i)
        printf("%d\n", i);
}

void print_n(int n)
{
    printf("%d\n, n);
}
```

Now we can use a `typedef` to create a **named function pointer** type:

```text
typedef void (*printer_t)(int);
```

This creates a type, named `printer_t` for a pointer to a function that takes a single `int` argument and returns nothing,
which matches the signature of the functions we have above.
To use it we create a variable of the created type and assign it a pointer to one of the functions in question:

```text
printer_t p = &print_to_n;
void (*p)(int) = &print_to_n; // This would be required without the type
```

## Reference

- [Function Pointers in C and C++](https://www.cprogramming.com/tutorial/function-pointers.html)
- [Typedef for Function Pointers](https://riptutorial.com/c/example/31818/typedef-for-function-pointers)
