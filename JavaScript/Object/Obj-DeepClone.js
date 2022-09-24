/*
  对于被拷贝对象，若其中还涉及引用类型
  若使用 浅拷贝 生成拷贝对象，则会有影响
  若使用 深拷贝 生成拷贝对象，则两个对象不再有任何关系

  1️⃣ 利用 JSON.parse(JSON.stringify(obj))
  存在以下问题：
    1. 会忽略 undefined
    2. 会忽略 symbol
    3. 不能序列化函数
    4. 不能解决循环引用
    5. 会把 NaN 序列化为 null

  2️⃣ 利用 structureClone 
    1. 版本要求较高，chrome98、node17.0
    2. 不支持 function、Symbol (作为 key 和 value 都不行)
    3. 可以解决循环引用
    
  3️⃣ 自己实现
*/

function deepClone(obj, map = new WeakMap()) {
  // 若为 null 或 undefined 直接返回它
  if (obj == null) return obj;

  // 若为 Date 或 RegExp 创建一个新的返回
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);

  // 若为 Map 或 Set 创建并继续递归并返回
  if (obj instanceof Map) {
    const _map = new Map();
    for (const [key, value] of obj) {
      _map.set(key, deepClone(value, map));
    }
    return _map;
  }
  if (obj instanceof Set) {
    const _set = new Set();
    for (const value of obj) {
      _set.add(deepClone(value, map));
    }
    return _set;
  }

  // 若为 symbol，返回一个新的（顺便把 description 复制一下）
  if (typeof obj === 'symbol') return Symbol(obj.description);

  // 若为其他基本类型，直接返回它
  if (typeof obj !== 'object') return obj;

  // 若 map 中有了该对象，则返回，避免循环引用
  if (map.has(obj)) return map.get(obj);

  // 拿到对象原型的 constructor，这么写会自动创建对应的对象如（ [] 或 {} ）
  const cloneObj = new obj.constructor();

  // obj 作为 key，cloneObj 作为 value
  map.set(obj, cloneObj);

  // 开始递归
  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
    cloneObj[key] = deepClone(obj[key], map);
  }

  // 取到 symbol 的 key
  const symbolKeys = Object.getOwnPropertySymbols(obj);
  // 开始递归
  for (const sKey of symbolKeys) {
    cloneObj[sKey] = deepClone(obj[sKey], map);
  }

  // 返回克隆完毕的对象
  return cloneObj;
}

// 测试用例
const obj = {
  a: 1,
  b: 'aab',
  c: function () {},
  d: Symbol('XZC'),
  e: [1, 2, 4, [5, 1]],
  f: { x: 1 },
  [Symbol('haha')]: {
    a: [],
    p: 1,
    v: {
      z: ['swim', 'run', 'fly'],
    },
  },
  g: new Date('2022-07-17'),
  h: Symbol('xzc'),
  i: NaN,
  j: true,
  k: undefined,
  l: null,
  n: new Set([1, 2, 3, 2, 6]),
  o: new Map([
    ['key1', 1],
    ['key2', 2],
    ['key3', { a: 1, b: {} }],
  ]),
};
// 循环引用一下
obj.m = obj;
obj.o.get('key3').c = obj;
console.log(deepClone(obj));
