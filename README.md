# class-string-matcher

一个专门设计用于解析各种前端框架（如 React、Vue、Svelte 等）中复杂 class 定义的工具。

## 动机

在现代前端开发中，特别是在使用 React JSX 等框架时，我们经常遇到复杂的 class 定义。例如：

```jsx
<div className={`
  text-center
  ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}
  ${size === 'large' ? 'text-xl p-4' : 'text-base p-2'}
  hover:opacity-80
`}>
  Content
</div>
```

尝试使用正则表达式来解析这样的定义会变得非常复杂，且难以全面覆盖所有边界情况。

`class-string-matcher` 应运而生，它采用基于字符 token 的解析方式（利用 [moo](https://github.com/no-context/moo) 库），提供了一种更可靠和灵活的解析方法。

## 安装

```bash
npm install class-string-matcher
```

## 使用说明

### `classStringMatcher` 函数说明

#### 类型定义

```typescript
declare function classStringMatcher(
  text: string,
  languageId: 'jsx' | 'html' | 'svelte',
): ClassNode[];

interface VueOptions {
  /**
   * Indicates whether the text is within a dynamic context where expressions are allowed.
   * This includes scenarios like:
   * - Vue `:class="..."`
   * - Or similar constructs in other frameworks where **dynamic values** can be used for class names.
   */
  inDynamicContext?: boolean;
}
declare function classStringMatcher(
  text: string,
  languageId: 'vue',
  options: VueOptions,
): ClassNode[];
```

#### `text` 参数格式要求

**`text` 参数必须遵循此规则：** 它的第一个字符必须是 class 有效定义的起始字符。

示例：

1. HTML：

   ```
   完整代码： `<div class="text-red-500" />...`
   text 参数： `"text-red-500" />...`
   ```

2. JSX：
   ```
   完整代码： `<div className={isActive ? 'text-white' : 'opacity-0'} />...`
   text 参数： `{isActive ? 'text-white' : 'opacity-0'} />...`
   ```

注意：`text` 参数应该是从完整代码中截取的 class 定义部分，不包括属性名和等号。例如，不应该是 `={xxx}...` 或 `="xxx"...`。

这种格式要求使得解析器能够直接处理 class 定义的内容，而不需要处理额外的语法元素，从而提高解析的准确性和效率。

### `classStringMatcher` 使用示例

```javascript
import { classStringMatcher } from 'class-string-matcher';

// 完整代码：`<div className={isActive ? 'text-white' : 'opacity-0'} />...`
const result = classStringMatcher(
  `{isActive ? 'text-white' : 'opacity-0'} />...`,
  'jsx',
);
// result :
// [
//  { "pos": { "e": 22, "s": 13 }, "text": "text-white" },
//  { "pos": { "e": 36, "s": 28 }, "text": "opacity-0" }
// ]
```

## License

MIT License © 2024-PRESENT [xlboy](https://github.com/xlboy)
