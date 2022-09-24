/**
 * 函数 myAtoi(string s) 的算法如下：
 * 1. 读入字符串并丢弃无用的前导空格
 * 2. 检查下一个字符（假设还未到字符末尾）为正还是负号，读取该字符（如果有），
 *    确定最终结果是负数还是正数。 如果两者都不存在，则假定结果为正。
 * 3. 读入下一个字符，直到到达下一个非数字字符或到达输入的结尾。字符串的其余部分将被忽略。
 * 4. 将前面步骤读入的这些数字转换为整数（即，"123" -> 123， "0032" -> 32），
 *    如果没有读入数字，则整数为 0 。必要时更改符号（从步骤 2 开始）。
 * 5. 如果整数数超过 32 位有符号整数范围 [−231,  231 − 1] ，需要截断这个整数，
 *    使其保持在这个范围内。具体来说，
 *    小于 −231 的整数应该被固定为 −231 ，大于 231 − 1 的整数应该被固定为 231 − 1 。
 * 6. 返回整数作为最终结果。
 */

function myAtoi(s) {
  const len = s.length;
  if (!len) return 0;
  let k = 0;
  let minus = 1;
  let res = 0;
  const INT_MAX = 2 ** 31 - 1;
  const INT_MIN = -(2 ** 31);

  while (k < len && s[k] === ' ') ++k;

  if (k < len) {
    if (s[k] === '-') {
      minus = -1;
      ++k;
    } else if (s[k] === '+') ++k;
  }

  while (k < len && s[k] >= '0' && s[k] <= '9') {
    res = res * 10 + +s[k];
    if (res > INT_MAX) break;
    ++k;
  }

  res *= minus;
  if (res > INT_MAX) res = INT_MAX;
  if (res < INT_MIN) res = INT_MIN;

  return res;
}
