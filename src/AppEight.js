import React, {  } from "react";
import { connect , createStore, Provider } from "./reduxTwo";
import { connectToUser } from "./connectsTwo";
import './App.css';

/* 那我们这个文件就来说一说CreateStore的用法*/

/**
 * 那么CreateStore接受两个参数
 * 第一个是reducer
 * 第二个是initState
 * 那我们自己写的redux里面的store的state既然是写死的，那肯定不符合我们封装的逻辑
 * 因为redux并不知道外面的数据是什么样子的
 * 那我们继续往下看会发现我们的reducer也是写死的，那redux也不可能知道创建新的数据
 * 那我们应该要让state和reducer是从外面传进来的。好那我们改一下redux代码 移步到reduxTwo
 */











 /**
  * 这里我们就用createStore来创建store
  * 这里也可以在state传参的时候给一个默认值
  * ok，那这样我们就知道createStore就是把初始的state和用到的reducer传给store，对store进行初始化的一个功能函数，很简单哈
  * 那我们reduxTwo文件里面也改一下，因为现在reduer在store上
  * 我们运行一下发现没有问题。我们回到reduxTwo文件去总结一下我们写的rudex
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

const store = createStore(reducer,initState)


const App = () => {
  return (
    <Provider store={store}>
      <One />
      <Two />
      <Three />
    </Provider>
  );
}
const UserModifer = connectToUser((({ updateUser, user, children }) => {
  console.log('渲染UserModifer组件')
  const onchange = (e) => {
    updateUser({ name: e.target.value });
  }
  return <div>
    {children}
    <input value={user.name} onChange={onchange} />
  </div>
}
))
const One = () => {
  return (
    <section>第一个子组件<User /></section>
  )
}
const Two = () => {
  return (
    <section>第二个子组件<UserModifer/></section>
  )
}
const Three = connect(state=>{
  return {
    group:state.group,
  }
})(({group}) => {
  console.log('第三个子组件')
  return (
    <section>第三个子组件{group.name}</section>
  )
})
const User = connectToUser((({user}) => {
  console.log('渲染User组件')
  return (
    <span>User:{user.name}</span>
  )
}))

export default App;

/*好那目前我们写的redux和真正的rudex几乎是一摸一样的了，可能会有一些细微的区别。*/
/*通过手写redux我们基本上已经了解了redux的思想了 */
/*那我们来总结一下 */
/**
 * redux和react-redux的思路
 * 首先我们有个App组件，它有很多个子组件，然后呢我们要让每一个子组件访问到全局的state
 * state是我们的第一个概念，那state放在那里呢？ redux把state放在store(仓库)里面
 * 问题在于我的组件如何和这个store链接起来呢？ 于是react-redux提供了一个connect
 * connect就是链接组件和state的桥梁。
 * 那链接之后做什么呢？ 就两个事情，一个读一个写
 * 如果你要读的话就去你的组件里面去取state，如果你要写的话就用dispatch去写。
 * 那如果你要读的更精准的话就传一个selector，如果要写的更精准的话就传一个mapDispacherToProps
 */

 /**
  * 我们在回顾一下connect做了哪些事？
  * 那么connect其实做了三件事：
  *   第一：从上下文拿到state和setState，其实我们也可以不用从useContext里面拿，也可以从store里面拿
  *   第二：就是对拿到的读写进行封装
  *   第三：就是在恰当的时候进行更新，那它是在什么时候更新的呢，就是它一旦发现store变化了(对每一个connect的组件订阅)，它就会在数据变更的情况下update
  * 最后就渲染组件。
  * 同时我们也能看出connect是一个高阶组件。
  */

/**
 * 那我们看到现在这个阶段就了解了什么是store，什么是state，什么是dispatch，什么是connect，什么是provider
 * 那dispatch中包含了reducer，initState，action
 * 那么reducer其实就是为了规范创建state的过程，因为每次更新state的时候不能改原来的state，要创建新的state，所以是规范。
 * 那么initState就是初始的state这个很好理解
 * 那么action其实就是你的变动的描述，比如说你有很多个type，type就相当于一个变动的描述。
 */

/**
 * 那我们下个AppNine文件来看看官方redux和我们写的redux有什么不同，了解一下redux的中间件
 */