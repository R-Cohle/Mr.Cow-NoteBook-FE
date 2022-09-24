// 除去字符串头部和尾部的空格
function trimStartAndEnd(strArr) {
  const len = strArr.length;
  let l = 0;
  let r = len - 1;

  while (l <= r && strArr[l] === ' ') ++l;
  while (l <= r && strArr[r] === ' ') --r;

  return strArr.substring(l, r + 1);
}
