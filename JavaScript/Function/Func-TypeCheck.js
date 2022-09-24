function typeCheck(val) {
  if (val === null) return 'null';

  // if (typeof val === 'number' && isNaN(val)) return 'NaN';
  // 注意，isNaN 会尝试把参数转化为 Number 再判断
  // 而 Number.isNaN 不会做转换
  if (Number.isNaN(val)) return 'NaN'; // 上面与这一句等效

  if (typeof val !== 'object') return typeof val;

  return val.constructor.name;
}

// 可以测试一下结果
console.log(typeCheck('1'));
console.log(typeCheck(1));
console.log(typeCheck(false));
console.log(typeCheck(Symbol('xzc')));
console.log(typeCheck(null));
console.log(typeCheck(undefined));
console.log(typeCheck([]));
console.log(typeCheck({}));
console.log(typeCheck(function () {}));
console.log(typeCheck(BigInt(10)));
console.log(typeCheck(NaN));
console.log(typeCheck(new Date()));
console.log(typeCheck(new Error()));
console.log(typeCheck(new RegExp()));
console.log(typeCheck(new Set()));
console.log(typeCheck(new Map()));
console.log(typeCheck(new WeakMap()));
console.log(typeCheck(new WeakSet()));
class Person {}
console.log(typeCheck(new Person()));
