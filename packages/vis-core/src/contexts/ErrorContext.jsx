import React, { createContext, useReducer, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ErrorOverlay } from 'Components';
import { errorReducer, errorActionTypes } from 'reducers';

export const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [state, dispatch] = useReducer(errorReducer, undefined);
  const location = useLocation();

  // Clear any active error when the route changes so overlays don't persist across pages
  useEffect(() => {
    if (state?.error) {
      dispatch({ type: errorActionTypes.CLEAR_ERROR });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <ErrorContext.Provider value={{ state, dispatch }}>
      {children}
      {state?.error && (
        <ErrorOverlay
          title={state.error.title}
          subtitle={state.error.subtitle}
          message={state.error.message}
          supportMessage={state.error.supportMessage}
          supportDetails={state.error.supportDetails}
          technicalDetails={state.error.technicalDetails}
          headerColor={state.error.headerColor}
          showTechnicalDetails={state.error.showTechnicalDetails !== false}
          onClose={() => dispatch({ type: errorActionTypes.CLEAR_ERROR })}
        />
      )}
    </ErrorContext.Provider>
  );
};
