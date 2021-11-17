import React, { } from "react";
import { connect, createStore, Provider } from "./reduxThree";
import './App.css';

/**
 * 那我们这个文件就来了解一下支持异步action
 * 首先我们先改一下UserModifer组件,来模拟一下异步请求
 */

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

const initState = {
  user: { name: 'faker', age: 18 },
  group: { name: '前端组' }
}

const store = createStore(reducer, initState)


const App = () => {
  return (
    <Provider store={store}>
      <One />
      <Two />
      <Three />
    </Provider>
  );
}
const ajax = (type)=>{
  if(type == '/user'){
    return new Promise((resolve,reject)=>{
      setTimeout(()=>{
        resolve({data: { name: '三秒后的User', age: 18 }})
      },3000)
    })
  }
}

const fetchUser = (dispatch) => {
  ajax('/user').then(respones =>{
    dispatch({type: 'updateUser',payload: respones.data})
  })
}

/**
 * 那我们该完之后会发现我们现在写的请求方式跟我们平常项目里面写的请求是不是不一样啊
 * 我们项目里面一般都是dispatch(fetchUser)这样的，那我们就不得不对我们写的dispatch做一些修改。
 * 那我们按照以前的观点来看dispatch接收的是一个action，那fetchUser我们就可以理解为是一个函数的action
 * 那我们把这个函数action就叫做异步action，为什么需要redux支持异步action呢？目的就是为了写出dispatch(fetchUser)这种形式的代码。
 * 那我们去reduxThree文件改一下
 */

const UserModifer = connect(null,null)(({ dispatch, state, children }) => {
  console.log('渲染UserModifer组件')
  const onClick = (e) => {
    //fetchUser(dispatch); 修改完reduxThree之后这里就不用这样写了
    dispatch(fetchUser)
    /*ok,那现在redux就支持了异步的action */
  }
  return <div>
    {children}
    <div>User:{state.user.name}</div>
    <button onClick={onClick}>异步获取User</button>
  </div>
}
)




/**
 * 那除了函数action还有没有别的action呢？那肯定是有的，比如Promise的action
 * promise的action和函数的action的区别有在于把action的type暴露在外部好辨别我们对那个type下的state做了修改
 * 我们来写一下。
 * 那我们的reduxThree文件里面也加一下，我们就写在一起
 */
const fetchUserPromise = (dispatch) => {
  return ajax('/user').then(response => response.data)
}

const UserModiferOne = connect(null,null)(({ dispatch, state, children }) => {
  console.log('渲染UserModifer组件')
  const onClick = (e) => {
    dispatch({type: 'updateUser',payload: fetchUserPromise() })
  }
  return <div>
    {children}
    <div>User:{state.user.name}</div>
    <button onClick={onClick}>异步获取User</button>
  </div>
}
)



const One = () => {
  return (
    <section>第一个子组件<User /></section>
  )
}
/**
 * 我们改变传入的组件就可以了哈
 * 好我们看到上面的两个组件，你可以看到其实单词的个数几乎是没有改变的，如果想组件里面调用短一点呢外面就长一点，如果组件里面长一点呢，那外面的函数就短一点
 * 所以其实这个中间件只是帮我们改变了代码的组织形式，并没有对代码做任何的优化。
 * 好到目前为止我们的redux支持了两种异步的action。
 * 那其实我们官方的redux并不会支持这两种异步的action，所以redux提供了一个参数，然开发者传入需要使用的中间件。
 * 那么这个参数就是在创建store的时候会传第三个参数叫 applyMiddleware，它接收的参数有你提供的中间件而定，例如需要用到a，b中间件，那就写applyMiddleware(store,[a,b])即可。
 * 它就会依次的执行这个两个中间件，也就是会把代码运用到dispatch上面，原理是一样的。
 * 有兴趣的可以看一下redux-thunk和redux-promise这两个中间件的源码，核心的东西大同小异哈。
 */
const Two = () => {
  return (
    <section>第二个子组件<UserModifer /></section>
  )
}
const Three = connect(state => {
  return {
    group: state.group,
  }
})(({ group }) => {
  console.log('第三个子组件')
  return (
    <section>第三个子组件{group.name}</section>
  )
})
const User = connect(state =>{
  return {
    user: state.user
  }
},null)(({ user }) => {
  console.log('渲染User组件')
  return (
    <span>User:{user.name}</span>
  )
})

export default App;

/**
 * 那目前关于redux的所有知识都了解完毕了，希望大家看了之后有所进步。
 * 谢谢。
 */