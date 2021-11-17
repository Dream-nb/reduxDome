import React, { useState , useContext } from "react";
import './App.css';

/* 我们第二步就是了解一下reducer是如何规范state的创建流程的*/

/* 那我们之前修改state的时候是不是特别不规范，直接就去修改了原始的state。怎么办呢？ 那我们就提供一个函数来帮它完成改变*/
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

/* 我们创建一个createNewState函数，这个函数有三个参数：第一个就是初始的state；第二个是actionType（行为类型）;第三个则是改变的data */
const createNewState = ( state, actionType, actionData )=>{
  /* 这里的逻辑就是，如果actionType是updateUser那么我就会创建新的state传回给调用者，如果不是，那么就返回你传入的state保持不变。 */ 
  /* 那我们下面在change事件里面用一下看看效果*/



  /*
    移步到change事件中
    移步到change事件中
    移步到change事件中
    移步到change事件中
  */




  /* 那么我们可以看出这个函数就跟reducer很相似，那我们吧函数名改为reducer*/
  /* 那有人会问了reducer是接受两个参数的呀，我们这个怎么接受三个参数呢?*/
  /* 那我们就来整合一下后面两个参数，那我们直接把actionType和actionData统一成一个叫action的对象。那么就有了下面这个函数*/ 
  if(actionType === 'updateUser'){
    return {
      ...state,
      user:{
        ...state.user,
        ...actionData,
      }
    }
  }else{
    return state
  }

}
/*那么这个函数的第二个参数就接收一个type和一个payload*/ 
/* payload这个参数呢其实就是上面的data */
/* 我们把下面的change事件里面的逻辑也改一下 */
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
    <section>第一个子组件</section>
  )
}
const Two = ()=>{
  return (
    <section>第二个子组件<User/></section>
  )
}
const Three = ()=>{
  return (
    <section>第三个子组件<UserModifer/></section>
  )
}
const User = ()=>{
  const contextValue =useContext(appContext)  
  return (
    <span>User:{contextValue.appState.user.name}</span>
  )
}
const UserModifer = ()=>{
  const {appState , setAppState} = useContext(appContext);
  // const onchange = (e)=>{
  //   //appState.user.name = e.target.value; 我们这一步就可以去掉了
  //   /*那么这就是对创建更新state的一个规范*/
  //   //const newState =  createNewState( appState,'updateUser', { name: e.target.value })
  //   //setAppState(newState);
  //   /*上面的变量可以省去，优化一下。好我们回到刚才的createNewState函数 */
  //   setAppState(reducer( appState,'updateUser', { name: e.target.value }));
  // }




  /*最后就有了我们现在的这种类似于dispatch的写法有木有，是不是很神奇呢？ 那这就是reducer，reducer就是这么简单 */
  const onchange = (e)=>{
    setAppState(reducer( appState,{type: 'updateUser',payload:{name: e.target.value }}));
  }
  return (
    <input value={appState.user.name} onChange={onchange}/>
  )
}

export default App;

/* ruducer就是规范创建修改state的一个函数*/
