const combineReducers = (reducers) => {
  return (state, action) => {
    return Object.keys(reducers).reduce((acc, prop) => {
      return {
        ...acc,
        [prop]: reducers[prop](acc[prop], action),
      };
    }, state);
  };
};

const createActions = (namespace, actions) => {
  return Object.fromEntries(
    Object.entries(actions)
      .map(([key, value]) => ([key, `${namespace}::${value}`])))
}

export { combineReducers, createActions };
