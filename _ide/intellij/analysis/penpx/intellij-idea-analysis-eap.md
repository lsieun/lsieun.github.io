---
title: "EAP"
sequence: "106"
---

如果将正式版改为 EAP，并且将它的时间限制解除就可以了。

```text
com.intellij.openapi.application.impl.ApplicationInfoImpl::isEAP:()Z
```

## product.jar

- `message/LicenseBundle.properties`

```text
title.0.eap.build.expired={0} EAP Build Expired
error.message.0.eap.build.expired=This build of {0} has expired.\nThe IDE will now close...
```
