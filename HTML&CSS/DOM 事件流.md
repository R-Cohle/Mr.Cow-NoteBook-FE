# DOM 事件流

## DOM 事件流阶段

​	DOM 事件流（event flow）存在三个阶段：**事件捕获阶段、处于目标阶段、事件冒泡阶段**

> **事件捕获阶段**：简单理解就是，当鼠标点击或触发了 DOM 事件，浏览器会从根节点开始由外到内进行事件传播。即点击了子元素，若父元素通过事件捕获的方式注册了对应事件的话，会先触发父元素绑定的事件（从 window 对象传导到目标节点，上层传到底层）
>
> **目标阶段**：在目标节点上触发，称为“目标阶段”
>
> **冒泡阶段**：与事件捕获恰恰相反，事件冒泡顺序是由内到外进行事件传播，直到根节点（从目标节点传导回 window 对象，底层传回上层）

​	那浏览器到底遵循的是哪一个原则，捕获还是冒泡？

​	这里就得提一下这两个概念分别由哪个公司提出的了。网景公司最先提出了事件捕获的概念，后来微软公司则提出了事件冒泡的概念，对于不同的浏览器，实现没有统一标准，后来，为了统一，标准就折中采用如下标准——先捕获再冒泡。

​	即 DOM 标准事件流的触发先后顺序为：先捕获再冒泡，当触发 DOM 时，会先进行事件捕获，捕获到事件源之后通过事件传播进行事件冒泡。

## DOM 事件等级

​	DOM 级别一共可以分为 4 个级别：DOM0 级、DOM1 级、DOM2 级、DOM3 级。

​	而与 DOM 事件相关的则是 DOM0、DOM2 以及 DOM3 级事件处理，因为 DOM1 级中没有事件相关的内容，故没有 DOM1 级事件。

```javascript
// 假设我们 html 中有个 id 为 'btn' 的按钮

// 💖 DOM0 级事件
const btn = document.getElementById('btn');
btn.onclick = function() {
  console.log('button clicked');
}

/**
 * DOM0 级事件处理程序的缺点在于，一个处理程序无法同时绑定多个处理函数
 * 解绑处理：通过 btn.onclick = null 来解绑事件
 */

// --------------分割线--------------

// 💖 DOM2 级事件
const btn1 = document.getElementById('btn');
function sayHi(name) { console.log(`hi there, i'm ${name}`); }
function sayBye(name) { console.log(`bye ${name}, see u next time`); }
btn1.addEventListener('click', sayHi, false);
btn1.addEventListener('click', sayBye, true);
btn1.removeEventListener('click', sayHi);
btn1.removeEventListener('click', sayBye);
/**
 * 与 DOM0 级事件不同，DOM2 级事件处理，可以同时绑定多个事件处理函数
 * 通过 removeEventListener 解绑事件，参数为 处理函数
 * 
 * API: addEventListener(event, listener, useCapture)
 * 该 api 有三个参数，分别为
 * event（需要绑定的事件，如 click，注意小写且不带 on）
 * listener（触发事件后要执行的函数）
 * useCapture（默认值为 false，表示在事件冒泡阶段调用事件处理函数，若为 true，则捕获阶段）
 * 
 * 第三个参数也可以为一个对象（option）
 * 属性分别为：
 * capture: Boolean，表示是否使用捕获
 * once: Boolean，表示回调是否只执行一次，若是，则 listener 会在被调用后移除
 * passive: Boolean，设为 true 时，表示 listener 永远不会调用 preventDefault()
 *
 * passive 属性的作用在于有助于滚屏性能的提升，passive 为 false 时，引入了
 * “处理某些 touch 事件的事件监听器 在尝试处理滚动时 阻止浏览器主线程的 可能性”
 * 从而导致滚动处理期间性能可能大大降低的情况
 * 这里感兴趣的话，可以看看这篇博客🔗
 * https://developer.chrome.com/blog/passive-event-listeners/
 *
 * 简单解释就是：浏览器并不直到一个 touch event listener 是否会取消滚动，所以浏览器
 * 会在滚动之前会等待 touch event listener 完成
 * 将 passive 设为 true 表示，告诉浏览器我这个 listener 永远不会取消 scroll
 * 告诉浏览器说，你就放心吧，这使得浏览器直接处理滚动，而不是等待 listener 结束。
 *
 */

// --------------分割线--------------

/**
 * 💖 DOM3 级事件
 * 
 * DOM3 级事件是在 DOM2 级事件的基础上添加很多事件类型
 * UI事件：当用户与页面上的元素交互时触发，如：load、scroll
 * 焦点事件：当元素获得或失去焦点时触发，如：blur、focus
 * 鼠标事件：当用户通过鼠标在页面执行操作时触发，如：mousedown、mousemove
 * 滚轮事件：当使用鼠标滚轮或类似设备时触发，如：mousewheel
 * 文本事件：当用户在文档中输入文本时触发，如：textInput
 * 键盘事件：当用户通过键盘在页面上执行操作时触发，如：keyup、keydown
 * 合成事件：当输入法输入字符或变化时触发，如：compositionstart
 * 变动事件：当底层 DOM 结构发生变化时触发，如：DOMsubtreeModified
 *
 * 此外，DOM3 级事件也允许我们开发者自定义事件，使用 new Event()
 *
 */
