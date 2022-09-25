// 判断一个对象是否为空
function isEmpty(obj) {
  if (obj == null) {
    throw new TypeError('obj is null or not defined');
  }

  const ownKeys = Object.getOwnPropertyNames(obj);
  const ownSymKeys = Object.getOwnPropertySymbols(obj);

  return !ownKeys.length && !ownSymKeys.length;
  // 也可以写成 return !!Reflect.ownKeys(obj).length;
  // MDN 文档指出 Reflect.ownKeys 写法就等同于我们上面写的那两个
}
