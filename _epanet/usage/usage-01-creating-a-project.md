---
title: "Creating a Project"
sequence: "101"
---

- **Before any use** is made of the Toolkit, a project and its handle must be created.
- **After all processing** is completed the project should be deleted.

See the code snippet below:

```text
EN_Project ph;  // a project handle
EN_createproject(&ph);
 
// Call functions that perform desired analysis
 
EN_deleteproject(ph);
```
