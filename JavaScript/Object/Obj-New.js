function selfNew(Fn, ...args) {
  if (typeof Fn !== 'function') throw TypeError(Fn + 'is not a constructor');

  const obj = Object.create(Fn.prototype);

  const res = Fn.apply(obj, args);

  return res instanceof Object ? res : obj;
}
// 构造函数：保留原构造函数属性
// 原型链：原构造函数 prototype 属性
// 作用对象：function

// 第一步：创建空对象
// 第二步：将该对象的 proto 连接到构造函数的 prototype 属性
// 第三步：将 this 指向 该对象
// 第四步：执行构造函数
// 第五步：根据上一步的返回值确定最终返回什么，
//    若构造函数自己有返回对象，则最终返回这个对象
//    若没有，则返回[第一步] 中的对象
