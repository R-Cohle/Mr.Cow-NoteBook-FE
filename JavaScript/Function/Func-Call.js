Function.prototype.call = function (thisArg, ...argArray) {
  const fn = this;
  thisArg =
    thisArg !== null && thisArg !== undefined ? Object(thisArg) : globalThis;

  const fnSym = Symbol('function');
  thisArg[fnSym] = fn;

  const res = thisArg[fnSym](...argArray);
  delete thisArg[fnSym];

  return res;
};
