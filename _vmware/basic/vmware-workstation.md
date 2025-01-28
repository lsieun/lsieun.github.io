---
title: "VMware Workstation"
sequence: "104"
---

Vmware Workstation 发布新版本了，
2022年11月17日 VMware Workstation 17.0 Pro 发行说明
```text
https://docs.vmware.com/cn/VMware-Workstation-Pro/17.0/rn/vmware-workstation-170-pro-release-notes/index.html
```

VMware Workstation 17.0 许可密钥（通用批量永久激活许可）

```text
JU090-6039P-08409-8J0QH-2YR7F
ZF3R0-FHED2-M80TY-8QYGC-NPKYF
FC7D0-D1YDL-M8DXZ-CYPZE-P2AY6
ZC3TK-63GE6-481JY-WWW5T-Z7ATA
1Z0G9-67285-FZG78-ZL3Q2-234JG
```

下载地址
VMware Workstation Pro 17.0.0 Build 20800274 官方版（2022/11/17）

```text
https://download3.vmware.com/software/WKST-1700-WIN/VMware-workstation-full-17.0.0-20800274.exe
```



VMware Workstation Pro 16.2.4 Build 20089737 官方版（2022/07/22）
```text
https://download3.vmware.com/software/WKST-1624-WIN/VMware-workstation-full-16.2.4-20089737.exe
```


VMware Workstation Pro 15.5.7 Build 17171714 官方版 for Windows 7 或更高版64位
```text
https://download3.vmware.com/software/wkst/file/VMware-workstation-full-15.5.7-17171714.exe
```


VMware Workstation Pro 12.5.9 Build 7535481 官方版 for Windows 7 或更高版64位
```text
https://download3.vmware.com/software/wkst/file/VMware-workstation-full-12.5.9-7535481.exe
```


VMware Workstation 10.0.7 Build 2844087 官方版 for Windows XP 或更高版32位和64位

VMware Workstation Pro 16.2.1 Build 18811642 官方正式版（2021/11/09）
```text
https://download3.vmware.com/software/wkst/file/VMware-workstation-full-16.2.1-18811642.exe
```


VMware Workstation Pro 15.5.7 Build 17171714 官方版 for Windows 7 或更高版64位
```text
https://download3.vmware.com/software/wkst/file/VMware-workstation-full-15.5.7-17171714.exe
```


VMware Workstation Pro 12.5.9 Build 7535481 官方版 for Windows 7 或更高版64位
```text
https://download3.vmware.com/software/wkst/file/VMware-workstation-full-12.5.9-7535481.exe
```


VMware Workstation 10.0.7 Build 2844087 官方版 for Windows XP 或更高版32位和64位
```text
https://download3.vmware.com/software/wkst/file/VMware-workstation-full-10.0.7-2844087.exe
```


- VM16 -> Windows 10 或更高版64位
- VM15 -> Windows 7 或更高版64位
- VM12 -> Windows 7 或更高版64位
- VM10 -> Windows XP 或更高版32位和64位

官方自VM14版本开始不支持某些老旧电脑硬件
会提示不支持或安装失败, 如遇到请退回12版本

VMware启动系统黑屏如何解决？
VMware Workstation 14开启或新建虚拟机后黑屏的现象，同时发现如果挂起虚拟机，可以显示挂起前最后的画面。显然，虚拟机核心是正常工作的，
只是“显示”方面出现了问题。
根据我的知识，虚拟机内界面的显示其实是通过“内部网络传输”的方式实现的，因此，无法显示虚拟机的界面，很有可能是网络方面的组件出现了问题。我们排查如下：

以管理员身份运行命令提示符（cmd.exe），输入命令 netsh winsock show catalog
可以看到VMware注册了两个LSP：vSockets DGRAM、vSockets STREAM，路径是%windir%\system32\vsocklib.dll
观察有没有其他模块也注册了vSockets DGRAM、vSockets STREAM，如果有，就卸载掉这个模块所属的软件。
（可选）在命令提示符输入netsh winsock reset，并重启计算机
（可选）重装VMware Workstation 14
我是安装了迅游加速器，它注册了vSockets DGRAM，与VMware产生了冲突，卸载迅游加速器后VMware不再黑屏

经总结主要原因是14版本之后注册了两个LSP协议（vSockets DGRAM、vSockets STREAM）导致异常！
解决方法：使用LSP修复工具（例如：360安全卫士/金山毒霸里的LSP工具）修复LSP网络协议
或者重置下网络链接Winsock，即打开命令提示符cmd.exe，输入命令
netsh int ip reset
　　          netsh winsock reset
重启系统即可解决！
解决方法二：
1、同样以管理员身份运行 命令提示符 ；
2、依次执行下面5个命令：
1、netsh winsock reset
2、net stop VMAuthdService
3、net start VMAuthdService
4、net stop VMwareHostd
5、net start VMwareHostd
第二种BIOS设置问题
对于这个问题，网上有说法说是没有启用电脑的虚拟机化技术，即Virtrualization Technology，虽然我也不太明白虚拟机化技术到底是个什么玩意儿，但是可以尝试一下。重新启动电脑，在启动界面进入BIOS设置，不同的电脑进入BIOS设置的方法不太一样，但是也差不了太多，在启动界面慢慢找提示。进入BIOS以后，找到Intel (R) Virtualization Technology这一设置项，看看该项是否启动，我的是Disabled，现在设置成Enabled，保存设置以后重新启动电脑，安装centos7.0，问题果然得到了解决。
第一启动改成光驱启动
第三种打开虚拟打印。
编辑 -> 首选项 -> 设备 -> 更改设置 -> 打勾 “启用虚拟打印机”-> 确定
VMware启动后假死卡住如何解决？
解决方法：可以尝试关闭系统防火墙！
