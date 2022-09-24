// 二维数组的生成
function gen2dArr(rows, cols) {
  return new Array(rows).fill(0).map(() => new Array(cols).fill(0));
}

// 不使用迭代生成值为 0~99 的数组
const arr1 = Object.keys(new Array(100).fill(undefined));
const arr2 = Array.from(new Array(100).keys());
const arr3 = [...new Array(100).keys()];
