---
title: "Plugin: Hunspell"
sequence: "Hunspell"
---

[UP](/ide/intellij-idea-index.html)


## About Hunspell

[Hunspell](https://hunspell.github.io/) is a free spell checker and morphological analyzer library.

Hunspell is used by LibreOffice office suite, free browsers, like Mozilla Firefox and Google Chrome, and other tools and OSes, like Linux distributions and macOS. It is also a command-line tool for Linux, Unix-like and other OSes.(许多厂商在使用它，说明它受欢迎)

It is designed for quick and high quality spell checking and correcting for languages with word-level writing system, including languages with rich morphology, complex word compounding and character encoding.(它的特点是 quick 和 high quality)

## Jetbrains Hunspell Plugin

[Hunspell](https://plugins.jetbrains.com/plugin/10275-hunspell) uses its own dictionary format, with each dictionary comprising **two files**. These files are commonly stored in the same directory and share the same name, for example, `en_GB.dic` and `en_GB.aff`.

In the majority of cases, however, downloading a ready-made dictionary online is more than enough to fulfill one's spell-checking needs. These resources may provide you with a good start for finding a dictionary:

- [https://github.com/JetBrains/hunspell-dictionaries](https://github.com/JetBrains/hunspell-dictionaries)
- [https://github.com/wooorm/dictionaries](https://github.com/wooorm/dictionaries)
- [https://github.com/titoBouzout/Dictionaries](https://github.com/titoBouzout/Dictionaries)
- [http://wordlist.aspell.net/dicts/](http://wordlist.aspell.net/dicts/)
- [http://extensions.services.openoffice.org/en/dictionaries](http://extensions.services.openoffice.org/en/dictionaries)

Having downloaded the dictionary, store it in a folder of your choice so that you can locate it from IDE.
After you've downloaded a dictionary, appoint it to be used by the spell checking engine.
Navigate to the `Settings/Preferences | Editor | Spelling`, switch to the **Dictionaries** tab and select the dictionary file (*.dic). With the dictionary in place, IDE will provide you with everything you would expect from a spell checking system: it will detect and highlight typos in your text and propose corrections for them.
