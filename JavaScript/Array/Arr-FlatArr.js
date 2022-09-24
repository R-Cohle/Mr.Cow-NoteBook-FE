// 简单实现一下 Flat 数组的功能

// Test Data
const data = [
  [1, 2, 2],
  [3, 4, 5, 5],
  [6, 7, 8, 9, [11, 12, [12, 13, [14]]]],
  10,
];

// ❤方法 1：不能指定 [层数]，相当于 flat 到底
function flatArr(arr) {
  const res = []; // 结果数组，用来存储 flat 后的结果

  // 这是一个递归函数
  function rec(items) {
    for (const item of items) {
      // 利用 Array.isArray 判断是否为数组
      // 若是，就继续递归
      if (Array.isArray(item)) rec(item);
      else res.push(item);
    }
  }

  rec(arr);

  // 若想还要想 去重 + 排序
  // 可以 return [...new Set(res)].sort((a, b) => a - b);
  return res;
}

// ❤方法 2：可以指定 [层数]
function flatArrWithDepth(arr, flatDepth = 1) {
  const res = []; // 结果数组

  function rec(items, curDepth) {
    for (const item of items) {
      // 若 [层数] 已经到达 给定层数，就不往下递归了
      if (curDepth === flatDepth) {
        res.push(item);
        continue;
      }

      // 若 item 是 Array，则继续往下递归，反之，加入至结果数组内
      if (Array.isArray(item)) rec(item, curDepth + 1);
      else res.push(item);
    }
  }

  rec(arr, 0);

  return res;
}

// ❤方法 3：可以指定 [层数] 并且 [去重](用 map)
function flatArrWithDepthAndUnique(arr, flatDepth = 1) {
  const res = []; // 结果数组

  // 一般如果只想用来存储东西，可以这么写
  // 但是，该写法性能比直接写对象字面量慢很多
  // 相当于创建出来的这个 map 就是一个纯空的对象，没有原型链之类的东西
  const map = Object.create(null);

  // curDepth表示目前递归的层数
  function rec(items, curDepth) {
    for (const item of items) {
      const flag = map[item]; // 看一下当前的 item 是否已经在 map 中了

      if (flag) continue; // 若在，直接 continue

      // 若 [层数] 已经到达 给定层数，就不往下递归了
      if (curDepth === flatDepth) {
        map[item] = true;
        res.push(item);
        continue; // 别忘了这里
      }

      // 到这里时，[层数]还没到给定层数，需要检查当前 item 是否为 Array
      if (Array.isArray(item)) {
        rec(item, curDepth + 1);
      } else {
        map[item] = true;
        res.push(item);
      }
    }
  }

  rec(arr, 0);

  map = null; // 丢掉这个 map

  return res;
}
