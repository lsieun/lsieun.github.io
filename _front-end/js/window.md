---
title: "window"
sequence: "202"
---

```text
function printPosition(event) {
    console.log(event.pageX, event.pageY);
}

window.addEventListener('click', printPosition);

window.removeEventListener('click', printPosition);
```

```text
let speed = ref<number>(1);
let timer = ref<number>(0);

let dom = bar.value as HTMLElement;

timer.value = window.requestAnimationFrame(function fn(){
    if(speed.value < 90) {
        speed.value += 1;
        dom.style.width = speed.value + '%';
        timer.value = window.requestAnimationFrame(fn);
    }
    else {
        speed.value = 1;
        window.cancelAnimationFrame(timer.value);
    }
});
```

