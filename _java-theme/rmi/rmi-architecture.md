---
title: "The RMI Architecture"
sequence: "102"
---

[UP]({% link _java-theme/java-rmi-index.md %})

## first step

The first step involved in **an RMI application is to create a Java object in the server**.
The object will be used as the remote object.
There is **an additional step** that needs to be performed to make an **ordinary Java object** a **remote object**.
The step is known as **exporting** the remote object.
When an ordinary Java object is exported as a remote object,
it becomes ready to receive/handle calls from remote clients.
The export process produces a remote object reference (also called a **stub**).
The remote reference knows the details about the exported object
such as its location and methods that can be called remotely.
It happens inside the server program.
When this step finishes, the remote object has been created in the server and
is ready to receive a remote method invocation.

## second step

The next step is performed by **the server to register (or bind) the remote reference with an RMI registry**.
The server chooses a unique name for each remote reference it registers with an RMI registry.
A remote client will need to use the same name to look up the remote reference in the RMI registry.
When this step finishes, the RMI registry has registered the remote object reference,
and a client interested in invoking a method on the remote object may ask for its reference from the RMI registry.

For **security reasons**, an RMI registry and the server must run on the same machine
so that a server can register the remote references with the RMI registry.
If this restriction is not imposed,
a hacker may register their own harmful Java objects to your RMI registry from their machine.

## third step

This step involves **the interaction between a client and an RMI registry**.
Typically, a client and an RMI registry run on two different machines.
The client sends a lookup request to the RMI registry for a remote reference.
The client uses a name to look up the remote reference in the RMI registry.
The name is the same as the name used by the server to bind the remote reference in the RMI registry.

The RMI registry returns the remote reference (or **stub**) to the client.
If a remote reference is not bound in the RMI registry with the name used by the client in the lookup request,
the RMI registry throws a `NotBoundException`.
If this step finishes successfully, the client has received the remote reference (or **stub**) of the remote object.

## fourth step

In this step, the client invokes a method on the stub.
At this point, the stub connects to the server and transmits the information
required to invoke the method on the remote object,
such as the name of the method, the method's arguments, etc.

The **stub** knows about the server location and the details about how to contact the remote object on the server.
Many different layers at the network level are involved in transmitting information emanating from the stub to the server.

## fifth step

A **skeleton** is the server-side counterpart of a **stub** on the client side.
Its job is to receive the data sent by the stub.
After a skeleton receives the data,
it reassembles the data into a more meaningful format and invokes the method on the remote object.
Once the remote method call is over on the server,
the skeleton receives the result of the method call and
transmits the information back to the stub through the network layers.
The stub receives the result of the remote method invocation,
reassembles the result, and passes the result to the client program.