```

# 事件委托

​	事件委托也叫事件代理，事件委托就是利用事件冒泡，只指定一个事件处理程序，就可以管理某一类的所有事件。这里举一个例子，拿外卖的例子（假设一群人，它们都点了同一家外卖，预计在一段时间后送达某一地点，这里有两种方式，一是每个人都下楼去取各自的外卖，另一种方式就是指定其中一个人一起拿回来）。

​	这里应用到 DOM 中也是一样的，假设我们有一个 `ul` 元素，里面又嵌套了 9999 个 `li`，其中每个 `li` 都绑定了相同的 `click` 事件，我们需要通过 for 循环的方式一个一个加，这样不仅性能差，占内存，且无法实现动态绑定事件，如果我们又想加一个 `li` 并绑定事件，就很麻烦。

​	这里用代码演示一下上面我们谈到的情况。

```html
<!-- ul 和 li -->
<ul id='ulEle'>
  <li>A</li>
  <li>B</li>
  <li>C</li>
  <li>D</li>
  <!-- ... -->
</ul>
```

```javascript
// 利用 for 循环为每个 li 绑定点击事件
window.onload = function() {
  const ulEle = document.getElementById('ulEle');
  const liList = document.getElementByTagName('li');
  
  for (let i = 0, len = liList.length; i < len; ++i) {
    liList[i].onclick = function() { console.log('li clicked'); }
  }
}

// 利用事件委托的方式
window.onload = function() {
  const ulEle = document.getElementById('ulEle');
  ulEle.onclick = function() { console.log('li clicked'); }
}
```

​	现在，用事件委托的方式，代码也变得清爽许多。

​	但是，我们这些写，点击了 `ul` 时，也会触发点击事件的，即，我只想在 “li 被点击时” 才触发该怎么做？

​	这里就需要使用 `Event` 对象提供的 `target` 属性了，该属性返回事件的目标节点，称为**事件源**。

​	`target` 就表示当前触发事件的 dom，我们还需要通过 `target` 的 `nodeName` 或 `id` 属性，来书写对应的逻辑。

```javascript
// 根据 target 的 nodeName 就可以只在 li 被点击时触发事件了
window.onload = function() {
  const ulEle = document.getElementById('ulEle');
  ulEle.onclick = function(event) {
    if (event.nodeName.toLowerCase() === 'li') {
      console.log(`li correctly clicked and the content is ${event.innerHTML}`);
    }
  }
}

// 即使添加新节点也可以做到“动态绑定”
```

> P.S. 这里补充一下，event.target 指向触发事件的元素，而 event.currentTarget 则是事件绑定者
>
> 即 event.target 是事件的真正发起者，而 event.currentTarget 是监听事件者
>
> 在上面的例子中，event.target 为被点击的 li，event.currentTarget 为 ul 自身。

​	总结：适合使用事件委托的事件：click、mousedown、mouseup、keydown、keypress...

​	简单来说就是支持事件冒泡的基本都可以使用事件委托，但像 mouseover、mouseout 等虽然支持事件冒泡，但是处理起来较为麻烦，所以一般使用事件委托。

​	此外，像 focus、blur 这些本身不支持事件冒泡的，自然也无法使用事件委托。

​	P.S. 事件委托也不是没有缺点的，其中一个缺点就是较难搞清楚事件真正发生的源头。

# React 中事件相关的知识

​	关于这部分的概念，如果像深入了解的话，可以去看看 [7kms 大佬的关于 React 合成事件的源码解读](https://7kms.github.io/react-illustration-series/main/synthetic-event)

## React 事件代理机制

​	`React` 并不会把所有的处理函数直接绑定在真实的 DOM 节点上，而是把大部分的事件绑定到 DOM 结构的最外层 `document`（从 `React17` 开始，就是放到 `createRoot` 挂载的 DOM 节点上，而不是之前的 `document`，使用一个统一的事件监听器，这个事件监听器维持了一个映射来保存组件内部的事件监听和处理函数。

​	当组件挂载或卸载时，只是在这个统一的事件监听器上插入或删除一些对象。

​	当事件发生时，首先被这个统一的事件监听器处理，然后在映射里找到真正的事件处理函数并调用之。

​	这样做的优点是：简化了事件处理和回收机制。（我们作为开发者，并不需要去关心大部分事件的绑定解除，因为 `React` 内部的事件系统已经帮助我们处理了）

## 与原生事件绑定的区别

​	事件传播与阻止事件传播：对于阻断事件传播 `React` 做了兼容处理，我们只需要调用 `e.preventDefault` 即可。

​	事件类型：`React` 事件类型只是原生事件类型的一个自己，有些事件 `React` 并没有实现，如 `resize`，阻止 `React` 事件冒泡的行为只能用于 `React` 合成事件系统，但是在原生事件中的阻止冒泡行为，却可以阻止 `React` 合成事件的传播。

​	在 `React` 中，我们可以使用 `onClick={}` 或 `onClickCapture={}` 的方式，也可以使用原生事件。



# 完~🎉