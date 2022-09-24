/**
 * 自定义事件总线属于一种观察者模式，包括以下三个角色
 * 1. 发布者（Publisher）：发出事件（Event）
 * 2. 订阅者（Subscriber）：订阅事件（Event），并且会进行响应（Handler）
 * 3. 事件总线（EventBus）：无论是发布者还是订阅者都是通过事件总线作为中台的
 *
 * 可以实现自己的事件总线
 * 事件监听方法 on
 * 事件的取消监听 off
 * 事件的发射方法 emit
 * 只执行一次后就取消 once
 */

class EventBus {
  constructor() {
    // this.eventBus = Object.create(null);
    this.eventBus = {};
  }

  on(eventName, eventCallback, thisArg) {
    this.eventBus[eventName] ??= [];
    this.eventBus[eventName].push({
      eventCallback,
      thisArg,
    });
  }

  off(eventName, eventCallback) {
    const ori = this.eventBus[eventName];
    if (!ori) return;
    const copy = [...ori];
    copy.forEach((hd) => {
      if (hd.eventCallback === eventCallback) {
        const idx = ori.indexOf(hd);
        ori.splice(idx, 1);
      }
    });
    if (!ori.length) delete this.eventBus[eventName];
  }

  emit(eventName, ...payload) {
    // hd --> handler
    if (!this.eventBus[eventName]) return;
    this.eventBus[eventName].forEach((hd) => {
      hd.eventCallback.apply(hd.thisArg, payload);
    });
  }

  once(eventName, eventCallback, thisArg) {
    const _once = (...args) => {
      eventCallback.apply(thisArg, args);
      this.off(eventName, _once);
    };
    this.on(eventName, _once, thisArg);
  }
}

let i = 0;
const handleCallback = function () {
  console.log('handle function ' + ++i + ' time(s)');
  console.log(this.name);
};
const eventBus = new EventBus();

// main.js
eventBus.on('abc', handleCallback, { name: 'xzc' });
eventBus.on('abc', handleCallback, { name: 'xzc' });
eventBus.on('abc', handleCallback, { name: 'xzc' });
eventBus.once('bcd', handleCallback, { name: 'haha' });
// eventBus.on("abc", function () {}, { name: "xzc" });
// eventBus.on("abc", function () {}, { name: "xzc" });
// eventBus.on("abc", function () {}, { name: "xzc" });

// utils.js
eventBus.emit('abc', 123);
eventBus.emit('bcd', 123);

eventBus.off('abc', handleCallback);

eventBus.emit('abc', 123);
eventBus.emit('bcd', 123);
