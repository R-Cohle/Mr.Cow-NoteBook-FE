function asyncToGenerator(generatorFn) {
  return function (...args) {
    const gen = generatorFn.apply(this, args);
    return new Promise((resolve, reject) => {
      function step(key, arg) {
        let genResult;
        try {
          genResult = gen[key](arg);
        } catch (error) {
          return reject(error);
        }
        const { value, done } = genResult;
        if (done) {
          return resolve(value);
        } else {
          return Promise.resolve(value).then(
            (val) => step('next', val),
            (err) => step('throw', err)
          );
        }
      }
      step('next');
    });
  };
}
const timeout = (i) =>
  new Promise((resolve, reject) => setTimeout(() => reject(i), i));

function* test() {
  const data1 = yield timeout(1000);
  console.log(`data1: ${data1}`);
  const data2 = yield timeout(2000);
  console.log(`data2: ${data2}`);
  return 'success';
}

const gen = asyncToGenerator(test);
gen().then(console.log).catch(console.log);
