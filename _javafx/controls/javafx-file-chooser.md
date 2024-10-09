---
title: "FileChooser"
sequence: "101"
---

A `FileChooser` is a standard file dialog.
It is used to let the user select files to open or save.

Some of its parts, for example, **the title**, **the initial directory**, and **the list of file extensions**,
can be specified before opening the dialogs.

## 三个步骤

There are three steps in using a file dialog:

- Create an object of the `FileChooser` class.
- Set the initial properties for the file dialog.
- Use one of the `showXXXDialog()` methods to show a specific type of file dialog.

###  Creating a File Dialog

An instance of the `FileChooser` class is used to open file dialogs.

The class contains a no-args constructor to create its objects:

```text
// Create a file dialog
FileChooser fileDialog = new FileChooser();
```

###  Setting Initial Properties of the Dialog

You can set the following initial properties of the file dialog:

- Title
- initialDirectory
- initialFileName
- Extension filters

The `title` property of the `FileChooser` class is a string, which represents the title of the file dialog:

```text
// Set the file dialog title
fileDialog.setTitle("Open Resume");
```

The `initialDirectory` property of the `FileChooser` class is a File,
which represents the initial directory when the file dialog is shown:

```text
// Set C:\ as initial directory (on Windows)
fileDialog.setInitialDirectory(new File("C:\\"));
```

The `initialFileName` property of the `FileChooser` class is a string
that is the initial file name for the file dialog.
Typically, it is used for a file save dialog.
Its effect depends on the platform if it is used for a file open dialog.
For example, it is ignored on Windows:

```text
// Set the initial file name
fileDialog.setInitialFileName("untitled.htm");
```

You can set a list of extension filters for a file dialog.
Filters are displayed as a drop-down box.
One filter is active at a time.
The file dialog displays only those files that match the active extension filter.
An extension filter is represented by an instance of the `ExtensionFilter` class,
which is an inner static class of the `FileChooser` class.
The `getExtensionFilters()` method of the `FileChooser` class
returns an `ObservableList<FileChooser.ExtensionFilter>`.
You add the extension filters to the list.

An extension filter has **two properties**:
**a description** and **a list of file extension** in the form `*.<extension>`:

```text
import static javafx.stage.FileChooser.ExtensionFilter;
...
// Add three extension filters
fileDialog.getExtensionFilters().addAll(
        new ExtensionFilter("HTML Files", "*.htm", "*.html"),
        new ExtensionFilter("Text Files", "*.txt"),
        new ExtensionFilter("All Files", "*.*"));
```

By default, the first extension filter in the list is active when the file dialog is displayed.
Use the `selectedExtensionFilter` property to specify the initial active filter when the file dialog is opened:

```text
// Continuing with the above snippet of code, select *.txt filter by default
fileDialog.setSelectedExtensionFilter(
    fileDialog.getExtensionFilters().get(1));
```

###  Showing the Dialog

An instance of the `FileChooser` class can open three types of file dialogs:

- A file open dialog to select only one file
- A file open dialog to select multiple files
- A file save dialog

The following three methods of the `FileChooser` class are used to open three types of file dialogs:

- `showOpenDialog(Window ownerWindow)`
- `showOpenMultipleDialog(Window ownerWindow)`
- `showSaveDialog(Window ownerWindow)`

The methods do not return until the file dialog is closed.
You can specify `null` as the owner window.
If you specify an owner window, the input to the owner window is blocked when the file dialog is displayed.

The `showOpenDialog()` and `showSaveDialog()` methods return a `File` object,
which is the selected file, or `null` if no file is selected.
The `showOpenMultipleDialog()` method returns a `List<File>`,
which contains all selected files, or `null` if no files are selected:

```text
// Show a file open dialog to select multiple files
List<File> files = fileDialog.showOpenMultipleDialog(primaryStage);
if (files != null) {
        for(File f : files) {
                System.out.println("Selected file :" + f);
        }
} else {
    System.out.println("No files were selected.");
}
```

Use the `selectedExtensionFilter` property of the `FileChooser` class to get the selected extension filter
at the time the file dialog was closed:

```text
import static javafx.stage.FileChooser.ExtensionFilter;
...
// Print the selected extension filter description
ExtensionFilter filter = fileDialog.getSelectedExtensionFilter();
if (filter != null) {
    System.out.println("Selected Filter: " + filter.getDescription());
} else {
        System.out.println("No extension filter selected.");
}
```


