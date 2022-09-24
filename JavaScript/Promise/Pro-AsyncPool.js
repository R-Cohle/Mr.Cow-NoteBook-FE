// async-pool 库
// 💨原 repo 地址：https://github.com/rxaviers/async-pool

// 下列写法非本人创造
// ES7
async function asyncPool1(poolLimit, iterable, iteratorFn) {
  const res = [];
  const executing = new Set();

  for (const item of iterable) {
    const p = Promise.resolve().then(() => iteratorFn(item, iterable));

    res.push(p), executing.add(p);

    const clean = () => executing.delete(p);
    p.then(clean).catch(clean);

    if (executing.size >= poolLimit) {
      await Promise.race(executing);
    }
  }
  return Promise.all(res);
}

// ES6
function asyncPool2(poolLimit, iterable, iteratorFn) {
  let i = 0;
  const res = [];
  const executing = new Set();

  const enqueue = function () {
    if (i === iterable.length) return Promise.resolve();
    const item = iterable[i++];
    const p = Promise.resolve().then(() => iteratorFn(item, iterable));

    res.push(p), executing.add(p);

    const clean = () => executing.delete(p);
    p.then(clean).catch(clean);

    let r = Promise.resolve();
    if (executing.size >= poolLimit) r = Promise.race(executing);

    return r.then(() => enqueue());
  };

  return enqueue().then(() => Promise.all(res));
}

// TEST
const timeout = (i) =>
  new Promise((resolve) => setTimeout(() => resolve(i), i));

async function foo() {
  console.time();
  await asyncPool1(1, [1000, 1000, 1000, 1000], timeout);
  console.timeEnd();
}
foo();
