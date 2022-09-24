/**
 * 什么是类数组对象
 * 即，拥有一个 length 属性和若干索引属性的对象
 * 常见类数组对象有 arguments 和 DOM方法的返回结果
 */
const arrayLike = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
};

// 为什么叫类数组，从读写、获取长度、遍历三个方面看看
// 1.读写
console.log(arrayLike[0]); // a
arrayLike[0] = 'new name';

// 2.获取长度
arrayLike.length;

// 3.可迭代
for (let i = 0, len = arrayLike.length; i < len; ++i) {}

/**
 * 如果想调用数组的方法呢？
 * 得使用 Function.call 间接调用
 * 如 👇
 */
Array.prototype.push.call(arrayLike, 'd');
Array.prototype.join.call(arrayLike, '&');
Array.prototype.slice.call(arrayLike);

// 类数组转数组方法

// 1.slice
Array.prototype.slice.call(arrayLike);
// 2.splice
Array.prototype.splice.call(arrayLike, 0);
// 3.Array.from
Array.from(arrayLike);
// 4.concat
Array.prototype.concat.apply([], arrayLike);

/**
 * Arguments对象
 * Arguments 对象只定义在函数体中，包含了函数的参数和其他属性
 * 在函数体中，arguments 指代该函数的 Arguments 对象
 * Arguments 对象的 length 属性，表示实参的长度
 */

function foo(a, b, c) {
  console.log(`实参的长度为：${arguments.length}`);
  console.log(`形参的长度为：${foo.length}`);
}
foo(1);
// 实参的长度为：1
// 形参的长度为：3

// Arguments 对象的 callee 属性，通过它可以调用函数本身
