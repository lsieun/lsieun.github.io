---
title: "Environment replacement"
sequence: "103"
---

## 如何定义

Environment variables (declared with the `ENV` statement)
can also be used in certain instructions as variables to be interpreted by the `Dockerfile`.
Escapes are also handled for including variable-like syntax into a statement literally.

## 如何使用

Environment variables are notated in the `Dockerfile` either with `$variable_name` or `${variable_name}`.
They are treated equivalently and
the brace syntax is typically used to address issues with variable names with no whitespace, like `${foo}_bar`.

The `${variable_name}` syntax also supports a few of the standard `bash` modifiers as specified below:

- `${variable:-word}` indicates that if `variable` is set then the result will be that value.
  If `variable` is not set then `word` will be the result.
- `${variable:+word}` indicates that if `variable` is set then `word` will be the result,
  otherwise the result is the empty string.

In all cases, `word` can be any string, including additional environment variables.

### Escaping

**Escaping** is possible by adding a `\` before the variable: `\$foo` or `\${foo}`,
for example, will translate to `$foo` and `${foo}` literals respectively.

Example (parsed representation is displayed after the `#`):

```text
FROM busybox
ENV FOO=/bar
WORKDIR ${FOO}   # WORKDIR /bar
ADD . $FOO       # ADD . /bar
COPY \$FOO /quux # COPY $FOO /quux
```

## 适用范围

Environment variables are supported by the following list of instructions in the `Dockerfile`:

- `ADD`
- `COPY`
- `ENV`
- `EXPOSE`
- `FROM`
- `LABEL`
- `STOPSIGNAL`
- `USER`
- `VOLUME`
- `WORKDIR`
- `ONBUILD` (when combined with one of the supported instructions above)

## 执行顺序

Environment variable substitution will use the same value for each variable throughout the entire instruction.
In other words, in this example:

```text
ENV abc=hello
ENV abc=bye def=$abc
ENV ghi=$abc
```

will result in `def` having a value of `hello`, not `bye`.
However, `ghi` will have a value of `bye` because it is not part of the same instruction that set `abc` to `bye`.
