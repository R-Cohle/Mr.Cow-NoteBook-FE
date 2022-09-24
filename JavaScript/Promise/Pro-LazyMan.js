class LazyMan {
  constructor() {
    this.tasks = [];
    setTimeout(() => {
      this.next();
    }, 0);
  }

  eat(food) {
    this.tasks.push(() => {
      console.log(`eating ${food}`);
      this.next();
    });
    return this;
  }

  sleepFirst(duration) {
    this.tasks.unshift(() => {
      console.log(`Sleep first for ${duration} second(s)`);
      setTimeout(() => {
        this.next();
      }, duration * 1000);
    });
    return this;
  }

  sleep(duration) {
    this.tasks.push(() => {
      console.log(`be back in ${duration} second(s)`);
      setTimeout(() => {
        this.next();
      }, duration * 1000);
    });
    return this;
  }

  next() {
    if (this.tasks.length) {
      this.tasks.shift()();
    }
  }
}

const lazyMan = new LazyMan();
lazyMan.sleep(3).eat('🍟').sleep(2).eat('☕').eat('🥐').sleep(2).sleepFirst(3);
