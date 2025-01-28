---
title: "Deployment"
sequence: "101"
---

Deploying a Servlet 3 application is a breeze.
Thanks to the servlet annotation types and depending on how complex your application is,
you can deploy a servlet/JSP application without the deployment descriptor.
Having said that, the deployment descriptor is still needed in many circumstances
where more refined configuration is needed.
When the deployment descriptor is present, it must be named `web.xml` and
located under the `WEB-INF` directory.
Java classes must reside in `WEB-INF/classes` and Java libraries in `WEB-INF/lib`.
All application resources must then be packaged into a single file with war extension.
A war file is basically a jar file.




