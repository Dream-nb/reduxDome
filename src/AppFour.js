import React, { useState, useContext } from "react";
import './App.css';

/* 我们第四步就是来学习一下如果写出一个connect*/

/*
  接着AppThree来说 我们有一个UserModifer组件，我们把它包装成了Wrapper组件，用的时候呢我们就必须用Wrapper组件。
  因为我们直接使用UserModifer组件的话是拿不到dispatch和state的。因此，任何一个组件想要拿到dispatch和state就必须
  把它包装成Wrapper组件，那我写业务不得累死了是不是。那么我们该怎么做呢？自此connect孕育而生...
*/


const appContext = React.createContext(null);
const App = () => {
  const [appState, setAppState] = useState({ user: { name: 'faker', age: 18 } });
  const contextValue = { appState, setAppState };
  return (
    <appContext.Provider value={contextValue}>
      <One />
      <Two />
      <Three />
    </appContext.Provider>
  );
}

/*const UserModifer = ({ dispatch, state }) => {
 const onchange = (e) => {
   dispatch({ type: 'updateUser', payload: { name: e.target.value } })
 }
 return (
   <input value={state.user.name} onChange={onchange} />
 )

}*/

/* 我们首先创建个函数叫做createWrapper */
/* 然后我们把Wrapper函数放进去 */
/* 因为我们是在封装一个组件，但这个组件不能写死，不然就没有意义了。所以我们这个createWrapper函数接收一个叫component的参数 */
/* 这里Wrapper这个变量只用了一次我们把它省略掉 */
const connect = (Component) => {
  // const Wrapper = () => {
  //   const { appState, setAppState } = useContext(appContext);
  //   const dispatch = (action) => {
  //     setAppState(reducer(appState, action));
  //   }
  //   return <Component dispatch={dispatch} state={appState} />
  // }
  // return Wrapper
  /*
    return () => {
      const { appState, setAppState } = useContext(appContext);
      const dispatch = (action) => {
        setAppState(reducer(appState, action));
      }
      return <Component dispatch={dispatch} state={appState} />
    }
  */

  /*回到connect函数，我们发现如果我们的UserModifer组件接收了父级传给它的属性，以我们上面写的方式好像没办法拿到，所以我们需要修改一下 */
  /* 我们就接受props在传个component组件即可。*/
  /* 那还有一种情况，如果我的UserModifer组件里面含有子组件怎么办? 那其实它可以通过props的children获取到，看UserModifer组件*/
  return (props) => {
    const { appState, setAppState } = useContext(appContext);
    const dispatch = (action) => {
      setAppState(reducer(appState, action));
    }
    return <Component {...props} dispatch={dispatch} state={appState} />
  }


}

/*那我们现在的Wrapper函数就这样写 */
/*这个顺序要注意下，不能先创建在去声明。所以我们把UserModifer拿到最前面来 */
/* 那我们看一下这个代码，这个UserModifer变量名是不是有点多余，那我们把它省略了 */
//const Wrapper = createWarpper(UserModifer)

/* 就变成了下面这样 */
/* 我们在把Wrapper这个变量名改成 UserModifer*/
/*
  const Wrapper = createWarpper(({ dispatch, state }) => {
    const onchange = (e) => {
        dispatch({ type: 'updateUser', payload: { name: e.target.value } })
      }
      return (
        <input value={state.user.name} onChange={onchange} />
      )
    }
  )
*/
/* 就像这样 */
/* 那么我们由此可以看到，我们创建这个组件其实就在在外层套了个createWarpper函数对不对*/
/* 它的作用就是讲这个组件与全局状态链接起来，所以redux把它叫做connect */
/* connect不是redux这个库提供的，而是react-redux */
/* 那我们把它改一下名字。好我们在去看一下connect函数 */
const UserModifer = connect(({ dispatch, state, children }) => {
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
  return (
    <section>第一个子组件<User /></section>
  )
}
const Two = () => {
  return (
    <section>第二个子组件<UserModifer/></section>
  )
}
const Three = () => {
  return (
    <section>第三个子组件</section>
  )
}
const User = () => {
  const contextValue = useContext(appContext)
  return (
    <span>User:{contextValue.appState.user.name}</span>
  )
}

export default App;

/*那么这就是connect的作用：让组件和全局状态链接起来*/
/* 那高阶组件是什么意思呢？ 就是一个函数接收一个组件并且返回一个组件，那么这就叫做高阶组件，所以connect为高阶组件 */

/* 我们现在的代码看似没有啥毛病，很流畅。但是里面的会有一些渲染机制的问题，我们在Appfive里面去讲解*/