---
title: "根据Excel更新CAD的内容"
sequence: "113"
---

没有测试成功

```csharp
using System.Windows.Forms;
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.EditorInput;
using Autodesk.AutoCAD.Runtime;
using Application = Autodesk.AutoCAD.ApplicationServices.Application;
using OpenFileDialog = Autodesk.AutoCAD.Windows.OpenFileDialog;

namespace Lsieun.Cad.Basic.Tbl
{
    public class UpdateTable
    {
        [CommandMethod("CmdUpdateCAD")]
        public void CmdUpdateCAD()
        {
            try
            {
                OpenFileDialog ofd = new OpenFileDialog(
                    "选择需要链接的Excel表格文档！",
                    null,
                    "xls;xlsx",
                    "Excel链接到CAD",
                    OpenFileDialog.OpenFileDialogFlags.DoNotTransferRemoteFiles
                );
                DialogResult dr = ofd.ShowDialog();
                if (dr != DialogResult.OK)
                {
                    return;
                }

                Document doc = Application.DocumentManager.MdiActiveDocument;
                Database db = doc.Database;
                Editor ed = doc.Editor;

                ed.WriteMessage("\n选择到的文件为\"{0}\"", ofd.Filename);

                PromptPointResult ppr = ed.GetPoint("\n请选择表格插入点：");
                if (ppr.Status != PromptStatus.OK)
                {
                    return;
                }

                // 数据链接管理对象
                DataLinkManager dataLinkManager = db.DataLinkManager;

                // 判断数据链接是否已经存在；如果存在，则进行移除。
                const string dlName = "从Excel导入表格";
                ObjectId linkId = dataLinkManager.GetDataLink(dlName);
                if (linkId != ObjectId.Null)
                {
                    dataLinkManager.RemoveDataLink(linkId);
                }

                // 创建并添加新的数据链接
                DataLink dataLink = new DataLink();
                dataLink.DataAdapterId = "AcExcel";
                dataLink.Name = dlName;
                dataLink.Description = "Excel fun with Through the Interface";
                dataLink.ConnectionString = ofd.Filename;
                dataLink.UpdateOption |= (int)UpdateOption.AllowSourceUpdate;

                linkId = dataLinkManager.AddDataLink(dataLink);

                // 开启事务处理
                using (Transaction trans = db.TransactionManager.StartTransaction())
                {
                    BlockTable bt = trans.GetObject(db.BlockTableId, OpenMode.ForRead) as BlockTable;
                    BlockTableRecord btr =
                        trans.GetObject(bt[BlockTableRecord.ModelSpace], OpenMode.ForWrite) as BlockTableRecord;

                    trans.AddNewlyCreatedDBObject(dataLink, true);

                    // 新建表格对象
                    Table tb = new Table();
                    tb.TableStyle = db.Tablestyle;
                    tb.Position = ppr.Value;
                    tb.SetDataLink(0, 0, linkId, true);
                    tb.GenerateLayout();

                    btr.AppendEntity(tb);
                    trans.AddNewlyCreatedDBObject(tb, true);

                    trans.Commit();
                }

                // 强制恢复显示表格
                ed.Regen();
            }
            catch (Exception ex)
            {
                string msg = ex.ToString();
                Editor editor = Application.DocumentManager.MdiActiveDocument.Editor;
                editor.WriteMessage(msg);
            }
        }
    }
}
```
