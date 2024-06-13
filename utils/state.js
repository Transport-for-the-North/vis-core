/**
 * Combines multiple reducers into a single reducer function with accessor support.
 * This function allows accessing reducers by their keys, similar to objects.
 * @function combineReducersWithAccessor
 * @param {Object} reducers - An object containing reducer functions.
 * @returns {Function} A reducer function.
 */
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

/**
 * Combines multiple reducers into a single reducer function.
 * @function combineReducers
 * @param {Object} reducers - An object containing reducer functions.
 * @returns {Function} A reducer function.
 */
function combineReducers(reducers) {  
  return (state = {}, action) => {
    const newState = {};
    for (let key in reducers) {
      newState[key] = reducers[key](state[key], action);
    }
    return newState;
  }
}

/**
 * Creates actions with namespaces.
 * @function createActions
 * @param {string} namespace - The namespace for the actions.
 * @param {Object} actions - An object containing action names.
 * @returns {Object} An object containing action creators with namespaced keys.
 */
const createActions = (namespace, actions) => {
  return Object.fromEntries(
    Object.entries(actions)
      .map(([key, value]) => ([key, `${namespace}::${value}`])))
}

export { combineReducers, createActions };
