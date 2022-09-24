// 1. 直接抛出错误

// 2. 使用一个 wrapper 函数，让该 promise 与 一个 timeout 函数竞速
function timeoutWrapper(promise, timeout) {
  const wait = new Promise((_, reject) => {
    setTimeout(() => {
      reject("exceed time limit");
    }, timeout);
  });
  return Promise.race([promise, wait]);
}

const timeout = (i) =>
  new Promise((resolve) => setTimeout(() => resolve(i), i));

timeoutWrapper(timeout(3000), 4000).then(console.log).catch(console.log);
