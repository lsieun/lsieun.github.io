---
title: "Center Image"
sequence: "101"
---

添加 CSS 样式：

```css
/* 仅当 p 标签中只有一个 img 元素时，将其居中 */
article.post div.post-content p:has(img:only-child) {
    text-align: center;
}
```

```html
<article class="post">
    <div class="post-content">
        <p>
            <img src="image1.jpg"/>
        </p>
        <p>
            <img src="image2.jpg"/>
        </p>
        <p>
            <img src="image3.jpg"/>
        </p>
    </div>
</article>
```
