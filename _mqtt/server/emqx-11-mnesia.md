---
title: "EMQX Mnesia"
sequence: "331"
---

You can use the built-in database of EMQX as a low-cost and out-of-the-box option for password authentication.
After enabling, EMQX will save the client credentials in its built-in database (based on **Mnesia**)
and manages data via REST API and Dashboard.
This chapter will introduce how to use EMQX Dashboard and configuration items to configure.

关于Mnesia

电信系统的数据管理与传统的商业数据库管理系统(DBMS)有很多相似之处，但并不完全相同。
特别是许多不间断系统所要求的高等级容错，需要将数据库管理系统与应用程序结合运行在相同地址空间等，
导致我们实现了一个全新的数据库管理系统 Mnesia `[m'niːzɪə]`。

Mnesia 与 Erlang 编程语言密切联系并且用 Erlang 实现，提供了实现容错电信系统所需要的功能。
Mnesia 是专为工业级电信应用打造，使用符号编程语言 Erlang 写成的多用户，分布式数据库管理系统。

```text
Why Is the DBMS Called Mnesia?
The original name was Amnesia. One of our bosses didn't like the name. He said,
"You can't possibly call it Amnesia — you can't have a database that forgets things!"
So, we dropped the A, and the name stuck.
```

- amnesia: 遗忘（症）；记忆缺失 a medical condition in which sb partly or completely loses their memory
