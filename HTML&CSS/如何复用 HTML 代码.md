# 如何复用 HTML 代码？

> 本人在阅读了原文章并稍作删减及修改后做的笔记
>
> 原文章地址：https://www.freecodecamp.org/news/reusable-html-components-how-to-reuse-a-header-and-footer-on-a-website/
>
> 原作者：Kris Koishigawa

## 引言

​ 假设有这么一个场景，我们正在构建一个网站，这个网站很多个页面都用到了相同的 header 和 footer，一开始可能还好，就几个页面，复制粘贴就完事了，但是，随着页面的不断增加，突然有一天，我们想更改 header 或 footer 的一些布局等等，此时我们就不得不跑到每个文件中修改。

​ 这显然不靠谱。正在我们苦思冥想之际，我们突然想到了要是能把它们抽取成一个组件就好了，就像我们在 Vue、React... 中写组件一样。用纯 HTML 和 JavaScript 能做到吗？在一顿操作后，我们查到了一种叫 Web Components 的东西，这个东西似乎能做到让我们写出能复用的组件。

## 什么是 Web Components

​ 简单来说，Web Components 就是一系列不同技术组合在一起，能让我们创造自定义 HTML 元素的东西。

​ 大致可以分为三类：

- HTML templates：使用 \<template> 元素构建的，只有我们用 JS 让它们追加页面上时才渲染。
- Custom elements：兼容性不错的 JS API，它可以让我们创建新的 DOM 元素，一旦我们利用相应的 API 创建和注册这些自定义元素，我们就可以像写 React 组件一样复用它们了。
- Shadow DOM：一个更小、封装性更强并且与 main DOM 隔离开和独立渲染的 DOM。我们在 Shadow DOM 中写的任何样式、脚本都不会直接影响到 main DOM 的元素。

## HTML templates

​ 第一步：如何使用 HTML templates

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <template id="welcome-msg">
      <h1>Hellow, World!</h1>
      <p>Not gonna show up unless JS wants me to~</p>
    </template>
  </body>
</html>
```

​ 此时我们打卡浏览器，会发现上面的信息并没有出现。

​ 但是，如果我们打开控制台，可以看见它们被解析了，只是没被渲染而已。

​ 为了让我们的 Hello World 展现在屏幕上，我们需要借助一点 JS 代码

```javascript
// index.js
const template = document.getElementById('welcome-msg');
document.body.appendChild(template.content);
```

​ 看来一切都不错，但是现在我们写的 template 是与 HTML 耦合的，如果我们想要改，还是没有避免之前那个问题。

​ 此时我们考虑把它们放到 JS 文件中，只要我们想要用这个组件，就在那里引入 JS 文件即可。

```javascript
// index.js
const template = document.createElement('template');

template.innerHTML = `
	<h1>Hello, World!</h1>
	<p>Not gonna show up unless JS wants me to</p>
`;

document.body.appendChild(template.content);
```

​ 这里只是简单的应用，其实 \<template> 可以配合 \<slot> 来做更多的事情，像改变元素内的内容等。可以到 [MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots#Adding_flexibility_with_slots) 上看看。

## Custom Elements

​ 说完了 HTML templates，还有第二个方法：Custom Elements。

​ 上面那种办法对于位置的插入貌似有点不方便，如果已经有某些内容在页面上了，比如说一个 banner 图片，这时我们上面写的 Hello World 信息就会跑到它下面了，总之就是第一种方案并不是特别方便。

​ 作为 Custom Elements，那当然可以有自己的名字了，我们可以这样使用它：

```html
<welcome-message></welcome-message>
```

​ 想放到页面哪里就放到哪里。

​ 接下来，我们利用 Custom Elements 来创建 header 和 footer 组件

#### 准备工作

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <main>
      <!-- 我们的页面内容 -->
    </main>
  </body>
</html>
```

```css
/* style.css */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
}

body {
  color: #333;
  font-family: sans-serif;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1 0 auto;
}
```

#### 定义并注册 Custom Element

​ 通过继承 HTMLElement 类，当然也可以继承别的，像 HTMLParagraphElement 等。

```javascript
// 定义 Header 组件
class Header extends HTMLElement {
  constructor() {
    super();
  }
}

// 注册 Header 组件
customElement.define('header-component', Header);
```

​ 注册时，第一个参数是 字符串 类型，第二个参数就是我们定义的组件，第三个参数是可选的，该参数描述了我们的自定义组件想要从什么元素那里继承一些属性，比如 `{extends: 'p'}`。

​ 用的时候就是 `<header-component></header-component>` 这样用。

