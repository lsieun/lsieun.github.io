---
title: "定时任务 Mysql 备份 - Windows"
sequence: "102"
---

## backupMySQL.bat

```text
@echo off

@echo Ready to back up

set hour=%Time:~0,2%

if "%Time:~0,1%"==" " set hour=0%Time:~1,1%

set now=%Date:~0,4%%Date:~5,2%%Date:~8,2%-%hour%%Time:~3,2%%Time:~6,2%

set host=localhost

set port=3306

set user=jinma

set pass=123456

set dbname=jm_dma_db

set back_path=E:\Data\mysql

set backupfile=%back_path%\%dbname%-%now%.sql

"mysqldump" -h%host% -P%port% -u%user% -p%pass% -c --add-drop-table --no-tablespaces %dbname% > %backupfile%

@echo Back Up Success!!!

@echo Good Bye
```

## 创建定时任务

### 打开任务计划程序

第一种方式，打开控制面板 > 系统和安全 > 管理工具 > 计划程序，：

![](/assets/images/db/mysql/windows-control-panel-task-schedule.png)

第二种方式，在运行对话框，输入 `taskschd.msc`：

![](/assets/images/db/mysql/windows-run-taskched-msc.png)


### 创建任务

第一步，在**任务计划程序**中，点击**创建任务**：

![](/assets/images/db/mysql/taskschd-new-task.png)

第二步，在**常规**选项卡，填写任务信息：

![](/assets/images/db/mysql/taskschd-new-task-detail.png)

第三步，在**触发器**选项卡，点击**新建**按钮：

![](/assets/images/db/mysql/taskschd-new-task-trigger.png)

在**新建触发器**，填写配置：

![](/assets/images/db/mysql/taskschd-new-task-trigger-detail.png)

点击**确定**，回到**触发器**界面：

![](/assets/images/db/mysql/taskschd-new-task-trigger-complete.png)

第四步，在**操作**选项卡，点击**新建**按钮：

![](/assets/images/db/mysql/taskschd-new-task-operation.png)

在**新建操作**中，选择之前的 `bat` 文件：

![](/assets/images/db/mysql/taskschd-new-task-operation-detail.png)

点击**确定**，返回**操作**界面：

![](/assets/images/db/mysql/taskschd-new-task-operation-complete.png)

### 测试

选中刚刚添加的任务，在右侧中点击**运行**按钮，进行测试：

![](/assets/images/db/mysql/taskschd-run.png)


## Reference

- [windows 系统 mysql 定时备份](https://blog.csdn.net/qq_41512902/article/details/125564186)
- ['Access denied; you need (at least one of) the PROCESS privilege(s) for this operation' when trying to dump tablespaces](https://dba.stackexchange.com/questions/271981/access-denied-you-need-at-least-one-of-the-process-privileges-for-this-ope)
