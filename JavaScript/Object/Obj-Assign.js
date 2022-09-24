const hasOwnProperty = Object.prototype.hasOwnProperty;
// 二者都是浅拷贝
// 扩展操作符(...)，它不复制继承的属性或类的属性，但它会复制 symbol 属性
// Object.assign 方法接收的第一个参数作为目标对象，后面的所有参数作为源对象
Object.defineProperty(Object, 'assign', {
  value: function (target, ...args) {
    if (target == null) {
      return new TypeError('Cannot convert undefined or null to object');
    }
    const to = Object(target);
    args.forEach((nextSource) => {
      for (let nextKey in nextSource) {
        if (hasOwnProperty.call(nextSource, nextKey)) {
          to[nextKey] = nextSource[nextKey];
        }
      }
    });
    return to;
  },
});

Object.assign = function (target, ...args) {
  if (target == null) {
    return new TypeError('Cannot convert undefined or null to object');
  }
  const to = Object(target);
  args.forEach((nextSource) => {
    for (let key in nextSource) {
      if (hasOwnProperty.call(nextSource, key)) {
        to[key] = nextSource[key];
      }
    }
  });
  return to;
};
