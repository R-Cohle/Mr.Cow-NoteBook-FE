# ESM 中 export 的相关知识

​	本篇文章来源于 [Jake Archibald 的这篇博客](https://jakearchibald.com/2021/export-default-thing-vs-thing-as-default/)，内容主要介绍 export 相关的知识与容易造成疑惑的点（如 export default、export xx as default 等）。本人在阅读完后，翻译并稍加更改。

​	不了解 ESM(ES modules) 和 CJS(common js) 的可以先看本 repo 中对 ESM 的概念与应用这两个文件，也可以直接去看**阮一峰**老师对应的 [ESM 与 CJS 的内容](https://es6.ruanyifeng.com/#docs/module)。

​	P.S. 看不下去的小伙伴可以直接看 [Jake 的原文](https://jakearchibald.com/2021/export-default-thing-vs-thing-as-default/)，本人翻译水平有限，见谅😁。

## Imports 是引用，不是值

​	这里有一个 import 语句

```javascript
import {thing} from './module.js';
```

​	在上面的例子中，`thing` 和 `./module.js` 中的 `thing` 是一个东西，我知道这显而易见，但如果我改成下面这样呢？

```javascript
const module = await import('./module.js');
const { thing: destructuredThing } = await import('./module.js');
```

​	在现在这个例子中，`module.thing` 和 `./module.js` 中的 `thing` 是一样的，而 `destructuredThing` 是一个完全新的且被赋值为 `thing` 的值的标识符，这就和前面的情况表现得有些不同了。

​	假设 `./module.js` 是这样的：

```javascript
// module.js
export let thing = 'initial';

setTimeout(() => {
  thing = 'changed';
}, 500);
```

​	`./main.js` 是这样的：

```javascript
// main.js
import { thing as importedThing } from './module.js';
const module = await import('./module.js');
let { thing } = await import('./module.js');

setTimeout(() => {
  console.log(importedThing); // 'changed'
  console.log(module.thing); // 'changed'
  console.log(thing); // 'initial'
}, 1000);
```

​	正如我们标题写到的，Imports 是“动态绑定”，可以大致理解为别的语言中的“引用”。这意味着当一个不同的值被赋给 `module.js` 中的 `thing` 时，这个改变理所当然地会反应在 `.main.js` 中。被解构的这个 import 没有“发现”这个改变，因为解构并赋值的操作过后，thing 得到的是一个当前值（而不是引用）。

​	这个结构导致的结果并不仅限于 imports，想想我们平时在写普通的 JS 代码时，有如下操作：

```javascript
const obj = { foo: 'bar' };

// This is shorthand for:
// let foo = obj.foo;
let { foo } = obj;

obj.foo = 'hello';
console.log(foo); // 依旧打印 'bar'
```

​	上面的结果看起来非常自然。这里一个可能存在混淆错误（P.S.*原文，这里的单词是 gotcha，其中一个意思为：计算机编程中一个意想不到或者不能直观表现出来的错误，这里本人将其译为 混淆错误*）的点在于，命名的静态导入（如`import { thing } ...`）看起来很像 JS 中的解构，但它们实际上表现出来的结果却不像。

​	好了，这里稍微总结一下我们上面所说到的知识点：

```javascript
// 以下这些操作会给你一个 被导出东西的引用
import { thing } from './module.js';
import { thing as otherName } from './module.js';
import * as module from './module.js';
const module = await import('./module.js');

// 以下这些操作将 值 赋给一个 新的变量标识符（而非引用）
let { thing } = await import('./module.js');
```

## export default 表现得不同

​	以下是 `./module.js` 的内容：

```javascript
// module.js
let thing = 'initial';

export { thing };
export default thing;

setTimeout(() => {
  thing = 'changed';
}, 500);
```

​	`./main.js` 是这样的：

```javascript
// main.js
import {thing, default as defaultThing } from './module.js';
import anotherDefaultThing from './module.js';

setTimeout(() => {
  console.log(thing); // 'changed'
  console.log(defaultThing); // 'initial'
  console.log(anotherDefaultThing); // 'initial'
}, 1000);
```

​	怎么下面两个还是 `initial`！（恼

### 但...，为什么呢?

​	首先，你可以直接 `export default` 一个值：

```javascript
export default 'hello!';
```

​	但你不能像对具名导出做这样的事：

```javascript
// 下面的代码不可行
export { 'hello!' as thing };
```

​	为了使得 `export default 'hello!'` 变得可行，标准为 `export default thing` 赋予其与 `export thing` 不同的语义。`export default` 后面跟的一小串代码被当作是表达式，这使得像 `export default 'hello!'` 和 `export default 1 + 2` 的代码可行。这对于 `export default thing` 也是“适用“的，但正如我们上面说的，因为 `thing` 被视作一个表达式，这就会导致 `thing` 是基于值传递的（而不是引用）。就好像它在被导出前被赋值到了一个”隐藏起来“的变量上一样，正因如此，当 `thing` 在 `setTimeout` 中被赋值另一个值时，这个变化并不能反映到这个被导出的”隐藏的变量“上。

​	所以：

```javascript
// 以下这些操作会给你一个 被导出东西的引用
import { thing } from './module.js';
import { thing as otherName } from './module.js';
import * as module from './module.js';
const module = await import('./module.js');

// 以下这些操作将 值 赋给一个 新的变量标识符（而非引用）
let { thing } = await import('./module.js');

// 以下这些操作会导出一个引用
export { thing };
export { thing as otherName };

// 以下这些操作会导出值，而非引用
export default thing;
export default 'hello!';
```

## export { thing as default } 表现也不同

​	你不能使用 `export {}` 来直接导出值，因为它导出一直是一个引用，所以：

```javascript
// module.js
let thing = 'initial';

export { thing, thing as default };

setTimeout(() => {
  thing = 'changed';
}, 500);
```

​	依旧是之前那个 `./main.js`：

```javascript
// main.js
import { thing, default as defaultThing } from './module.js';
import anotherDefaultThing from './module.js';

setTimeout(() => {
  console.log(thing); // 'changed'
  console.log(defaultThing); // 'changed'
  console.log(anotherDefaultThing); // 'changed'
}, 1000);
```

​	不像 `export default thing`，`export { thing as default }` 将 `thing` 作为一个引用导出，所以：

```javascript
// 以下这些操作会给你一个 被导出东西的引用
import { thing } from './module.js';
import { thing as otherName } from './module.js';
import * as module from './module.js';
const module = await import('./module.js');

// 以下这些操作将 值 赋给一个 新的变量标识符（而非引用）
let { thing } = await import('./module.js');

// 以下这些操作会导出一个引用
export { thing };
export { thing as otherName };
export { thing as default };

// 以下这些操作会导出值，而非引用
export default thing;
export default 'hello!';
```

​	有趣么？噢，对了，我们还没结束呢......

## export default function 又是另一个特例

​	我刚刚说过 `export default` 后面跟的一小串代码被视为表达式，但是这个规则存在特例。

​	老样子，下面依旧是 `module.js` 和 `main.js`：

```javascript
// module.js
export default function thing() {}

setTimeout(() => {
  thing = 'changed';
}, 500);
```

```javascript
// main.js
import thing from './module.js';

setTimeout(() => {
  console.log(thing); // 'changed'
}, 1000);
```

​	`main.js` 中会打印 `'changed'`，因为 `export default function` 被给予了特殊的语义；在这个例子中，函数是基于引用传递的，如果我们将 `module.js` 改为：

```javascript
// module.js
function thing() {}

export default thing;

setTimeout(() => {
  thing = 'changed';
}, 500);
```

​	它就不再满足这个特例了，所以它会打印出 `f thing() {}`，即变回基于值传递了。

### 但...，为什么呢？

​	不仅是 `export default function`，`export default class` 也同样被特殊处理了。这是因为当这些语句是表达式时，它们的行为会随之改变：

```javascript
function someFunction() {}
class SomeClass {}

console.log(typeof someFunction); // 'function'
console.log(typeof SomeClass); // 'function'
```

​	但如果我们将 [函数/类] 声明变为表达式：

```javascript
(function someFunction() {});
(class SomeClass {});

console.log(typeof someFunction); // 'undefined'
console.log(typeof SomeClass); // 'undefined'
```

​	`function` 和 `class` 语句在 作用域/块 中创建了一个标识符，而 `function`、`class` 表达式则不会（尽管它们的名字可以在 函数/类 中使用）。

​	所以对于下面的例子：

```javascript
export default function someFunction() {}
console.log(typeof someFunction); // 'function'
```

​	如果 `export default function` 没有被作为特例，那么按之前的说法，这个函数会被作为表达式，然后打印结果就会是 `undefined`。”特例化“函数还可以用来解决一部分的循环引用，我稍后会谈到。

​	总结一下我们目前学到的知识：

```javascript
// 以下这些操作会给你一个 被导出东西的引用
import { thing } from './module.js';
import { thing as otherName } from './module.js';
import * as module from './module.js';
const module = await import('./module.js');

// 以下这些操作将 值 赋给一个 新的变量标识符（而非引用）
let { thing } = await import('./module.js');

// 以下这些操作会导出一个引用
export { thing };
export { thing as otherName };
export { thing as default };
export default function thing() {}

// 以下这些操作会导出值，而非引用
export default thing;
export default 'hello!';
```

​	这好像让 `export default identifier` 变成了独行者。我理解 `export default 'hello!'` 是基于值传递，但上面又有 `export default function` 这种基于引用传递的特例出现，这让我感到是不是也需要有一种 `export default identifier` 的特例。但我猜可能太迟了。

​	我和 Dave Herman 聊了一下，他参与了 JavaScript modules 的涉及。他说早期关于 default exports 的设计是这种形式的：`export default = thing`，这看起来更加清晰明了，即一眼看过去，就可以感觉到 `thing` 是被视为一个表达式的。对于这一点，我完全赞同！

## 那循环引用呢？

​	首先我们需要谈谈 'hoisting'：

### Hoisting(提升)

​	你大概率遇到过下面这种 JavaScript 对函数做的事情：

```javascript
thisWorks();

function thisWorks() {
  console.log('yep, it does');
}
```

​	函数定义本质上是被移动到了文件顶部。且这只发生在函数声明的情况下：

```javascript
// 不可行
assignedFunction();
// 也不可行
new SomeClass();

const assignedFunction = function() {
  console.log('nope');
}
class SomeClass {}
```

​	如果你尝试在赋值操作前提前访问一个 `let`/`const`/`class` 定义的标识符，会报错。

​	这里忘了的小伙伴可以去复习一下 ES6 相关知识~

### var 不同

​	var 当然表现得不同：

```javascript
var foo = 'bar';

function test() {
  console.log(foo);
  var foo = 'hello';
}

test();
```

​	上面代码运行后会打印 `undefined`，因为函数内部的 `var foo` 会被提升到这个函数顶部，但赋值操作却在后面。这看起来像一个错误混淆，也是为什么 ES6 中在类似情况发生时，`let`/`const`/`class` 会抛出错误。

### 循环引用呢？

​	循环引用在 JavaScript 中是被允许的，但是它们会让事情变得混乱，我们应该避免它，举例：

```javascript
// main.js
import { foo } from '.module.js';

foo();

export function hello() {
  console.log('hello');
}
```

```javascript
// module.js
import { hello } from './main.js';

hello();

export function foo() {
  console.log('foo');
}
```

​	这行得通！上面代码运行后会打印 `'hello'` 和 `'foo'`。然而，以上例子能跑成功是因为 hoisting，它使得函数定义跑到调用之前。如果我们将代码改修一下：

```javascript
// main.js
import { foo } from './module.js';

foo();

export const hello = () => console.log('hello');
```

```javascript
// module.js
import { hello } from './main.js';

hello();

export const foo = () => console.log('foo');
```

​	跑失败了，首先 `module.js` 被执行，然后它会尝试在 `hello` 实例化之前访问 `hello`，然后就报错了。

​	让我们使用 `export default` 看看：

```javascript
// main.js
import foo from './module.js';

foo();

function hello() {
  console.log('hello');
}

export default hello;
```

```javascript
// module.js
import hello from './main.js';

hello();

function foo() {
  console.log('foo');
}

export default foo;
```

​	这个例子是 Dominic 给我的，上面的代码会运行失败，因为 `module.js` 中的 `hello` 指向了被 `main.js` 导出的那个“隐藏”的变量，且它是在实例化之前被访问，所以会报错。

​	如果`main.js` 被改为`export { hello as default }` 就不会报错，因为此时会发生函数并基于引用传递。如果 `main.js` 被改为 `export default function hello()`，也不会报错，但这次成功是因为触发了我们上面说的 `export default function` 特例。

​	我猜测这是另一个导致 `export default function` 被特例化的原因；为了保证“提升”按照我们期望进行工作。再次，我依旧感觉 `export default identifier` 为了一致性，也应该作为特例，表现得像 `export default function` 一样。



# 完~🎉
