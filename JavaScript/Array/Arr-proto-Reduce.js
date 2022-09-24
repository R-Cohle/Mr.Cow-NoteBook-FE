// ⚠ 注意 in 操作符也会看 原型上的，如果只要自己 就用 Object.hasOwn 或者 Object.prototype.hasOwnProperty

Array.prototype.reduce = function (callback, initialValue) {
  // 可能会通过 call/apply/bind 的方式调用
  // 那么此时的 this 就有可能为 null or undefined
  if (this == null) {
    throw new TypeError('this is null or not defined');
  }
  if (typeof callback !== 'function') {
    throw new TypeError(`${callback} is not a function`);
  }
  // 用 对象函数包裹一下 this
  const O = Object(this);
  // 将 length 属性向下取整
  const len = O.length >>> 0;
  let k = 0;

  let accumulator = initialValue;
  // 若第二个参数为 undefined
  // 则去找数组 第一个有效值 作为累加器的初始值
  if (accumulator === undefined) {
    while (k < len && !(k in O)) ++k;
    // 找不到直接抛出错误
    if (k >= len) {
      throw new TypeError('Reduce of empty array with no initial value');
    }
    accumulator = O[k++];
  }

  while (k < len) {
    if (k in O) {
      accumulator = callback.call(undefined, accumulator, O[k], k, O);
    }
    ++k;
  }

  return accumulator;
};
