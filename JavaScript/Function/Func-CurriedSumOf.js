// 实现：求和函数 sum(1, 2)(3, 4)(5).sumOf()

function sum(x, y, z, a, b) {
  sum.total += x + y + z + a + b;
  return sum;
}

sum.total = 0;
sum.sumOf = function () {
  return this.total;
};

const curriedSum = currying(sum);
const res = curriedSum(1, 2)(3, 4)(5).sumOf();
console.log(res); // 15

// 柯里化函数
function currying(func) {
  function curried(...args) {
    if (args.length >= func.length) {
      return func.apply(this, args);
    } else {
      return function (...args2) {
        return curried.apply(this, [...args, ...args2]);
      };
    }
  }
  return curried;
}
