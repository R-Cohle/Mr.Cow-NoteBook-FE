const timeout = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      const random = Math.random();
      if (random > 0.7) resolve('请求成功');
      else {
        console.log('失败了，即将重新发起请求');
        reject('请求失败');
      }
    }, 2000);
  });

function retry(timeoutFn, times, delay) {
  return new Promise((resolve, reject) => {
    function attempt() {
      timeoutFn().then(resolve, (reason) => {
        console.log(`还有 ${times} 次尝试机会`);
        if (!times) reject(reason);
        else {
          --times;
          setTimeout(attempt, delay);
        }
      });
    }
    attempt();
  });
}

retry(timeout, 3, 1000).then(console.log, console.log);
