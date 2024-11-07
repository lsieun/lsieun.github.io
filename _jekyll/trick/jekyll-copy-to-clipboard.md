---
title: "Copy to Clipboard"
sequence: "102"
---

## 步骤

第 1 步，添加 `assets/js/copyCode.js` 文件：

```javascript
const codeBlocks = document.querySelectorAll('pre.highlight');
codeBlocks.forEach(function (codeBlock) {
    const copyButton = document.createElement('button');
    copyButton.className = 'copy';
    copyButton.type = 'button';
    copyButton.ariaLabel = 'Copy code to clipboard';
    copyButton.innerText = 'Copy';
    codeBlock.append(copyButton);
    copyButton.addEventListener('click', function () {
        const code = codeBlock.querySelector('code').innerText.trim();
        window.navigator.clipboard.writeText(code);
        copyButton.innerText = 'Copied';
        const fourSeconds = 4000;
        setTimeout(function () {
            copyButton.innerText = 'Copy';
        }, fourSeconds);
    });
});
```

第 2 步，引入 HTML 页面：

```text
<script src="/assets/js/copyCode.js"></script>
```

例如，在 `_includes/head.html` 文件添加：

```text
<script type="text/javascript" src="{{ "/assets/js/copyCode.js" | relative_url }}" defer></script>
```

第 3 步，修改样式（非必要），例如添加在 `assets/css/extra.css` 文件：

```scss
pre.highlight {
    padding: 8px 12px;
    position: relative;

    /* Override skeleton styles */

    > code {
        border: 0;
        overflow-x: auto;
        padding-right: 0;
        padding-left: 0;
    }

    &.highlight {
        border-left: 15px solid #35383c;
        color: #c1c2c3;
        overflow: auto;
        white-space: pre;
        word-wrap: normal;

        &, code {
            background-color: #222;
            font-size: 14px;
        }
    }

    /* Copy code to clipboard button */

    .copy {
        color: #4AF626;
        position: absolute;
        right: 1.2rem;
        top: 1.2rem;
        opacity: 0;

        &:active,
        &:focus,
        &:hover {
            background: rgba(0, 0, 0, 0.5);
            opacity: 1;
        }
    }

    &:active .copy,
    &:focus .copy,
    &:hover .copy {
        background: rgba(0, 0, 0, 0.7);
        opacity: 1;
    }
}
```

## Reference

- [Easiest way to place "Copy to Clipboard" on a Jekyll Blog](https://www.reddit.com/r/web_design/comments/t9nkmq/easiest_way_to_place_copy_to_clipboard_on_a/)
