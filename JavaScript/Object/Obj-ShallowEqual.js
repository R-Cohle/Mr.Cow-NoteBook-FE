// Object.is在严格等于的基础上修复了一些特殊情况下的失误
// 就是 +0、-0、NaN 和 NaN
function is(x, y) {
  if (x === y) {
    // === 操作符会将 +0 和 -0 视为一样
    // 运行到 1/x == 1/y 时，x 和 y 均为 0
    // 此时返回 false
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    // NaN === NaN 为 false，这不是我们想要的，这里拦截一下
    // 若 x !== x，则一定为 NaN，y同理
    // 两个都是 NaN 时会返回 true
    return x !== x && y !== y;
  }
}
function shallowEqual(objA, objB) {
  // 相同直接返回 true
  if (Object.is(objA, objB)) return true;
  // Object.is发现不等，但不代表真的不等，需要进一步比较
  // 若不是 object 直接返回 false
  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false;
  }
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  // 长度不一样直接返回 false
  if (keysA.length !== keysB.length) return false;
  for (let i = 0; i < keysA.length; ++i) {
    if (
      // 看看 objB 中是否有 objA 中的 key
      // 然后再判断 key 对应的 value 是否相同

      // 可以使用 ES2022 的 Object.hasOwn(instance, prop)
      !Object.prototype.hasOwnProperty.call(objB, keysA[i]) ||
      !Object.is(objA[keysA[i]], objB[keysA[i]])
    ) {
      return false;
    }
  }
  return true;
}
