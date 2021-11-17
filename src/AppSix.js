import React, {  } from "react";
import { connect , store, appContext } from "./redux";
import './App.css';

/* 那这里我们已经了解了redux的一些APi，现在我们新建一个文件把它们放在一个文件里面统一管理*/
/* 那我们现在就可以把connect，store，reducer移走了 */
/* 移走之后发现我们的代码跟之前一样很清爽，去看一下我们的redux */

/* 回来之后我们来说一下react-redux提供的selector 这么个东西 */
/*看一下我们的user组件 */
const App = () => {
  return (
    <appContext.Provider value={store}>
      <One />
      <Two />
      <Three />
    </appContext.Provider>
  );
}
/* 这个userModifer组件也改一下之后看一下页面 */
/* 发现是没有问题的，好，那selector还有一个特别重要的作用：精准渲染 。*/
/* 什么是精准渲染呢，就是组件只在自己的数据变化是render */
/* 那我们来实现一下selector的精准渲染。我们先去store的state里面加一个属性group，我们把加的属性放在第三个子组件里面 */

/**
 * 看完了selector参数，那我们现在来了解一下connect的第二个参数mapDispatchertoProps。它是干什么用的呢，我们来写一下。就在userModifer组件写吧
 */
/* 我们第一个参数selector没用，那我们就传一个null吧。第二个参数我们也是传一个函数*/
/* 那下面这个写法就是利用第二个参数去传一个dispatch的对象集合，使得组件可以直接用type名称调用，很简洁 */
/* 但是上面这dispatch的函数部分看起来就很不简洁，我们后面在优化一下 。 那我们也改一下connect函数*/

const UserModifer = connect(null, (dispatch)=>{
  return {
    updateUser: (attrs) => dispatch({type:'updateUser',payload:attrs})
  }
})(({ updateUser, state, children }) => {
  console.log('渲染UserModifer组件')
  const onchange = (e) => {
    updateUser({ name: e.target.value });
  }
  return <div>
    {children}
    <input value={state.user.name} onChange={onchange} />
  </div>
}
)
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

/* 我们用connect包裹一下写好之后去页面看一下发现我们更新的是第二个子组件的name属性，怎么第三个子组件也跟着更新了呢？ */
/* 那我们要做到如果只更新user的name 只有用到user的组件更新，怎么做？ */
/* 我们回到connect函数 */
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
const User = connect(state =>{
  return {user:state.user}
},null)(({user}) => {
  console.log('渲染User组件')
  /* 目前我们的User组件只用到了user里面的name属性，会发现这样写有点麻烦，如果这个name在四层五层呢，那是不是点一长条。比如 state.xxx.yyy.zzz.name*/
  /* 所以我们给它提供一个选择，那比如说connect的第一个参数呢我们用括号来表达 state，然后它返回一个对象，这个对象里面是个user，拿到state里面的user */
  /* 我们这里替换一下state的user */
  /* 那我们在rudex文件里面改一下 */
  return (
    <span>User:{user.name}</span>
  )
})

export default App;

/* 那AppSix文件就讲了connect的两个参数，我们会在AppSeven文件里面讲解connect的意义和优化connect的参数写法 */
