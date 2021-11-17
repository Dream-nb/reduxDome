import React, {  } from "react";
import { connect , store, appContext } from "./redux";
import { connectToUser } from "./connects";
import './App.css';

/* 那我们这个文件就来说一说connect的意义*/

/*我们之前说过connect是为了让全局的state和组件进行结合，但是我们会发现他的调用方式很奇怪，首先先传一个state和dispatch然后在传一个组件呢，为什么不三个参数下来呢 */
/* 那实际上开发者是有考虑的，好我们看一下我们的代码 */

const App = () => {
  return (
    <appContext.Provider value={store}>
      <One />
      <Two />
      <Three />
    </appContext.Provider>
  );
}

/* 我们可以看到 UserModifer组件和User组件 都用了state中的user属性，那我们其实可以复制过来，但复制是不好的操作，那我们就把它提取出来 */
/* 同样我们把dispatch的部分也提出来 */
// const userSelector = state => {
//   return {user: state.user}
// }
// const userDispatcher = dispatch =>{
//   return {
//     updateUser: (attrs) => dispatch({type:'updateUser',payload:attrs})
//   }
// }

/* 好我们发现是不是用到user属性的组件都有可能用到 userSelector和userDispatcher吧，好那我们在整合一下*/
//const connectToUser = connect(userSelector,userDispatcher);

/* 
  那我们下面就只用  connectToUser就好了
  那我们发现如果一个组件想要一个数据，它直接给自己声明一个connectToUser是不是就可以拿到读和写啊。
  好,那这样的话我们就可以创建一个文件叫connects。那我们直接把上面的写入到connects文件里面就行了.
  那我们就知道MapStateToProps其实是用来封装读，MapDispatchToProps其实就是用来封装写，那会有一个人专门去维护这个connects的文件
  那么connect就是首先封装一个资源，你可以对这个资源进行读写，然后在传一个组件就行了，之所以分为两次调用，是为了方便你先调用一次
  得到一个半成品，然后等你想用一个组件与它结合的时候你就可以拿任意一个组件来与这个半成品相结合，然后会把这个读和写的接口传给这个任意组件。这就是connect的意义。
*/
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

/*那我们AppSeven就讲了connect的意义及优化我们写的代码 */
/*那么在AppEight中讲解一下CreateStore的用法 */

