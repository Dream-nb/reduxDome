import React, { useState , useContext } from "react";
import './App.css';

/* 我们第一步就是要知道可以通过上下文去读state和写state*/

const appContext = React.createContext(null); 
/*
  我们先用react的Api去创建个上下文，这里用createContext创建的目的是为它里面的子组件共享数据。
  createContext会有两个属性provider和consumer,provider就是产生共享数据的，它有个value属性用来放共享的数据
*/

const App = () => {

  const [appState , setAppState ] = useState({user:{name:'faker',age: 18}});


  /*这一步就是把我们需要的value 以对象的形式传入provider中，供子组件共享使用 */ 
  const contextValue = { appState ,setAppState };


  /* 那么我们最终传出去的组件差不多就是这样子，里面的子组件就可以用到value的值 */
  return (
    <appContext.Provider value={contextValue}>
      <One/>
      <Two/>
      <Three/>
    </appContext.Provider>
  );
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
  /*我们获取信息就使用hook的api就直接可以获取到，很简单哈*/
  const contextValue =useContext(appContext)  
  return (
    <span>User:{contextValue.appState.user.name}</span>
  )
}

const UserModifer = ()=>{
  /* 那我们这个组件就是去改变我们前面创建的初始数据name */
  //const contextValue = useContext(appContext); //同样先取


  // const onchange = (e)=>{
  //   /*那为什么我一开始要这样写呢，有的朋友也可能认为这样写没问题，
  //   但是结果是没办法改变appState的。
  //   为什么呢？ 因为setState它有个特点，就是如果你给的对象是之前对象的引用，只要引用相同的那它就不会改变。引用是指同一个存储地址通过指针指向*/ 
  //   contextValue.appState.user.name = e.target.value;
  //   //contextValue.setAppState(contextValue.appState); //无法改变
  //   /*那我们可以创建新的对象就可以解决这个问题*/
  //   contextValue.setAppState({...contextValue.appState}); //可以改变

  //   /*通过这个例子也说明了我们通过上下文也是可以setState的*/ 
  // }

  /*可以看到我们上面写的代码需要优化一下，用解构来优化一下*/
  const {appState , setAppState} = useContext(appContext);
  const onchange = (e)=>{
    appState.user.name = e.target.value;
    setAppState({...appState});
  }

  return (
    <input value={appState.user.name} onChange={onchange}/>
  )
}


export default App;

/* App中就是让大家了解一下Context去读和写state */
/*我们会在AppTwo.js中讲解一下reducer到底做了什么*/