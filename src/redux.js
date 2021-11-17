import React, { useEffect, useContext, useState } from "react";

/* 那目前redux有一个store，一个connect，一个reducer，一个appContext。一个精简小型的redux就完成了。 */
export const store = {
  state: {
    user: { name: 'faker', age: 18 },
    group: { name: '前端组' } //新添加一个
  },
  setState(newState) {
    store.state = newState;
    store.listeners.map(fn => fn(store.state))
  },
  listeners: [],
  subscribe(fn) {
    store.listeners.push(fn)
    return () => {
      const index = store.listeners.indexOf(fn)
      store.listeners.splice(index, 1);
    }
  }
}

// export const connect = (Component) => {
//   return (props) => {
//     const { state , setState } = useContext(appContext);
//     const [,update] = useState({})
//     useEffect(()=>{
//       store.subscribe(()=>{
//         update({})
//       })
//     })
//     const dispatch= (action) =>{
//       setState(reducer(state,action));
//     }
//     return <Component {...props} dispatch={dispatch} state={state} />
//   }
// }
const changed = (oldState, newState) => {
  let changed = false;
  for (let key in oldState) {
    if (oldState[key] !== newState[key]) {
      changed = true; //这里可以优化一下，当发现有变化的时候直接rank跳槽循环即可。自行优化。
    }
  }
  return changed;
}

/**
  
/* 这样写表示先接受一个参数，然后在接收一个参数  */
/* 那么这个参数我们就叫做selector */
/*export const connect = (selector) => (Component) => {
  return (props) => {
    const { state, setState } = useContext(appContext);
    const [, update] = useState({})
    const data = selector ? selector(state) : { state } //那这个data就是用户需要的所有数据

    // useEffect(()=>{
    //   store.subscribe(()=>{
    //     update({})
    //   })
    // })
    /*那我们就要在更新的时候做一下修改，之前的就是不管你组件有什么变化，那我都更新所有组件。 */
/* 现在我们就在它订阅之后去对比一下我们新拿到的data跟之前的data有没有改变，有改变那我们更新，没有即不更新 */
/* 那么我们要注意一个点当selector变化的时候useEffect就会重新执行，就会重新订阅，所以我们为了避免多次重复订阅，我们加一个取消订阅 */
/* 因为我们之前写订阅的时候会返回取消订阅函数，所以直接返回即可 */
/* 那我们优化一下代码，变量只用一次 */
/*useEffect(() =>
  // const unsubscribe = store.subscribe(()=>{
  //   const newData = selector? selector(store.state): {state: store.state}
  //   if(changed(data,newData)){//changed函数就是去遍历旧数据和新数据，如果发现有一个变化了就更新，如果没有变化就不更新
  //     console.log('update');
  //     update({})
  //   }

  // })

  // return unsubscribe
  store.subscribe(() => {
    const newData = selector ? selector(store.state) : { state: store.state }
    if (changed(data, newData)) {//changed函数就是去遍历旧数据和新数据，如果发现有一个变化了就更新，如果没有变化就不更新
      console.log('update');
      update({})
    }

  })
  , [selector])
const dispatch = (action) => {
  setState(reducer(state, action));
}
/* 那我们直接放入组件里面,那这个state我们就不需要给了*/
/*改完之后我们把AppSix里面的用到connect的改一下 */
/*return <Component {...props} {...data} dispatch={dispatch} />
}
}
*/

/* 那我们加上connect的第二个参数 */
/* 同样的加个判断 传了mapDispacherToProps就用，没传就把dispatch给你*/
export const connect = (selector, mapDispacherToProps) => (Component) => {
  return (props) => {
    const [, update] = useState({});
    const { state, setState } = useContext(appContext);
    const data = selector ? selector(state) : { state };
    const dispatch = (action) => {
      setState(reducer(state, action))
    }
    const dispatchers = mapDispacherToProps ? mapDispacherToProps(dispatch) : { dispatch }
    useEffect(() =>
      store.subscribe(() => {
        const newData = selector ? selector(store.state) : { state: store.state };
        if (changed(data, newData)) {
          update({})
        }
      })
      , [selector])

    return <Component {...props} {...data} {...dispatchers} />
  }
}


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

export const appContext = React.createContext(null);