// 实现函数使得将str字符串中的{}内的变量替换，如果属性不存在保持原样（比如{a.d}）
var a = {
  b: {
    z: "--HELLO--",
  },
  c: "456",
  e: "789",
};
var str = `a{a.b.z}aa{a.c}aa {a.d}aaaa`;
// => 'a--HELLO--aa456aa {a.d}aaaa'

function stringParsing(str, obj) {
  let res = "";
  let temp = "";
  let flag = false;
  for (let char of str) {
    if (char === "{") {
      flag = true;
      continue;
    }
    if (char === "}") {
      res += trans(temp, obj);
      temp = "";
      flag = false;
      continue;
    }
    if (flag) temp += char;
    else res += char;
  }
  return res;
}

function trans(str, obj) {
  const keys = str.split(".").slice(1);
  let o = obj;
  for (let key of keys) {
    if (o[key] === undefined) return `{${str}}`;
    else o = o[key];
  }
  return o;
}

console.log(stringParsing(str, a));
