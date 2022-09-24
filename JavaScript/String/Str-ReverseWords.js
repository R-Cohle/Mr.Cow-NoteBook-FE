/**
 * 1. 给你一个字符串 s ，请你反转字符串中 单词 的顺序
 * 2. 单词 是由非空格字符组成的字符串。s 中使用至少一个空格将字符串中的 单词 分隔开
 * 3. 返回 单词 顺序颠倒且 单词 之间用单个空格连接的结果字符串
 * 4. 注意：输入字符串 s中可能会存在前导空格、尾随空格或者单词间的多个空格，
 *    返回的结果字符串中，单词间应当仅用单个空格分隔，且不包含任何额外的空格
 */

function reverseWords(s) {
  const strArr = Array.from(s);
  removeExtraSpaces(strArr);

  const len = strArr.length;
  reverse(strArr, 0, len - 1);

  let start = 0;
  for (let i = 0; i <= len; ++i) {
    if (strArr[i] === ' ' || i === len) {
      reverse(strArr, start, i - 1);
      start = i + 1;
    }
  }

  return strArr.join('');
}

function reverse(strArr, start, end) {
  for (let i = start, j = end; i < j; ++i, --j) {
    const temp = strArr[i];
    strArr[i] = strArr[j];
    strArr[j] = temp;
  }
}

function removeExtraSpaces(strArr) {
  let s = 0;
  let f = 0;
  const len = strArr.length;

  while (f < len) {
    if (strArr[f] === ' ' && (f === 0 || strArr[f - 1] === ' ')) ++f;
    else strArr[s++] = strArr[f++];
  }

  strArr.length = strArr[s - 1] === ' ' ? s - 1 : s;
}
