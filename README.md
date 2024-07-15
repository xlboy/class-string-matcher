# class-context-parser

轻松解析 `react/vue/svelte/...` 中的 class 定义

## 为什么需要这玩意儿？

先看下面这些复杂的 class 定义
![image](https://github.com/user-attachments/assets/4af40a89-153d-4393-a922-1777bed44a22)

比如这种 react 的 class 定义，像 unocss 的 vscode plugin 就会出现大面积的无响应（明明是属于 class 的定义范围，但就是没提示）

原因就是 unocss 背后是基于 简单&少量 的正则来匹配相关 context-input（text-red bg-red ...）

反而 tailwind 这边却能正常匹配出来，原因是 tailwind 这边是基于 parser 实现的（基于轻量级的 moo）

也就是说，twind/unocss 这边想做到尽可能完美的 code-intellisense，也需要一个 parser（也就是此库的由来）

最后大功告成时，twind 能用，unocss 也能用。

## 需要覆盖的相关场景

![image](https://github.com/user-attachments/assets/1411d1f3-13b2-4014-a9a2-e808ec023384)


![image](https://github.com/user-attachments/assets/934f9c88-74b1-4385-8bfb-2e44a5c2899b)
