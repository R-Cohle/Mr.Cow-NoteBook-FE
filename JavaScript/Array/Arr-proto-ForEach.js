/**
 * ⚠ 注意 in 操作符也会看 原型上的，
 * 如果只要自己的属性 就用 Object.hasOwn 或者 Object.prototype.hasOwnProperty
 *
 *
 * forEach 只支持同步代码
 * 原因：forEach 只是简单地执行了回调函数中，即使我们在 callback 中 break 也没用
 *
 * 解决办法：1.用 for...of 2.用 for 循环
 *
 * 想要中断 forEach 怎么办？
 * 1.用 try catch 嗯抛错误再接住
 * 2.用 every 或 some 代替
 *
 */

// 适用于 数组 以及 类数组对象

Array.prototype.forEach = function (callback, thisArg) {
  // 可能会通过 call/apply/bind 的方式调用
  // 那么此时的 this 就有可能为 null or undefined
  if (this == null) {
    throw new TypeError('this is null or not defined');
  }
  // 检查 callback 是否为函数
  if (typeof callback !== 'function') {
    throw new TypeError(`${callback} is not a function`);
  }
  // 将 this 用对象包裹
  const O = Object(this);
  // 将 length 属性向下取整
  const len = O.length >>> 0;
  let k = 0;
  while (k < len) {
    // 只有 k 存在于 O 中再调用
    if (k in O) {
      callback.call(thisArg, O[k], k, O);
    }
    ++k;
  }
};
