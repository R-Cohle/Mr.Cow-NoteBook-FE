function create(obj) {
  function F() {}
  F.prototype = obj;
  return new F();
}
// 构造函数：丢失原构造函数属性
// 原型链：原构造函数/(对象)本身
// 作用对象：function 和 object
