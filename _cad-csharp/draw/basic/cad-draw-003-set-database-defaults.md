---
title: "Entity.SetDatabaseDefaults"
sequence: "103"
---

## Entity.SetDatabaseDefaults

```csharp
namespace Autodesk.AutoCAD.DatabaseServices
{
    public abstract class Entity : DBObject
    {
        public void SetDatabaseDefaults()
        {
        }
        
        public void SetDatabaseDefaults(Database sourceDatabase)
        {
        }
    }
}
```

The `Entity.SetDatabaseDefaults()` function sets the entity's

- Color
- Layer
- Linetype
- Linetype scale
- Visibility
- Plot style name
- Line weight

to the default values of the database in which the entity currently resides or,
if the entity is not part of a database yet,
the current database in the AutoCAD editor is used.

The `Entity.SetDatabaseDefaults(Database)` function sets the entity's:

- Color
- Layer
- Linetype
- Linetype scale
- Visibility
- Plot style name
- Line weight

to the default values of the database indicated by `sourceDatabase`:
If `sourceDatabase == NULL`, then the current database in the AutoCAD editor is used.
