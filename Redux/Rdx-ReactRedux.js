// 蒋鹏飞大佬本篇博客：https://juejin.cn/post/6847902222756347911
// 大佬的 github 地址：https://github.com/dennis-jiang/Front-End-Knowledges

// 以下为本人阅读完博客后的笔记👇
// ------------------------------------✅✅✅分割线✅✅✅-------------------------------------

// React-Redux是怎么保证组件的更新顺序的？
// 前面我们的 Counter 组件使用了 connect 连接了 redux store，假如它下面还有个子组件也连接到了 redux store，我们就要考虑它们的回调执行顺序的问题了，我们知道 React 是单向数据流的，参数都是由父组件传给子组件的
// 现在引入了 Redux，即使父组件和子组件都引用了同一个变量，但子组件完全可以不从父组件拿这个参数，而是直接从 Redux拿，这就打破了 React 本来的数据流向
// 在 父->子 这种单向数据流中，如果它们的一个公用变量变化了，肯定是父组件先更新，然后参数传给子组件再更新
// 但在 Redux里，数据变成了 Redux->父，Redux->子
// 父与子完全可以根据 Redux 的数据进行独立更新，而不能完全保证父级先更新，子级再更新的流程
// 所以 React-Redux 花了不少功夫来手动保证这个更新顺序，React-Redux保证这个更新顺序的方案是在 redux store之外，再单独创建一个监听者类 Subscription

// Subscription类描述
// 1.Subscription负责处理所有的 state 变化的回调
// 2.若当前连接 redux 的组件是第一个连接 redux 的组件，也就是说它是连接 redux 的根组件，它的 state 回调直接注册到 redux store；同时新建一个 Subscription 实例 subscription 通过 context 传递给子级
// 3.若当前连接 redux 的组件不是连接 redux 的根组件，也就是说它上面有组件已经注册到 redux store 了，那么它可以拿到上面通过 context 传下来的 subscription，源码中的这个变量叫 parentSub，那当前组件的更新回调就注册到 parentSub 上，同时再新建一个 Subscription 实例，替代 context 上的 subscription，继续往下传，也就是说它的子组件的回调会注册到当前 subscription 上
// 4.当 state 变化了，根组件注册到 redux store上的回调会执行更新根组件，同时根组件需要手动执行子组件的回调，子组件回调执行会触发子组件更新，然后子组件再执行自己subscription上注册的回调，以此类推，这就实现了从根组件开始，一层一层更新子组件的目的，保证了 父->子 这样的更新顺序

class Subscription {
  constructor(store, parentSub) {
    this.store = store;
    this.parentSub = parentSub;
    this.listeners = []; // 源码中 listeners 是用链表实现的，这里简单处理，用数组实现

    this.handleChangeWrapper = this.handleChangeWrapper.bind(this);
  }

  // 子组件注册回调到 Subscription上
  addNestedSub(listener) {
    this.listeners.push(listener);
  }

  // 执行子组件的回调
  notifyNestedSubs() {
    this.listeners.forEach((cb) => cb());
  }

  // 回调函数的包装
  handleChangeWrapper() {
    if (this.onStateChange) {
      this.onStateChange();
    }
  }

  // 注册回调的函数
  // 如果 parentSub 有值，就将回调注册到 parentSub上
  // 如果 parentSub 没值，那当前组件就是根组件，回调注册到 redux store 上
  trySubscribe() {
    this.parentSub
      ? this.parentSub.addNestedSub(this.handleChangeWrapper)
      : this.store.subscribe(this.handleChangeWrapper);
  }
}

// ------------------------------------✅✅✅分割线✅✅✅-------------------------------------
// 改造 Provider：
// 我们之前自己实现的 React-Redux 里面，我们的根组件始终是 Provider，
// 所以 Provider 需要实例化一个 Subscription 并放到 context 上，
// 而且每次 state 更新的时候需要手动调用子组件回调

