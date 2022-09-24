function Instanceof(obj, constructor) {
  if (typeof obj !== 'object' || obj === null) return false;

  const prototype = constructor.prototype;
  let proto = Object.getPrototypeOf(obj);

  while (true) {
    if (proto === null) return false;
    if (proto === prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
}
