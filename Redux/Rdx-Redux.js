// 蒋鹏飞大佬本篇文章掘金地址：https://juejin.cn/post/6845166891682512909
// 大佬的 github 地址：https://github.com/dennis-jiang/Front-End-Knowledges

// 以下为本人看完博客后做的笔记👇
/**
 * 手写 redux 五个核心方法（注意 redux 和 react-redux 不是一个东西）
 * redux只是一个状态机，不涉及 view 层，
 * 而 react-redux 把 redux状态机 和 react的UI呈现 联系到一起
 * 手写
 * 1. createStore
 * 2. combineReducer
 * 3. compose
 * 4. applyMiddleware
 * 5. thunkMiddleware
 */

/**
 * 💖核心，createStore方法
 * 返回值为 store
 * 接受两个参数，第一个参数为 reducer
 * 第二个参数为 enhancer
 */
function createStore(reducer, enhancer) {
  if (enhancer && typeof enhancer === 'function') {
    const newCreateStore = enhancer(createStore);
    const newStore = newCreateStore(reducer);
    return newStore;
  }

  let state = {};
  let listeners = [];

  const subscribe = (callback) => {
    listeners.push(callback);
  };

  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach((cb) => cb());
  };

  const getState = () => state;

  dispatch({});

  const store = {
    subscribe,
    dispatch,
    getState,
  };
  return store;
}

/**
 * 💖实际需求中，我们很有可能需要多个 reducer
 * 此时需要一个 combineReducer 函数将这些 reducer 合并
 * 自动根据传入的 action 判断是否更新对应的 state
 */
function combineReducer(reducerMap) {
  const reducerKeys = Object.keys(reducerMap);
  const reducer = (state = {}, action) => {
    const newState = {};
    reducerKeys.forEach((key) => {
      const currentReducer = reducerMap[key];
      const prevState = state[key];
      newState[key] = currentReducer(prevState, action);
    });
    return newState;
  };
  return reducer;
}

/**
 * 💖实际需求中，很有可能要应用多个中间件
 * 这里需要一个 compose 函数，将所有中间件合并成一个
 * 返回值为一个合并后的函数
 * 该函数接受 dispatch 函数作为参数，最终返回一个加强版的 dispatch
 */
function compose(...funcs) {
  return funcs.reduce((a, b) => {
    return function (...args) {
      return a(b(...args));
    };
  });
}

// 💖应用中间件，强化 store/ dispatch 方法
function applyMiddleware(...middlewares) {
  function enhancer(createStore) {
    function newCreateStore(reducer) {
      const store = createStore(reducer);
      const { dispatch } = store;
      const chain = middlewares.map((middleware) => middleware(store));
      const newDispatchGen = compose(...chain);
      const newDispatch = newDispatchGen(dispatch);
      return { ...store, dispatch: newDispatch };
    }
    return newCreateStore;
  }
  return enhancer;
}

/**
 * 💖thunk 中间件，使得我们可以 dispatch 一个函数，而不仅仅是action对象
 *
 * 因为在实际中，我们需要执行异步操作，在 redux 中，reducer 是纯函数
 * 不能在里面触发异步操作，这样会导致结果不可预测
 * 但由于异步，我们不能立刻调用 dispatch 方法，需要等到异步操作结果返回后
 * 才能 dispatch 相关 action
 *
 * 所以有了 thunk 中间件，它会判断若 action 是一个函数，
 * 则 store 的 dispatch 和 getState 方法作为参数传给 action 并执行它
 * 以便拿到结果后可以 dispatch action
 *
 * 若 action 不是函数，则直接 dispatch即可，
 * 即函数中的那个 next（其本质就是dispatch，只是换了个名字罢了）
 */
function thunkMiddleware(store) {
  return function (next) {
    return function (action) {
      const { dispatch, getState } = store;
      if (typeof action === 'function') {
        return action(dispatch, getState);
      }
      return next(action);
    };
  };
}