function Provider(props) {
  const { store, children } = props;

  // 这里是要传递的 context
  // 里面放入 store 和 subscription 实例
  const contextValue = useMemo(() => {
    const subscription = new Subscription(store);
    // 注册回调为通知子组件，这样就可以开始层级通知了
    subscription.onStateChange = subscription.notifyNestedSubs;
    return {
      store,
      subscription,
    };
  }, [store]);

  // 拿到之前的 state 值
  const previousState = useMemo(() => store.getState(), [store]);

  // 每次 contextVal 或 previousState变化的时候
  // 用 notfyNestedSubs通知子组件
  useEffect(() => {
    const { subscription } = contextValue;
    subscription.trySubscribe();
    if (previousState !== store.getState()) {
      subscription.notifyNestedSubs();
    }
  }, [contextValue, previousState]);

  // 返回 ReactReduxContext 包裹的组件，传入 contextValue
  // 里面的内容就直接是 children，不动它
  return (
    <ReactReduxContext.Provider value={contextValue}>
      {children}
    </ReactReduxContext.Provider>
  );
}

function storeStateUpdatesReducer(count) {
  return count + 1;
}

function connect(mapStateToProps = () => {}, mapDispatchToProps = () => {}) {
  // 这里抽取一下多处用到的 propsSelector
  function childPropsSelector(store, wrapperProps) {
    // 拿到state
    const state = store.getState();

    // 执行mapStateToProps和mapDispatchToProps
    const stateProps = mapStateToProps(state);
    const dispatchProps = mapDispatchToProps(store.dispatch);

    return Object.assign({}, stateProps, dispatchProps, wrapperProps);
  }
  // 这里再包一层，使得我们可以把想要连接的组件作为参数传入
  function connectHOC(WrappedComponent) {
    function ConnectedFunc(props) {
      // 复制一份 props
      const { ...wrapperProps } = props;

      // 拿到 contextValue 解构出 store 和 parentSub
      const contextValue = useContext(ReactReduxContext);
      const { store, subscription: parentSub } = contextValue;

      // 真正要传入被包裹组件的 Props
      // 包括 自己本身传入的 + 组件需要从 Store 拿的 State + Dispatch
      const actualChildProps = childPropsSelector(store, wrapperProps);

      // 保存上一次的 actualProps，以便后面拿到进行浅比较
      // 这里使用的是 useLayoutEffect 目的是同步拿到结果并保存到 lastChildProps 的 current 中
      const lastChildProps = useRef();
      useLayoutEffect(() => {
        lastChildProps.current = actualChildProps;
      }, [actualChildProps]);

      // 这里需要一个浅比较失败时，强制触发更新的东西
      const [, forceComponentUpdateDispatch] = useReducer(
        storeStateUpdatesReducer,
        0
      );

      // 新建一个 subscription 实例
      const subscription = new Subscription(store, parentSub);

      // state 回调抽出来成为一个方法
      const checkForUpdates = () => {
        const newChildProps = childPropsSelector(store, wrapperProps);
        // 如果参数变了，记录新的值到 lastChildProps 上
        // 并且强制更新当前组件
        if (!shallowEqual(newChildProps, lastChildProps.current)) {
          lastChildProps.current = newChildProps;

          // 需要一个 API 来强制更新当前组件
          forceComponentUpdateDispatch();

          // 然后通知子级更新
          subscription.notifyNestedSubs();
        }
      };

      // 使用 subscription 注册回调
      subscription.onStateChange = checkForUpdates;
      subscription.trySubscribe();

      // 修改传给子级的 context
      // 将 subscription 替换为自己的
      const overriddenContextValue = {
        ...contextValue,
        subscription,
      };

      // 渲染 WrappedComponent
      // 再次使用 ReactReduxContext 包裹，传入修改过的context
      return (
        <ReactReduxContext.Provider value={overriddenContextValue}>
          <WrappedComponent {...actualChildProps} />
        </ReactReduxContext.Provider>
      );
    }
    return ConnectedFunc;
  }
  // 返回高阶组件（接收组件为参数，同时返回值也是组件）
  return connectHOC;
}
