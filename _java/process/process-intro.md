---
title: "Process Intro"
sequence: "101"
---

```text
Process process = Runtime.getRuntime().exec("notepad");
int exitCode = process.waitFor();
System.out.println(exitCode);
```

```text
try {
    StringBuilder builder = new StringBuilder();

    Process process = Runtime.getRuntime().exec(command);
    Executors.newSingleThreadExecutor().submit(() ->
        new BufferedReader(new InputStreamReader(process.getInputStream())).lines().forEach(builder::append)
    );
    int exitCode = process.waitFor();

    if (exitCode != 0) {
        throw new MojoExecutionException("Execution of command '" + command + "' failed with exit code: " + exitCode);
    }

    // return the output
    return builder.toString();

} catch (IOException | InterruptedException e) {
    throw new MojoExecutionException("Execution of command '" + command + "' failed", e);
}
```
