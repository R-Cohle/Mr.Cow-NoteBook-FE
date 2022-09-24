// ⚠ 注意 in 操作符也会看 原型上的，如果只要自己 就用 Object.hasOwn 或者 Object.prototype.hasOwnProperty

// 无法中断，若有需要，可用 every 或 some 替代
Array.prototype.map = function (callback, thisArg) {
  // 可能会通过 call/apply/bind 的方式调用
  // 那么此时的 this 就有可能为 null or undefined
  if (this == null) {
    throw new TypeError('this is null or not defined');
  }
  // 检查 callback 是否为函数
  if (typeof callback !== 'function') {
    throw new TypeError(`${callback} is not a functino`);
  }
  // map 会返回一个新数组
  const res = [];
  // 用 对象函数包裹一下 this
  const O = Object(this);
  // 将 length 属性向下取整
  const len = O.length >>> 0;
  let k = 0;
  while (k < len) {
    // 只有 k 存在于 O 中再调用
    if (k in O) {
      res[k] = callback.call(thisArg, O[k], k, O);
    }
    ++k;
  }
  return res;
};
