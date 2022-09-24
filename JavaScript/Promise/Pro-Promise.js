/**
 * 缺点：
 * 1.无法取消 Promise，一旦新建它就会立即执行，无法中断
 * 2.不设置回调函数，Promise 内部抛出的错误，不会反应到外部
 * 3.当处于 pending 状态时，无法得知目前进展到哪一个阶段（刚刚开始 or 即将完成）
 */

class MY {
  static PENDING = 'pending';
  static FULFILLED = 'fulfilled';
  static REJECTED = 'rejected';

  constructor(executor) {
    this.status = MY.PENDING;
    this.value = void 0;
    this.callbacks = [];

    try {
      executor(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      this.reject(error);
    }
  }

  // resolve 方法
  resolve(value) {
    if (this.status === MY.PENDING) {
      this.status = MY.FULFILLED;
      this.value = value;
      queueMicrotask(() => {
        this.callbacks.forEach((cb) => {
          cb.onFulfilled(value);
        });
      });
    }
  }

  // reject 方法
  reject(reason) {
    if (this.status === MY.PENDING) {
      this.status = MY.REJECTED;
      this.value = reason;
      queueMicrotask(() => {
        this.callbacks.forEach((cb) => {
          cb.onRejected(reason);
        });
      });
    }
  }

  // then 方法
  then(onFulfilled, onRejected) {
    if (typeof onFulfilled !== 'function') {
      onFulfilled = () => this.value;
    }
    if (typeof onRejected !== 'function')
      onRejected = (e) => {
        throw Error(e);
      };

    let promise = new MY((resolve, reject) => {
      if (this.status === MY.PENDING) {
        this.callbacks.push({
          onFulfilled: (value) => {
            try {
              let x = onFulfilled(value);
              // onFulfilled函数返回一个Promise，则将这个
              // Promise调用then，并生成一个microtask，放入任务队列中
              // 对应 V8 源码中的 NewPromiseResolveThenableJobTask
              if (x instanceof MY) {
                queueMicrotask(() => {
                  x.then(resolve, reject);
                });
              } else {
                resolve(x);
              }
            } catch (error) {
              reject(error);
            }
          },
          onRejected: (value) => {
            try {
              let x = onRejected(value);
              if (x instanceof MY) {
                queueMicrotask(() => {
                  x.then(resolve, reject);
                });
              } else {
                resolve(x);
              }
            } catch (error) {
              reject(error);
            }
          },
        });
      }

      if (this.status === MY.FULFILLED) {
        queueMicrotask(() => {
          try {
            let x = onFulfilled(this.value);
            if (x instanceof MY) {
              queueMicrotask(() => {
                x.then(resolve, reject);
              });
            } else resolve(x);
          } catch (error) {
            reject(error);
          }
        });
      }

      if (this.status === MY.REJECTED) {
        queueMicrotask(() => {
          try {
            let x = onRejected(this.value);
            if (x instanceof MY) {
              queueMicrotask(() => {
                x.then(resolve, reject);
              });
            } else resolve(x);
          } catch (error) {
            reject(error);
          }
        });
      }
    });

    return promise;
  }

  // catch 方法
  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  // finally 方法
  finally(onFinal) {
    return this.then(
      (value) => {
        return MY.resolve(onFinal()).then(() => value);
      },
      (err) => {
        return MY.resolve(onFinal()).then(() => {
          throw err;
        });
      }
    );
  }

  // 静态方法 resolve
  /**
   * Promise.resolve("foo")
   * 等价于
   * new Promise(resolve => resolve("foo"))
   */

  /**
   * 参数分为四种情况
   * 1.参数为 Promise 实例
   * 动作：不做任何修改、原封不动地返回这个实例
   *
   * 2.参数为一个 thenable 对象
   * 动作：将这个对象转为 Promise 对象，然后立即执行 thenable 对象的 then() 方法
   *
   * 3.参数不是具有 then() 方法的对象，或根本就不是对象
   * 动作：Promise.resolve() 返回一个新的 Promise 对象，状态为 resolved
   *
   * 4.不带任何参数
   * 动作：直接返回一个 resolved 状态的 Promise 对象
   *
   * 🔔 注意：立即 resolve() 的 Promise 对象，
   * 是在本轮“事件循环” 的结束时执行，而不是在下一轮“事件循环”的开始时
   */

  static resolve(value) {
    return new MY((resolve, _) => {
      if (value instanceof MY) return value;
      else resolve(value);
    });
  }

  // 静态方法 reject
  // 参数不管是什么，都会原封不动地作为 reject 的理由，变成后续方法的参数
  static reject(reason) {
    // reason 是一个普通值，会作为下一次 catch 的结果
    // reason 是一个 Promise，不会做任何处理和解析，和普通值一样
    return new MY((_, reject) => {
      reject(reason);
    });
  }

  // 静态方法 all
  static all(iterable) {
    const len = iterable.length;
    if (!len) return MY.resolve(iterable);
    const res = new Array(len);
    let count = 0;
    return new MY((resolve, reject) => {
      iterable.forEach((item, index) => {
        MY.resolve(item).then((value) => {
          res[index] = value;
          if (++count === len) resolve(res);
        }, reject);
      });
    });
  }

  // 静态方法 race
  static race(iterable) {
    return new MY((resolve, reject) => {
      iterable.forEach((item) => {
        MY.resolve(item).then(resolve, reject);
      });
    });
  }

  // 静态方法 allSettled
  static allSettled(iterable) {
    const len = iterable.length;
    if (!len) return MY.resolve(iterable);
    const res = new Array(len);
    let count = 0;
    return new MY((resolve, _) => {
      iterable.forEach((item, index) => {
        MY.resolve(item).then(
          (value) => {
            res[index] = { status: 'fulfilled', value };
            if (++count === len) resolve(res);
          },
          (reason) => {
            res[index] = { status: 'rejected', reason };
            if (++count === len) resolve(res);
          }
        );
      });
    });
  }

  // 静态方法 any
  static any(iterable) {
    const len = iterable.length;
    if (!len)
      return MY.reject(new AggregateError('All promises were rejected'));
    const res = new Array(len);
    let count = 0;
    return new MY((resolve, reject) => {
      iterable.forEach((item, index) => {
        MY.resolve(item).then(resolve, (reason) => {
          res[index] = reason;
          if (++count === len) {
            reject(new AggregateError(res, 'All promises were rejected'));
          }
        });
      });
    });
  }
}
