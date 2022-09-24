function lodash_get(object, path, defaultVal = 'undefined') {
  let newPath = [];
  if (Array.isArray(path)) {
    newPath = path;
  } else {
    // 将字符串中的 '[' 和 ']' 去掉并替换为 '.'
    // split 分割为数组形式
    newPath = path.replaceAll('[', '.').replaceAll(']', '').split('.');
  }

  return (
    newPath.reduce((o, k) => {
      // console.log(o, k);
      return (o || {})[k];
    }, object) || defaultVal
  );
}
// 测试用例
const object = { a: [{ b: { c: 2 } }] };
const path1 = 'a[0].b.c';
const path2 = ['a', '0', 'b', 'c'];
const path3 = 'a.b.c';
console.log(lodash_get(object, path1, 'nonono'));
console.log(lodash_get(object, path2, 'nonono'));
console.log(lodash_get(object, path3, 'nonono'));
