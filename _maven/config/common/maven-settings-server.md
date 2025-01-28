---
title: "Server"
sequence: "102"
---

The `<servers>` element allows us to specify the credentials of the Maven repositories
to which we want to deploy our artifacts.

```xml
<!-- servers
 | This is a list of authentication profiles, keyed by the server-id used within the system.
 | Authentication profiles can be used whenever maven must make a connection to a remote server.
 |-->
<servers>
    <!-- server
     | Specifies the authentication information to use when connecting to a particular server, identified by
     | a unique name within the system (referred to by the 'id' attribute below).
     |
     | NOTE: You should either specify username/password OR privateKey/passphrase, since these pairings are
     |       used together.
     |
    -->
    <server>
        <id>deploymentRepo</id>
        <username>repouser</username>
        <password>repopwd</password>
    </server>

    <!-- Another sample, using keys to authenticate. -->
    <server>
        <id>siteServer</id>
        <privateKey>/path/to/private/key</privateKey>
        <passphrase>optional; leave empty if not used.</passphrase>
    </server>
</servers>
```
