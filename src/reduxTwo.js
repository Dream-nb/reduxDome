import React, { useEffect, useContext, useState } from "react";

/* 那我们写一个createStore的函数 */
/**
 * 那我们直接把传进来的reducer和state给到store就行了,那我们的store也不用导出了
 * 好我们回到AppEight文件调用一下
 */

const store = {
  state: {},
  setState(newState) {
    store.state = newState;
    store.listeners.map(fn => fn(store.state))
  },
  reducer: undefined,
  listeners: [],
  subscribe(fn) {
    store.listeners.push(fn)
    return () => {
      const index = store.listeners.indexOf(fn)
      store.listeners.splice(index, 1);
    }
  }
}

/**
 * 那redux它导出了三个变量
 * 第一个就是createStore ，它用来创建我们的store
 * 第二个就是connect， 它用于把组件和store链接起来
 * 那理论上这两个就够了呀，为什么还要把appContext传出去呢？
 * 那AppContext是一个上下文，它用于在任何地方来读取我们的store。
 * 那如果你看了rudex的源码跟我们写的是不一样的，我们用AppContext.Provider，value=store
 * rudex则是用Provider，store=store
 * 那我们能不能写成这样呢？其实是很简单的，我们写一下,在最下面。
 */


export const createStore = (reducer,initState) =>{
  store.state = initState;
  store.reducer = reducer;
  return store
}

const changed = (oldState, newState) => {
  let changed = false;
  for (let key in oldState) {
    if (oldState[key] !== newState[key]) {
      changed = true;
    }
  }
  return changed;
}
export const connect = (selector, mapDispacherToProps) => (Component) => {
  return (props) => {
    const [, update] = useState({});
    const { state, setState } = useContext(appContext);
    const data = selector ? selector(state) : { state };
    const dispatch = (action) => {
      setState(store.reducer(state, action))
    }
    const dispatchers = mapDispacherToProps ? mapDispacherToProps(dispatch) : { dispatch }
    useEffect(() =>
      store.subscribe(() => {
        const newData = selector ? selector(store.state) : { state: store.state };
        if (changed(data, newData)) {
          update({})
        }
      })
      , [selector])

    return <Component {...props} {...data} {...dispatchers} />
  }
}

const appContext = React.createContext(null);

/* 那其实能我们就是对appContext.Provider进行封装，通过props去拿到store和它的子组件 */
/* 好我们去AppEight文件里面替换一下 */

export const Provider = ({ store , children}) =>{
  return <appContext.Provider value={store}>
    {children}
  </appContext.Provider>
}