#### 使用生命周期回调将组件追加到页面中

​ 自定义组件自带 4 个特殊的生命周期回调，分别是 `connectedCallback`、`attributeChangeCallback`、`disconnectedCallback`、`adoptedCallback`。

​ 其中，`connectedCallback` 是最常用的一个，它会在每次我们的自定义组件被插入到 DOM 时被调用。

​ 这里我们可以尝试一下：

```javascript
class Header extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
    	<style>
    		.container {
    			display: flex;
    			align-items: center;
    			justify-content: center;
    			height: 40px;
    			background: skyblue;
    		}
    		
    		a {
    			font-weight: 700;
    			text-decoration: none;
    		}
    		
    		a:hover {
    			box-shadow: inset 0 -2px 0 0 #fff;
    		}
    		
    	</style>
    	<header>
    		<div class="container">
    			<div><a href="#">Home</a></div>
    			<div><a href="#">About</a></div>
    			<div><a href="#">Contact</a></div>
    		</div>
    	</header>
    `;
  }
}
```

​ 简单实现了一下，接下来，可以就可以在 index.html 中使用了。

```html
<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <header-component />
    <main>
      <!-- 我们的页面内容 -->
    </main>
  </body>
</html>
```

​ 但是这种方法有一种问题，我们把 style 都写到 innerHTML 中，我们不止复用一个组件，我们可能还有 footer、banner 等等组件，这时，style 就会出现覆盖了。这时就是 Shadow DOM 大展身手的时候了。

## Shadow DOM

​ Shadow DOM 作为一个更小、更独立的实例存在于 main DOM 中。

​ 这里我们把上面的 innerHTML 代码抽取一下，用 ... 表示。

```javascript
// ...
class Header extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: 'closed' });

    // 这里再调用 appendCHild 把 shadowRoot 追加到页面上
    shadowRoot.appendChild(headerTemplate.content);
  }
}

customElements.define('header-component', Header);
```

​ 这里我们在 connectedCallback 生命周期回调中调用了 attachShadow 方法将一个 shadow root 附加到了我们的 header component 中。

​ 注意到上面的 `mode: 'closed'`，这里的意思是我们的 header component 的 shadow DOM 无法被外部的 JavaScript 代码访问。如果我们想要用外部的 JS 访问这个 shadow DOM，把它改成 `mode: 'open'` 即可。

​ 现在就不会出现样式覆盖的问题了，因为 shadow DOM 与 main DOM 是分离的，不会有影响。

​

​ 但是我们就是想要样式呢，比如说我们自己写了一些全局样式，或者引入了一些库，像 Font Awesome 这些，我岂不是用不了了吗？

​ 肯定是可以的，我们可以通过 `:host` 伪类选择器，这可以选择到 host shadow DOM 的元素。

```css
:host {
  all: initial;
  display: block;
}
```

​ 在上面的 CSS 代码中，

​ `all: initial` 设置将所有的 CSS 属性为它们的初始属性

​ `display: block` 则 display 设回浏览器的默认值，`block`。

​

#### 外部样式

​ 刚刚我们谈到了使用 Font Awesome 等库的使用，在样式隔离的情况下，我们应该怎么做才能使用到这些外部 CSS 库呢？

##### #1：直接在 innerHTML 中用 \<link>

```javascript
const headerTemplate = document.createElement('template');

headerTemplate.innerHTML = `
	<link rel="stylesheet" href="这里填cdn地址" crossorgin="anonymous" />
	<style>
		// ...
	</style>
...
```

​ 这里我们不禁思考，我们这么写，如果别的组件也想用这些库，岂不是也要用 `link` 引入，那浏览器不会每次都去请求这个地址吗？

​ 答案是，浏览器并没有我们想象的那么笨，它最终只会请求一次，所以我们可以放心。

##### #2：直接在 innerHTML 中用 @import

```javascript
const headerTemplate = document.createElement('template');

headerTemplate.innerHTML = `
	<style>
		@import url("这里填cdn地址")
		// ...
	</style>
...
```

##### #3：使用 JS 动态地加载

```javascript
// ...
class Header extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    // Query the main DOM for FA
    const fontAwesome = document.querySelector('link[href*="foot-awesome"]');
    const shadowRoot = this.attachShadow({ mode: 'closed' });

    // Conditionally load FA to the component
    if (fontAwesome) {
      shadowRoot.appendChild(fontAwesome.cloneNode());
    }

    shadowRoot.appendChild(headerTemplete.content);
  }
}

customElements.define('header-component', Header);
```

# 完~🎉
