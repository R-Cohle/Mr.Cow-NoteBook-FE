// 它通过使用立即 resolve 的 promise 创建一个微任务（microtask），
// 如果无法创建 promise，则回落（fallback）到使用setTimeout()。
window.queueMicrotask = function (callback) {
  Promise.resolve()
    .then(callback)
    .catch((e) =>
      setTimeout(() => {
        throw e;
      })
    );
};
