---
title: "Casbin Intro"
sequence: "202"
---

An authorization library
that supports **access control models** like ACL, RBAC, ABAC
for Golang, Java, C/C++, Node.js...

```text
Casbin = an authorization library = different access control models + different languages
```

- **policy** file: subjects, objects and desired allowed action
- **model** file: layout, execution and conditions for authorization

Casbin provides an `Enforcer` for validating an incoming request
based on the policy and model files given to the Enforcer.

```text
Casbin ---> Enforcer ---> policy file + model file
```

## What is Casbin?

Casbin is an authorization library
which can be used in flows where we want a certain `object` or entity to be accessed by a specific user or `subject`.
The type of access i.e. `action` can be read, write, delete or any other action as set by the developer.
This is how Casbin is most widely used and its called the "standard" or classic `{ subject, object, action }` flow.

## Reference

- Casbin: [casbin.io](https://casbin.io/) [casbin.org](https://casbin.org/)
- Casbin Online Editor: [casbin.io](https://casbin.io/editor) [casbin.org](https://casbin.org/en/editor)
- Model
  - [Supported Models](https://casbin.io/docs/supported-models)
  - [Syntax for Models](https://casbin.io/docs/syntax-for-models)

jCasbin

- [Github: casbin/jcasbin](https://github.com/casbin/jcasbin)
- [Gitee: jCasbin](https://gitee.com/mirrors/jCasbin)

Spring Boot

- [基于jCasbin的Spring BootRBAC和ABAC授权插件](https://www.mianshigee.com/project/jcasbin-jcasbin-springboot-plugin)