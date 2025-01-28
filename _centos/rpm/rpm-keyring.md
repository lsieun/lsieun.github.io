---
title: "RPM keyring"
sequence: "rpm-keyring"
---

RPM 密钥环（RPM keyring）是 RPM 软件包管理系统使用的一种机制，用于验证和验证软件包的完整性和真实性。

RPM 密钥环是一组数字签名密钥，用于对 RPM 软件包进行数字签名。
这些密钥包含在 GPG（GNU Privacy Guard）密钥环中，它们用于创建和验证 RPM 软件包的数字签名。

当您使用 RPM 软件包管理器（如 yum 或 dnf）安装、更新或移除软件包时，软件包管理器会检查软件包的数字签名，以确保其未被篡改或修改过。
如果软件包的数字签名与密钥环中的密钥匹配，那么软件包被视为受信任的，可以安全地进行操作。
如果数字签名无效或没有相关的密钥，软件包管理器会发出警告或拒绝操作，以防止潜在的安全风险。

RPM 密钥环通常由操作系统或软件存储库的提供者维护和管理。
密钥环中的密钥可以通过使用 `rpm --import` 命令或通过其他方式导入。
安装操作系统时，可能会默认包含一组公共的密钥用于验证操作系统提供的软件包。
此外，您可以手动导入其他存储库的密钥，以确保您从这些存储库下载的软件包的完整性。

维护良好的 RPM 密钥环非常重要，它可以帮助保护您的系统免受恶意软件和篡改软件包的风险。
确保在添加新的存储库或下载软件包时，验证其数字签名并从可靠的来源获取密钥是一个好习惯。

## 查看内容

要查看RPM密钥环中的内容，您可以使用以下命令：

```
rpm -q gpg-pubkey
```

这将列出RPM密钥环中安装的所有GPG（GNU Privacy Guard）公钥。
每个密钥都具有一个唯一的标识符，以"gpg-pubkey-"开头，后跟8位或16位的十六进制数。例如：

```
gpg-pubkey-01234567-01234567
gpg-pubkey-abcdef01-fedcba98
```

此外，您还可以使用 `rpm -qi` 命令结合密钥标识符来查看有关特定密钥的详细信息。例如：

```
rpm -qi gpg-pubkey-01234567-01234567
```

这将显示与给定密钥标识符相对应的详细密钥信息，例如密钥拥有者、创建日期和过期日期等。

请注意，要执行上述命令，您需要具有superuser（root）权限或以root用户身份执行命令，可以使用`sudo`命令。

另外，请注意RPM密钥环的位置可能因不同的系统而有所不同，通常在`/etc/pki/rpm-gpg/`目录下。