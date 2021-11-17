/**
 * 我们去官网看到，官方提供的Api分别是 getState(),dispacth(action),subscriber(listener),replaceReducer(nextReducer)
 * 第四个用的少我们就不讨论
 * 那我们之前怎么写的，直接在store里面写的state属性是吧，那我们改一下
 * 我们就不在原文件里面改了，直接在这里写，那其实就是通过getState返回state而已
 * 那我们也把reducer也提出来，暴露出去的话容易被人改.
 * 那createStore里面也改一下就好了
 * listeners只有subscribe用到了，我们也拿出来。
 * 如果你闲这个三个变量看着不舒服，那我们可以用个对象包裹起来
 * 我们也把setState隐藏一下
 */
import React, { useEffect, useContext, useState } from "react";
let state = undefined;
let reducer = undefined;
let listeners = [];
// let initState = {
//   state: undefined,
//   reducer: undefined,
//   listeners: [],
// }
/* 这就是我之前为什么没有用this去写的原因，因为根据redux官方API是不暴露在外的，所以如果用this的话会出错*/
/* 那这样写有什么好处呢，就是在connect函数中我们就不需要从useContext上下文中拿setState了，又因为dispatch用到的setState和reducer都是引用外面的 */
/* 那我们把dispatch放到store,下面用到dispatch的地方都改一下， */
/* 现在我们写的redux就跟官方文档一样的了 */
const setState = (newState) => {
  state = newState;
  listeners.map(fn => fn(state))
}
const store = {
  getState(){
    return state
  },
  dispatch:(action) => {
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
export const createStore = (_reducer,initState) =>{
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
    const dispatchers = mapDispacherToProps ? mapDispacherToProps(store.dispatch) : { dispatch:store.dispatch }
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
export const Provider = ({ store , children}) =>{
  return <appContext.Provider value={store}>
    {children}
  </appContext.Provider>
}

/* 那我们最后一个文件AppTen 就来了解一下redux如何支持异步的action */