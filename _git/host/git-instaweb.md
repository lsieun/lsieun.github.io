---
title: "git instaweb"
---

[UP](/git/git-index.html)


## Displaying a repository in a browser: git instaweb

Now that you've shared your repository on disk with other users,
it would be useful if you could provide a basic web interface to go along with your `git daemon`.
Git provides a basic web interface named `gitweb` that can be hosted by a local web server.

HOW CAN YOU INSTALL GITWEB?
Gitweb is usually installed as part of the default Git installation (and is in all the official Git installers).
If it hasn't been, you'll need to install it separately.
This can be done by installing `gitweb` (or similar) with your package manager: for example, on Debian/Ubuntu, run `apt-get install gitweb`.

Git provides the `git instaweb` command to host your local repository using the gitweb interface.
To run this, you must have a web server installed on your machine.
If you're using OS X, you can use WEBrick, which is a simple web server provided with Ruby (which is provided with OS X).
If you're on Linux, you can install Ruby with your package manager:
for example, on Debian/Ubuntu, run `apt-get install ruby`
(you'll use WEBrick on Linux to be consistent with OS X).
Windows Git installation sadly doesn't provide the `git instaweb` command, but you can read how to set up gitweb
using a separate web server such as Apache or IIS here: https://git.wiki.kernel.org/index.php/MSysGit:GitWeb.
