---
title: "DirectoryChooser"
sequence: "102"
---

The `DirectoryChooser` class lets you display a platform-dependent directory dialog.

The `DirectoryChooser` class contains two properties:

- title
- initialDirectory

The `title` property is a string, and it is the title of the directory dialog.
The `initialDirectory` property is a File,
and it is the initial directory selected in the dialog when the dialog is shown.

Use the `showDialog(Window ownerWindow)` method of the `DirectoryChooser` class
to open the directory dialog.
When the dialog is opened, you can select at most one directory or
close the dialog without selecting a directory.
The method returns a File, which is the selected directory,
or `null` if no directory is selected.
The method is blocked until the dialog is closed.
If an owner window is specified, input to all windows in the owner window chain is blocked when the dialog is shown.
You can specify a `null` owner window.

```text
DirectoryChooser dirDialog = new DirectoryChooser();

// Configure the properties
dirDialog.setTitle("Select Destination Directory");
dirDialog.setInitialDirectory(new File("c:\\"));

// Show the directory dialog
File dir = dirDialog.showDialog(null);
if (dir != null) {
        System.out.println("Selected directory: " + dir);
} else {
        System.out.println("No directory was selected.");
}
```
