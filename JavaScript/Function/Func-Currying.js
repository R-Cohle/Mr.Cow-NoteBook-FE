function currying(fn) {
  function curried(...args) {
    // 若当前参数的长度 ≥ 形参的长度，直接调用并返回结果
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }

    // 否则返回一个函数，该函数保留了上次的参数
    function curried2(...args2) {
      return curried.apply(this, [...args, ...args2]);
    }

    return curried2;
  }

  return curried;
}
