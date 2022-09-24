function debounce(fn, delay, immediate = false) {
  // 初始化
  let timer = null;
  let isInvoked = false;

  function _debounce(...args) {
    // 若此时存在 timer，则取消掉它
    if (timer) clearTimeout(timer);

    // 若传入的 immediate 为 true，意味着第一次是需要直接触发的
    // 这里再配合一个 isInvoked 标志变量，以免每次都触发
    if (immediate && !isInvoked) {
      fn.apply(this, args);
      isInvoked = true;
    } else {
      timer = setTimeout(() => {
        fn.apply(this, args);
        isInvoked = false;
        timer = null;
      }, delay);
    }
  }

  // 取消函数
  _debounce.cancel = function () {
    if (timer) clearTimeout(timer);
    timer = null;
    isInvoked = false;
  };

  return _debounce;
}
