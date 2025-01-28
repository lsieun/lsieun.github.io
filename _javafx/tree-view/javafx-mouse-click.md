---
title: "Mouse Click"
sequence: "102"
---

```text
dataTreeView.addEventFilter(MouseEvent.MOUSE_CLICKED, new EventHandler<MouseEvent>() {
    @Override
    public void handle(MouseEvent event) {
        MouseButton button = event.getButton();
        if (button != MouseButton.SECONDARY) {
            return;
        }
        Node node = event.getPickResult().getIntersectedNode();
        if (node instanceof Text || (node instanceof TreeCell && ((TreeCell) node).getText() != null)) {
            TreeItem<String> selectedItem = dataTreeView.getSelectionModel().getSelectedItem();
            String value = selectedItem.getValue();
            System.out.println("Node Click: " + value);
        }
    }
});
```

## Reference

- [JavaFX TreeView注册鼠标点击事件](https://blog.csdn.net/u010889616/article/details/80790650)
