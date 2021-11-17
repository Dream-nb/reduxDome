import React, { useEffect, useContext, useState } from "react";
let state = undefined;
let reducer = undefined;
let listeners = [];
const setState = (newState) => {
  state = newState;
  listeners.map(fn => fn(state))
}
const store = {
  getState() {
    return state
  },
  dispatch: (action) => {
    setState(reducer(state, action))
  },
  subscribe(fn) {
    listeners.push(fn)
    return () => {
      const index = listeners.indexOf(fn)
      listeners.splice(index, 1);
    }
  }
}
/**
 * 首先我们把旧的dispatch记录下来\
 * 然后我们在重新定义一个dispatch
 * 根据逻辑判断当action为不为函数的时候很明显我们用之前的dispatch。
 * 那当action为函数的时候，我们调用的是旧的dispatch还是我们重新定义的dispatch呢？
 * 那当action为函数的时候它调用哪个dispatch是取决于这个action会怎么使用我传入的dispatch。
 * 假设：我们一个action接收一个dispatch，它们会对dispatch做什么呢？这个地方就不知道了，为什么呢？ 因为很有可能它还会给dispatch传个函数，或者传对象
 * 这个取决于用它的人。所有我们只能用新定义的dispatch，因为我们新定义的dispatch既能处理对象也能处理函数。
 * 
 * 好我们去AppTen文件实验一下可行性
 */

const prevDispatch = store.dispatch

/* 那我们就在这里面在加一个判断Promise的action，就不单独写了 */
/**
 * 好我们去AppTen文件里面试一下
 */
let dispatch = (action) => {
  if (action instanceof Function) {
    action(dispatch)
    return
  }
  if(action.payload instanceof Promise ){
    action.payload.then(data=>{
      dispatch({...action,payload:data})
    })
    return
  }
  prevDispatch(action)
  return
}


export const createStore = (_reducer, initState) => {
  state = initState;
  reducer = _reducer;
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
    //const { setState } = useContext(appContext);
    const data = selector ? selector(state) : { state };
    const dispatchers = mapDispacherToProps ? mapDispacherToProps(dispatch) : { dispatch}
    useEffect(() =>
      store.subscribe(() => {
        const newData = selector ? selector(state) : { state };
        if (changed(data, newData)) {
          update({})
        }
      })
      , [selector])

    return <Component {...props} {...data} {...dispatchers} />
  }
}
const appContext = React.createContext(null);
export const Provider = ({ store, children }) => {
  return <appContext.Provider value={store}>
    {children}
  </appContext.Provider>
}
