// compose 函数，在 redux 中间件、webpack loader中都有应用
// 该函数旨在将嵌套执行的方法作为参数平铺

// 像 redux 中间件中，中间件执行顺序是跟传入的顺序相反的
// 但最终组合完毕，并传入 dispatch 后，利用这个新生成的 dispatch
// 派发 action 时的执行顺序跟中间件的传入顺序是一致的

// 因为一个完整的中间件是由三层函数嵌套的，dispatch 只执行最里面一层

// ------------------------------------------------
function compose(...funcs) {
  return funcs.reduce((a, b) => {
    return function (...args) {
      return a(b(...args));
    };
  });
}
// ------------------------------------------------
// 博客解读：https://blog.csdn.net/qdmoment/article/details/92755411
// 例子
// 中间件的标准格式
function middleware(store) {
  return function (next) {
    return function (action) {
      return next(action);
    };
  };
}
// const middlewares = [mid1, mid2, mid3, mid4, mid5, mid6, ...]
// 在 redux 内部会先执行 middlewares.map((middleware) => middleware(store))
// 此时每一个 middleware 就会剩下两层，如下所示
function mid1(next) {
  return function mid1Rf(action) {
    return next(action);
  };
}
// const chain = middlewares.map((middleware) => middleware(store));
// 此时，chain 数组里面保存着一个个两层的函数

// 随后，使用 compose 函数，将这些中间件合成在一起
// const composed = compose(...chain);
// 这里假设 chain 数组为 [fn1, fn2, fn3]
// composed 后变为 function(...args) { return fn1(fn2(fn3(...args))) }

// 最终把 store.dispatch 传入
// 得到
// dispatch = function fn1Rf(action) {
//   return function fn2Rf(action) {
//     return function fn3Rf(action) {
//       // storeDispatch 为我们手动传入的 store.dispatch
//       return storeDispatch(action);
//     };
//   };
// };
