const combineReducersWithAccessor = (reducers) => {
  return (state, action) => {
    return Object.keys(reducers).reduce((acc, prop) => {
      return {
        ...acc,
        [prop]: reducers[prop](acc[prop], action),
      };
    }, state);
  };
};

function combineReducers(reducers) {  
  return (state = {}, action) => {
    const newState = {};
    for (let key in reducers) {
      newState[key] = reducers[key](state[key], action);
    }
    return newState;
  }
}

const createActions = (namespace, actions) => {
  return Object.fromEntries(
    Object.entries(actions)
      .map(([key, value]) => ([key, `${namespace}::${value}`])))
}

export { combineReducers, createActions };
