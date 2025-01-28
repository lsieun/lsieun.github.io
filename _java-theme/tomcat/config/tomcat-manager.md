---
title: "Tomcat Manager"
sequence: "102"
---

To access the Tomcat manager, we need to create a user with the privileges to do that.

修改文件：

```text
tomcat/conf/tomcat-users.xml
```

In this file, we'll define the users to access the tomcat manager.

```xml
<?xml version='1.0' encoding='utf-8'?>
<tomcat-users xmlns="http://tomcat.apache.org/xml"
              xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
              xsi:schemaLocation="http://tomcat.apache.org/xml tomcat-users.xsd"
              version="1.0">
    <user username="admin" password="admin" roles="manager-gui,admin-gui"/>
</tomcat-users>
```

In the `<user>` tag, we are defining a **user** `admin` with the password `admin`
with the **roles** `manager-gui` and `admin-gui`.

Now, we restart the server and open the URL `http://localhost:8080` again.
This time we click on the **Manager App** button and the server asks for credentials.

![](/assets/images/java/tomcat/tomcat-web-manager-app.png)

After entering the provided credentials, we should see the following screen:

![](/assets/images/java/tomcat/tomcat-web-application-manager.png)


