// 判断是否为 Promise 的方式
function isPromise(val) {
  return (
    val !== null &&
    typeof val === 'object' &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  );
}
