---
title: "Customizing the AutoCAD Startup Process"
sequence: "101"
---

NOTE You can search AutoCAD help on the keywords "command line switch reference" to learn
about all the available switches.

The following shows an example of calling `acad.exe` on Windows using the `/t` command-line switch
to create a new drawing based on a drawing template file named `acad3D.dwt`:

```text
"C:\Program Files\Autodesk\AutoCAD 2014\acad.exe" /t "acad3D.dwt"
```

The following shows an example of calling AutoCAD on macOS using the `-t` command-line switch
to create a new drawing based on the `acad3D.dwt` drawing template file:

```text
"/Applications/Autodesk/AutoCAD 2014/AutoCAD 2014.app/Contents/MacOS/AutoCAD" -t "acad3D.dwt"
```

AutoCAD on Windows supports 15 command-line switches, whereas AutoCAD on macOS supports only 5.
You can use multiple command-line switches when starting AutoCAD:
just add a space after a switch and the previous parameter.

```text
"D:\software\Autodesk\AutoCAD 2014\acad.exe" /product ACAD /language "en-US" /nologo
```

The following table lists the most commonly used command-line switches for Windows,
as well as 3 of the 5 switches that are supported on Mac OS.


<table>
    <caption>AutoCAD command-line switches</caption>
    <thead>
    <tr>
        <th>Switch Name (Windows)</th>
        <th>Switch Name (macOS)</th>
        <th>Description</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td><code>/b</code></td>
        <td><code>-b</code></td>
        <td>
            <p>
                Starts the script file after the specified or default drawing is opened at startup
            </p>
            <p>
                <b>Usage:</b> <code>/b "script_name.scr" or -b "script_name.scr"</code>
            </p>
        </td>
    </tr>
    <tr>
        <td><code>/nohardware</code></td>
        <td></td>
        <td>
            <p>Disables hardware acceleration</p>
            <p>
                <b>Usage:</b> <code>/nohardware</code>
            </p>
        </td>
    </tr>
    <tr>
        <td><code>/nologo</code></td>
        <td><code>-nologo</code></td>
        <td>
            <p>Hides the application's splash screen</p>
            <p>
                <b>Usage:</b> <code>/nologo</code> or <code>-nologo</code>
            </p>
        </td>
    </tr>
    <tr>
        <td><code>/p</code></td>
        <td></td>
        <td>
            <p>Sets a user profile as current or imports a previously exported user profile</p>
            <p>
                <b>Usage:</b> <code>/p "profile_name|profile.arg"</code>
            </p>
        </td>
    </tr>
    <tr>
        <td><code>/t</code></td>
        <td><code>-t</code></td>
        <td>
            <p>Creates a new drawing file based on the specified drawing template file</p>
            <p>
                <b>Usage:</b> <code>/t "template_name.dwt"</code> or <code>-t "template_name.dwt"</code>
            </p>
        </td>
    </tr>
    <tr>
        <td><code>/set</code></td>
        <td></td>
        <td>
            <p>Loads a Sheet Set (DST) file</p>
            <p>
                <b>Usage:</b> <code>/set "sheet_set_name.dst"</code>
            </p>
        </td>
    </tr>
    <tr>
        <td><code>/w</code></td>
        <td></td>
        <td>
            <p>Sets a workspace as current</p>
            <p>
                <b>Usage:</b> <code>/w "workspace_name"</code>
            </p>
        </td>
    </tr>
    </tbody>
</table>


