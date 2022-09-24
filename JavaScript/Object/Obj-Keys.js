const hasOwn = Object.prototype.hasOwnProperty;
// ES13(2022) 可以用 Object.hasOwn(instance, prop)

Object.keys = function (obj) {
  if (this == null || obj == null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }

  const res = []; // 结果数组
  for (let key in obj) {
    hasOwn.call(obj, key) && res.push(key);
  }

  return res;
};
