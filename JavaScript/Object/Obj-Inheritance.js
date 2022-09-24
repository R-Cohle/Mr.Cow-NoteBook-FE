/**
 * 💚1.原型链继承
 * 问题1：原型中包含的引用类型，将被所有实例共享
 * 问题2：子类在实例化时，不能给父类构造函数传参
 */
function SuperType() {
  this.type = 'superType';
}
function SubType() {
  this.type = 'subType';
}
SubType.prototype = new SuperType();
var sub = new SubType();

/**
 * 💚2.盗用构造函数继承
 * 优点：可在子类构造函数中向父类构造函数传参
 * 缺点：必须在构造函数中定义方法，子类不能访问父类原型上定义的方法
 */
function SuperType() {
  this.type = 'superType';
}
function SubType() {
  SuperType.call(this);
  this.type = 'subType';
}

/**
 * 💚3.组合继承（原型链 + 盗用构造函数）
 * 原型链：继承原型上的属性和方法
 * 盗用构造函数： 继承实例属性
 */
function SuperType() {
  this.type = 'superType';
}
function SubType() {
  SuperType.call(this);
  this.type = 'subType';
}
SubType.prototype = new SuperType();

/**
 * 💚4.原型式继承
 * 类似于 ES5 新增的 Object.create() 方法
 * 适合不需要单独创建构造函数的场景
 */
function object(o) {
  function F() {}
  F.prototype = o;
  return new F();
}

/**
 * 💚5.寄生式继承
 * 创建一个实现继承的函数，以某种方式增强对象，然后返回这个对象
 * 通过寄生式继承给对象添加函数，会导致函数难以重用
 */
function object(o) {
  function F() {}
  F.prototype = o;
  return new F();
}
function createAnother(original) {
  let cloneObj = object(original);
  cloneObj.method = () => {};
  cloneObj.age = 25;
  return cloneObj;
}

/**
 * 💚6.寄生组合式继承
 * 组合继承存在问题，即 父类构造函数 会被调用两次
 * 寄生组合式继承：通过盗用构造函数继承属性 + 使用混合式原型链继承方法
 */
function object(o) {
  function F() {}
  F.prototype = o;
  return new F();
}
function inheritPrototype(subType, superType) {
  let prototype = object(superType.prototype);
  subType.prototype = prototype;
  prototype.constructor = subType;
}
// 上面的 object 方法可以用 Object.create 替代
function inheritPrototype(subType, superType) {
  let prototype = Object.create(superType.constructor);
  subType.prototype = prototype;
  prototype.constructor = subType;
}
