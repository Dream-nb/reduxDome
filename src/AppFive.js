import React, { useState, useContext, useMemo, useEffect } from "react";
import './App.css';

/* 这个文件就来说说我们之前写的代码中存在的一些问题*/


/*我们首先在几个子组件里面打上console*/
/* 然后我们刷新去控制台看一下结果会发现，他们的渲染顺序是
    渲染第一个子组件
    渲染User组件
    渲染第二个子组件
    渲染UserModifer组件
    渲染第三个子组件
  然后我们改变一下输入框的内容在看一下，结果还是上面的顺序，所有组件又全部渲染了一次
  那这就有点问题了，因为只有一个组件用到了user的信息，然后只有一个组件用到了dispatch写的操作，为什么所有组件都全部渲染了呢？
  那如果我写100个无状态的组件，那每次渲染都要全部重新渲染，这个性能可想而知。应该说只有用到了user的组件才重新渲染才合理。
*/

/* 那我们先理一下这个机制，当我们调用input的change事件的时候，它会调用setAppState，
  通过dispatch调用setAppState，那setAppState是从useContext来的，那uscContext又是从
  useState里面拿到的。那根据react的规定，只要用到这个组件的setState（这里说的是传入的新对象），那么这个组件一定会在次执行，
  只要这个组件再次执行，那么它里面的子组件也会跟着再次执行。那我们有没有方法去阻止执行，那当然有就是useMemo。
  useMemo接收两个参数一个是函数，函数里面放的你要缓存的东西，第二个参数是一个依赖。可以传[](空数组)，那空数组就表示一旦缓存了就不在改变。
  那我们也写一下这个方法试一下 (在App组件里面完成)。
*/

/* useMemo值得我们推广么？ 不能推广，因为你每次要缓存一个组件都要Memo起来，很显然我们不会这样写，这样写太麻烦了。 */
/* 那我们有没有别的方法能做到当你用到了user，并且user变化了才重新渲染呢？答案肯定是有的，那redux就给我们提供了一种方式 */


/* 那我们要想不一次渲染全部组件的话，那我们就不能用到react提供的setState,所以这里我们抛弃useState，创建个对象叫store,*/
/* store对象里面有两个属性，一个是state，一个是setState */
/* 好，那我们就直接可以抛弃useState,那contextValue之前用的是useState现在就直接用store，所以我们可以优化一下直接传store给App组件 */
const appContext = React.createContext(null);

const store = {
  state:{
    user: { name: 'faker', age: 18 }
  },
  setState(newState){
    //console.log('newState')
    store.state = newState;
    store.listeners.map(fn=>fn(store.state))
  },
  listeners:[], //队列
  subscribe(fn){ //订阅
    store.listeners.push(fn)
    return ()=>{
      const index = store.listeners.indexOf(fn)
      store.listeners.splice(index,1);//取消订阅
    }
  }
}

/* 当我们修改完之后看看页面是可以跑起来的，但是我们在修改user信息的时候发现页面没有修改，是不是写的不对啊？  */
/* 那其实我们代码是已经修改了的，只是没有触发渲染 ,我们打印一下就知道。*/
/* 因为我们没有调用App中的setState，所以它就不会刷新。在一想那如果我调用了岂不是全都刷新了，那不是白写了么？*/
/* 那我们能不能在别的地方去调用这个useState呢？比如我们封装的connect？ 我们试一下 */

const App = () => {
  // const [appState, setAppState] = useState({ user: { name: 'faker', age: 18 } });
  // const contextValue = { appState, setAppState };
  // const x = useMemo(()=>{
  //   return <Three />
  // },[])
  /* 那么现在就可以在上下文里面拿到state和setState */
  /* 我们往下看那些地方用到了state，替换一下 */
  return (
    <appContext.Provider value={store}>
      <One />
      <Two />
      {/* {x} */}
      <Three />
    </appContext.Provider>
  );
}
const connect = (Component) => {
  /*这里用到了，那我们换一下 */
  return (props) => {
    // const { appState, setAppState } = useContext(appContext);
    // const dispatch = (action) => {
    //   setAppState(reducer(appState, action));
    // }
    // return <Component {...props} dispatch={dispatch} state={appState} />
    const { state , setState } = useContext(appContext);
    /* 我们来试试在connect用useState*/
    const [,update] = useState({}) //用不到state，所以用逗号隔开
    /*这就是每次调用了setState之后，我们调用一想update */
    useEffect(()=>{
      store.subscribe(()=>{
        update({})
      })
    })
    const dispatch= (action) =>{
      setState(reducer(state,action));
      //update({})//给个空对象 为什么给空对象，因为空对象就代表一个新的对象
    }
    /* 这么一写我们就很明显的知道只有被connect的组件才会重新渲染界面 ,好我们看看页面*/
    /* 我们会发现是不是只有第二个子组件input框变了，但是我们想第一个子组件也要变啊 */
    /* 我们可以看到我们封装的connect中调用了dispatch，就代表每一个connect的组件都有自己的dispatch，都只能更新自己。
      那怎么办，我们需要让每一个dispatch都知道state变化了。那么我们只能订阅一下这个变化。
      那我们先把上面那种单个组件更新的代码屏蔽掉，现在就在store里面增加两个属性，一个是listeners，用来放订阅到的函数
      第二个就是订阅属性subscribe，那你订阅的时候需要告诉我你干什么，所以参数为一个函数，后面会调用这个函数。那么我们订阅之后，有可能会
      取消订阅，所以我们返回一个取消订阅的函数。
      那我们在setState中告诉一下调用者说我已经变了，那这时候我们就对listeners进行遍历，告诉每一个订阅者我已经变了
    */

    /* 好那现在，我们就用store中的subscribe来订阅一下，因为我们只需要页面一开始进入的时候订阅一次就好，所以我们在useEffect里面完成,我们也把User组件用connect包起来 */
    /* 最后我们到页面看一下发现实现了我们的目的 */
    return <Component {...props} dispatch={dispatch} state={state} />
  }
}
const UserModifer = connect(({ dispatch, state, children }) => {
  console.log('渲染UserModifer组件')
  const onchange = (e) => {
    dispatch({ type: 'updateUser', payload: { name: e.target.value } })
  }

  return <div>
    {children}
    <input value={state.user.name} onChange={onchange} />
  </div>
}
)
const reducer = (state, { type, payload }) => {
  if (type === 'updateUser') {
    return {
      ...state,
      user: {
        ...state.user,
        ...payload,
      }
    }
  } else {
    return state
  }
}
const One = () => {
  console.log('渲染第一个子组件');
  return (
    <section>第一个子组件<User /></section>
  )
}
const Two = () => {
  console.log('渲染第二个子组件');
  return (
    <section>第二个子组件<UserModifer/></section>
  )
}
const Three = () => {
  console.log('渲染第三个子组件');
  return (
    <section>第三个子组件</section>
  )
}
const User = connect(({state,dispatch}) => {
  console.log('渲染User组件')
  // const { state } = useContext(appContext)
  /*这里用到了，那我们换一下 */
  return (
    <span>User:{state.user.name}</span>
  )
})

export default App;

/* 那我们通过前面5个文件已经大致聊到到redux的一些基本API的作用就写法 */
/* 那么我们会在AppSix中把他们都归纳在一个文件里面 */