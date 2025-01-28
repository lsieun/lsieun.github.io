---
title: "Understanding image layers"
sequence: "111"
---

Unlike virtual machine images,
which are big blobs of the entire filesystem required by the operating system installed in the VM,
container images consist of layers that are usually much smaller.
These layers can be shared and reused across multiple images.
This means that only certain layers of an image need to be downloaded
if the rest were already downloaded to the host as part of another image containing the same layers.

Layers make image distribution very efficient but also help to reduce the storage footprint of images.
Docker stores each layer only once.
As you can see in figure 2.8, two containers created from two images that contain the same layers use the same files.

![](/assets/images/docker/docker-images-use-same-layers.png)

The figure shows that containers A and B share an image layer,
which means that applications A and B read some of the same files.
In addition, they also share the underlying layer with container C.
**But if all three containers have access to the same files, how can they be completely isolated from each other?**
Are changes that application A makes to a file stored in the shared layer not visible to application B?
They aren't. Here's why.

**The filesystems are isolated by the Copy-on-Write (CoW) mechanism.**
The filesystem of a container consists of **read-only layers from the container image** and
**an additional read/write layer** stacked on top.

> CoW = Copy On Write

When an application running in container A changes a file in one of the read-only layers,
**the entire file is copied into the container's read/write layer and the file contents are changed there.**
Since each container has its own writable layer, changes to shared files are not visible in any other container.

> 修改

**When you delete a file, it is only marked as deleted in the read/write layer,
but it's still present in one or more of the layers below.
What follows is that deleting files never reduces the size of the image.**

> 删除

## WARNING

Even seemingly harmless operations such as changing permissions or ownership of a file
result in a new copy of the entire file being created in the read/write layer.
If you perform this type of operation on a large file or many files, the image size may swell significantly.

> 修改权限

## Reference

- [Understanding image layers](https://wangwei1237.github.io/Kubernetes-in-Action-Second-Edition/docs/Introducing_containers.html)
