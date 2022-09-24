// 判断一个对象是否为空
function isEmpty(obj) {
  if (obj == null) {
    throw new TypeError('obj is null or not defined');
  }

  const ownKeys = Object.getOwnPropertyNames(obj);
  const ownSymKeys = Object.getOwnPropertySymbols(obj);

  return !ownKeys.length && !ownSymKeys.length;
}
