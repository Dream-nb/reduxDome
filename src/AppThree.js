import React, { useState ,useContext } from "react";
import './App.css';

/* 我们第三步就是了解一下如何用dispatch来规范setState流程的*/

/*那我们首先去看一下change事件里面的内容*/

const appContext = React.createContext(null); 
const App = () => {
  const [appState , setAppState ] = useState({user:{name:'faker',age: 18}});
  const contextValue = { appState ,setAppState };
  return (
    <appContext.Provider value={contextValue}>
      <One/>
      <Two/>
      <Three/>
    </appContext.Provider>
  );
}

/* 那么我们创建一个函数叫做dispatch。 */
/* 我们就接收一个action。然后把下面的拿上来*/
// const dispatch = (action)=>{
//   setAppState(reducer( appState,action));
// }

/* 这样就可以了么？ 显然是不可以的。 
  为什么呢？ 因为我们创建的函数是没有办法拿到setAppState和appState。
  那么这里react规定只能在组件内部使用hooks。那有的同学可能想了把dispatch移到UserModifer组件里面不就完了么。
  问题是解决了，但是我们的初衷是封装到我们自己的组件里，自己的redux里面，这么一想的话其实是不合适的。那我们该怎么做呢？
*/
/* 其实之所以出现这样的囧境是因为我们把state放在Context中，如果state不在Context是不是就好办了呢？但是这种改动太大哈，同学们可以自己实践一下 */
/* 那就以现在的情况我们如何做呢 ？ 那既然你规定只能在组件里面用，那我就用组件包裹一层在给到UserModifer组件去用可不可以，好我们来写一下*/

/*声明一个组件叫wrapper */
/* 它什么都不用做，直接返回一个组件，那我们哪个组件用到了dispatch。UserModifer组件吧，那我们就直接返回它 */
/* 那么所有用到 UserModifer的地方都改成Wrapper。好现在我们把上面写的dispatch函数放到Wrapper组件里面，现在它是不是就可以用到Context了*/
/* 最后我们再把dispatch传给UserModifer。那么UserModifer组件就可以通过porps拿到dispatch，那我们还要拿到state去渲染页面，所以在传个state给它 */
/* 我们去下面看一下新的UserModifer组件如何编写 */
const Wrapper = ()=>{
  const {appState , setAppState} = useContext(appContext);
  const dispatch = (action)=>{
    setAppState(reducer( appState,action));
  }
  return <UserModifer dispatch={dispatch} state={appState}/>
}

const reducer = (state,{ type , payload }) => {
  if(type === 'updateUser'){
    return {
      ...state,
      user:{
        ...state.user,
        ...payload,
      }
    }
  }else{
    return state
  }
}

const One = ()=>{
  return (
    <section>第一个子组件<User/></section>
  )
}
const Two = ()=>{
  return (
    <section>第二个子组件<Wrapper/></section>
  )
}
const Three = ()=>{
  return (
    <section>第三个子组件</section>
  )
}
const User = ()=>{
  const contextValue =useContext(appContext)  
  return (
    <span>User:{contextValue.appState.user.name}</span>
  )
}
// const UserModifer = ()=>{
//   const {appState , setAppState} = useContext(appContext);
//   /*我们每次修改state里面的内容时是不是都要写setAppState，reducer，appState呀，比如我们想改变age*/
//   /* 每次改变一个属性，我就要写一遍前面三个，很麻烦，我们不如写个函数来帮我们写这三个东西。好我们回到开头 */
//   // const onchange = (e)=>{
//   //   setAppState(reducer( appState,{type: 'updateUser',payload:{name: e.target.value }}));
//   //   //setAppState(reducer( appState,{type: 'updateAge',payload:{age: e.target.value }}));//就要在写一遍
//   // }
//   /* 下面这里就可以这样写 */
//   const onchange = (e)=>{
//     dispatch({type: 'updateUser',payload:{name: e.target.value }})
//   }
//   return (
//     <input value={appState.user.name} onChange={onchange}/>
//   )
// }



/* 可以看到，我们想要写数据呢就拿dispatch去写，想要读数据呢就用state。 是不是简洁了许多。 */
const UserModifer = ({dispatch,state})=>{
  const onchange = (e)=>{
    dispatch({type: 'updateUser',payload:{name: e.target.value }})
  }
  return (
    <input value={state.user.name} onChange={onchange}/>
  )

}

export default App;

/* 那目前我们就完成了一个组件的封装，它可以通过props来读写全局数据。那这个功能不是redux实现的，而是由redux的第二个库react-redux实现的。用的时候大家是一起用的*/
/* 那么AppThree中我们了解到了通过dispatch来规范setState的流程，所有人直接调dispatch，不用调那三个东西了*/
