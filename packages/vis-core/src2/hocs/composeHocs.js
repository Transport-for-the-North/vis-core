/**
 * Utility function to compose multiple HOCs.
 * @param  {...Function} hocs - The HOCs to compose.
 * @returns {Function} A function that applies all the HOCs to a component.
 */
export const composeHOCs = (...hocs) => (Component) => {
    return hocs.reduce((WrappedComponent, hoc) => hoc(WrappedComponent), Component);
  };