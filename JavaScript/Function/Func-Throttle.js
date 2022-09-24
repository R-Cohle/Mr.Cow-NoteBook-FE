/**
 * 在简版的 throttle 函数中
 * '第一次' 必然会被调用
 * 因为根据我们书写的代码，remainTime 一定满足 ≤ 0
 * 故我们需要给予函数调用者选择，是否需要这个功能
 *
 * 因此，我们提供两个选项
 * leading：'第一次' 是否直接调用
 * trailing：'最后一次' 是否调用（即使时间不到）
 *
 */

// 完整版
function throttle(fn, interval, options = { leading: false, trailing: false }) {
  let lastTime = 0;
  let timer = null;
  const { leading, trailing } = options;
  function _throttle(...args) {
    // const nowTime = +new Date(); 效果相同
    const nowTime = new Date().getTime();

    // 若 leading 为 false，且为 '首次' 调用
    // 就将 nowTime 赋值给 lastTime，
    // 这样 remainTime就会是正数了，第一次就不会触发了
    if (!leading && !lastTime) lastTime = nowTime;

    // 计算 [剩余时间]
    const remainTime = interval - (nowTime - lastTime);

    // 若 [剩余时间] 小于等于 0，说明到了，该执行传入的 函数fn 了
    if (remainTime <= 0) {
      // 如果有 timer，我们不想执行两次，故取消掉这个 timer
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }

      fn.apply(this, args);
      lastTime = nowTime;

      // 不走下面，直接 return
      return;
    }

    // 若 trailing 为 true，且 timer 不存在
    if (trailing && !timer) {
      timer = setTimeout(() => {
        timer = null;
        fn.apply(this, args);
        // 这里 lastTime 赋值有讲究
        // 若 leading 为 false，即调用者选择了 '第一次' 不要调用
        // 故我们给它赋值为 0，与原来一样
        lastTime = !leading ? 0 : new Date().getTime();
      }, remainTime);
    }
  }

  // 取消函数
  _throttle.cancel = function () {
    if (timer) clearTimeout(timer);
    timer = null;
    lastTime = 0;
  };
}

// 简版（没有 options 选项）
function Throttle(fn, interval) {
  let lastTime = 0;

  function _throttle(...args) {
    const nowTime = new Date().getTime();
    const remainTime = interval - (nowTime - lastTime);
    if (remainTime <= 0) {
      fn.apply(this, args);
      lastTime = nowTime;
    }
  }

  return _throttle;
}
