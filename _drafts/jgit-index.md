---
title: "JGit"
image: /assets/images/jgit/jgit-cover.png
permalink: /jgit.html
---

Java implementation of Git

## Basic

<table>
    <thead>
    <tr>
        <th>Basic</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.jgit |
where_exp: "item", "item.url contains '/jgit/basic/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
    </tr>
    </tbody>
</table>

## Porcelain API

<table>
    <thead>
    <tr>
        <th>Repo</th>
        <th>Commit</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.jgit |
where_exp: "item", "item.url contains '/jgit/porcelain/repo/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.jgit |
where_exp: "item", "item.url contains '/jgit/porcelain/commit/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
    </tr>
    </tbody>
</table>

## Plumbing API

## Git Objects

All objects are represented by an SHA-1 id in the Git object model.
In JGit, this is represented by the `AnyObjectId` and `ObjectId` classes.

There are four types of objects in the Git object model:

- blob – used for storing file data
- tree – a directory; it references other trees and blobs
- commit – points to a single tree
- tag – marks a commit as special; generally used for marking specific releases

To resolve an object from a repository, simply pass the right revision as in the following function:

- [How does git compute file hashes?](https://stackoverflow.com/questions/7225313/how-does-git-compute-file-hashes)
- [What is the file format of a git commit object data structure?](https://stackoverflow.com/questions/22968856/what-is-the-file-format-of-a-git-commit-object-data-structure)
- [How to assign a Git SHA1's to a file without Git?](https://stackoverflow.com/questions/552659/how-to-assign-a-git-sha1s-to-a-file-without-git)
- [Git - finding the SHA1 of an individual file in the index](https://stackoverflow.com/questions/460297/git-finding-the-sha1-of-an-individual-file-in-the-index)
- [Explore Git Internals with the JGit API](https://www.codeaffine.com/2014/10/20/git-internals/)
- [Understanding the Fundamentals of Git](https://towardsdatascience.com/understanding-the-fundamentals-of-git-25b5b7ded3c4)
- [A Visual Guide to Git Internals — Objects, Branches, and How to Create a Repo From Scratch](https://www.freecodecamp.org/news/git-internals-objects-branches-create-repo/)
- [JGit to Github Blob Object SHA1 Consistency](https://stackoverflow.com/questions/60937375/jgit-to-github-blob-object-sha1-consistency)

## References

- [learn-jgit][learn-jgit]
- [JGit](https://www.eclipse.org/jgit/)
- [JGit/User Guide](https://wiki.eclipse.org/JGit/User_Guide)
- [baeldung: A Guide to JGit](https://www.baeldung.com/jgit)
- [JGit - Tutorial](https://www.vogella.com/tutorials/JGit/article.html)
- [centic9/jgit-cookbook](https://github.com/centic9/jgit-cookbook)
- [Getting Started with JGit](https://www.javacodegeeks.com/2015/12/getting-started-jgit.html)
- [An Introduction to the JGit Sources](https://www.javacodegeeks.com/2013/11/an-introduction-to-the-jgit-sources.html)
- [Getting all branches with JGit](https://newbedev.com/getting-all-branches-with-jgit)

[learn-jgit]: https://github.com/lsieun/learn-jgit
