---
title: "git daemon"
---

[UP](/git/git-index.html)


## Sharing a repository with other users on the same network: git daemon

Now that you've seen how to create bare repositories suitable for a server to share with other Git repositories,
let's learn how to serve these to other Git clients.
In technique 63, you saw a repository being cloned from another path on the disk.
Although this would be one way of sharing a repository over the network with Git
(giving someone access to your disk with, say, a network share), it's not very efficient,
because it uses multiple protocols: the SMB protocol to share the files over the network,
and Git's interaction with the packed repository.
Instead, a Git server allows Git to interact natively in its own format and `git://` protocol,
which transfers repository data in a format similar to how it's stored locally and defaults to using port `9418`.

Git provides a simple command for basic repository hosting named git daemon.
It provides no user authentication or encryption and only supports the `git://` protocol
(rather than the `https://` you've used throughout this book, or `ssh://`, which uses SSH access).
These protocols are fairly interchangeable; which one you pick will depend mostly on
whether you need to use HTTP proxies or web servers (for the `https://` protocol),
user authentication using SSH (for the `ssh://` protocol),
or no authentication (for the `git://` protocol).
This command may be too limited for some cases, but it's great for this technique.

You wish to share a repository with other users on the same network:

- Change directory to the Git repository
- Run `git daemon --verbose --base-path=. --export-all`

```text
$ cd /Users/mike/GitInPracticeRedux.git/
$ git daemon --verbose --base-path=. --export-all
[7744] Ready to rumble
```

Now that you have `git daemon` running,
open another terminal window and clone this repository from a client with `git clone git://localhost/`:

```text
$ git clone git://localhost/ lsieun-java-asm
Cloning into 'lsieun-java-asm'...
remote: Enumerating objects: 799, done.
remote: Counting objects: 100% (799/799), done.
remote: Compressing objects: 100% (353/353), done.
remote: Total 799 (delta 373), reused 799 (delta 373), pack-reused 0
Receiving objects: 100% (799/799), 243.87 KiB | 12.19 MiB/s, done.
Resolving deltas: 100% (373/373), done.
```

If you wanted to clone this from another machine,
you'd replace `localhost` in the command with **the IP address of the machine** hosting the daemon on the network:
for example, `git clone git://192.168.0.123/`.

`git daemon` can take some parameters to customize its behavior:

- `--verbose`: Outputs more verbose log details to the terminal
  about incoming Git client connections and access successes and failures.
  It's useful when hosting a server to enable this for debugging.
- `--base-path=.`: Indicates what path should be used as the server root.
  In this case, you only hosted a single repository, so you set the root to the base directory of the repository.
  If you wanted to host a directory that contained multiple repositories (such as `fish.git` and `cat.git`),
  you could specify the directories, and then they could be accessed by name
  (`git clone git://localhost/fish.git` or `git clone git://localhost/cat.git`).
  I tend to only use `git daemon` to share a single repository, so I use `--base-path=.`.
- `--export-all`: Tells Git to allow access to all Git repositories under the base path.
  Without this argument, by default `git daemon` only allows access to repositories
  that have a git-daemon-export-ok file in the repository root
  (the root for bare repositories and `.git` for non-bare repositories).
  I tend to use this, because I use `git daemon` so infrequently and only on repositories I explicitly, currently want to share. 
- `--enable=receive-pack`: Allows write access to the repository.
  By default, `git daemon` only allows **read access**  (provided by `upload-pack`) to repositories unless this flag is provided.
  It's not recommended that you provide write access to non-bare repositories,
  because it would be undesirable for remote users to be able to change the contents of your local branches.
- `directory`: Needed if you wish to host a non-bare repository.
  In this case, you'd `cd` into the directory as normal but add a `./.git` argument specifying
  that you want to share the `.git` directory.
  For example, you might run `cd /Users/mike/GitInPracticeRedux && git daemon --verbose --base-path=. --export-all ./.git`.
  I use this when temporarily hosting non-bare repositories that I'm working with on my local machine with others.
