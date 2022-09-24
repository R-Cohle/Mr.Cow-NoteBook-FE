const obj1 = {
  a: {
    b: 1,
    c: 2,
    d: {
      e: 5,
    },
  },
  b: [1, 3, { a: 2, b: 3 }],
  c: 3,
};
// 实现以下转换 👇
// {
//   'a.b': 1,
//   'a.c': 2,
//   'a.d.e': 5,
//   'b[0]': 1,
//   'b[1]': 3,
//   'b[2].a': 2,
//   'b[2].b': 3
//    c: 3
// }

// 思路：看成对一颗多叉树的 DFS 即可

function flattenObj(obj) {
  const res = {};
  function dfs(item, curPath) {
    // 如果不是对象，直接返回
    if (item == null || typeof item !== 'object') {
      res[curPath] = item;
      return;
    }
    // 是对象，继续往下走
    for (let key in item) {
      if (!item.hasOwnProperty(key)) continue;

      let temp = curPath;

      // 若 item 为 Array，则需要变成类似 x[0] 这种形式
      if (Array.isArray(item)) temp += `[${key}]`;
      else {
        // 若 curPath 为 ''，说明是第一次，前面不需要加 '.'
        if (curPath === '') temp += `${key}`;
        else temp += `.${key}`;
      }

      // 继续 DFS
      dfs(item[key], temp);
    }
  }

  dfs(obj, '');

  return JSON.stringify(res, null, 2);
}

// 测试用例
const obj2 = { a: { b: { c: 1, d: 2 }, e: 3 }, f: { g: 2 } };
const obj3 = {
  a: 1,
  b: [1, 2, { c: true }],
  c: { e: 2, f: 3 },
  g: null,
};

console.log(flattenObj(obj1));
console.log(flattenObj(obj2));
console.log(flattenObj(obj3));
