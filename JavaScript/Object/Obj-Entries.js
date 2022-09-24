// Object.entries 和 for...in 不同的是
// 后者会把 原型链上 的也遍历了

const hasOwn = Object.prototype.hasOwnProperty;
// ES13(2022) 可以用 Object.hasOwn(instance, prop)
Object.entries = function (obj) {
  if (this == null || obj == null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }
  const res = [];
  for (let key in obj) {
    hasOwn.call(obj, key) && res.push([key, obj[key]]);
  }
  return res;
};
