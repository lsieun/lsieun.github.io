---
title: "FileOwnerAttributeView"
sequence: "104"
---

[UP](/java/java-io-index.html)

## FileOwnerAttributeView

```text
                          ┌─── name()
                          │
FileOwnerAttributeView ───┼─── getOwner() --> UserPrincipal
                          │
                          └─── setOwner() <-- UserPrincipal
```

```text
             ┌─── getName() ───┼─── return ───┼─── String
Principal ───┤
             │                 ┌─── params ───┼─── Subject
             └─── implies() ───┤
                               └─── return ───┼─── boolean
```

## AclFileAttributeView

```text
                        ┌─── name() ─────┼─── return ───┼─── String
                        │
AclFileAttributeView ───┼─── getAcl() ───┼─── return ───┼─── List<AclEntry>
                        │
                        │                ┌─── params ───┼─── List<AclEntry>
                        └─── setAcl() ───┤
                                         └─── return ───┼─── void
```

```text
                                               ┌─── ALLOW
                                               │
                                               ├─── DENY
            ┌─── type ────┼─── AclEntryType ───┤
            │                                  ├─── AUDIT
            │                                  │
            │                                  └─── ALARM
AclEntry ───┤
            ├─── who ─────┼─── UserPrincipal
            │
            ├─── perms ───┼─── Set<AclEntryPermission>
            │
            └─── flags ───┼─── Set<AclEntryFlag>
```

```text
                                                         ┌─── READ_DATA (file)
                                          ┌─── read ─────┤
                                          │              └─── LIST_DIRECTORY (dir)
                                          │
                                          │              ┌─── WRITE_DATA (file)
                                          ├─── write ────┤
                                          │              └─── ADD_FILE (dir)
                                          │
                      ┌─── file.or.dir ───┤              ┌─── APPEND_DATA (file)
                      │                   ├─── append ───┤
                      │                   │              └─── ADD_SUBDIRECTORY (dir)
                      │                   │
                      │                   ├─── exe ──────┼─── EXECUTE (file)
                      │                   │
                      │                   │              ┌─── DELETE (file)
                      │                   └─── delete ───┤
                      │                                  └─── DELETE_CHILD(dir)
                      │
                      │                                   ┌─── READ_NAMED_ATTRS
                      │                   ┌─── named ─────┤
AclEntryPermission ───┤                   │               └─── WRITE_NAMED_ATTRS
                      │                   │
                      │                   │               ┌─── READ_ACL
                      │                   ├─── acl ───────┤
                      ├─── attr ──────────┤               └─── WRITE_ACL
                      │                   │
                      │                   │               ┌─── READ_ATTRIBUTES
                      │                   ├─── non-acl ───┤
                      │                   │               └─── WRITE_ATTRIBUTES
                      │                   │
                      │                   └─── owner ─────┼─── WRITE_OWNER
                      │
                      └─── safety ────────┼─── SYNCHRONIZE
```
