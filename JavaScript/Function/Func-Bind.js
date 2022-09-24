Function.prototype.bind = function (thisArg, ...args) {
  if (typeof this !== 'function') {
    throw Error('Type Error');
  }
  const fn = this;
  thisArg =
    thisArg !== null && thisArg !== undefined ? Object(thisArg) : globalThis;

  return function F(...args1) {
    // 检查是否由 new 调用
    // new 的优先级比 bind 高
    if (this instanceof F) {
      return new fn(...args, ...args1);
    }

    const fnSym = Symbol('function');
    thisArg[fnSym] = fn;

    const res = thisArg[fnSym](...args, ...args1);
    delete thisArg[fnSym];

    return res;
  };
};
