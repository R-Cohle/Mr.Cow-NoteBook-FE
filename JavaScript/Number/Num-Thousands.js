// 实现数字的千分位逗号分割
function thousands(num) {
  const numArr = numToArr(num);
  let cnt = 0;
  let resStr = "";
  for (let len = numArr.length, i = len - 1; i >= 0; --i) {
    if (cnt === 3) {
      resStr = "," + resStr;
      cnt = 0;
    }
    resStr = numArr[i] + resStr;
    ++cnt;
  }
  return resStr;
}

// 数字转数字数组
function numToArr(num) {
  let res = [];
  while (num) {
    res.push(num % 10);
    num = Math.floor(num / 10);
  }
  return res.reverse();
}
console.log(thousands(314159265354));
