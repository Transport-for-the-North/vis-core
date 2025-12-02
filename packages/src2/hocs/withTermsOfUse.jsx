import React from "react";
import Cookies from 'js-cookie'; // Make sure to import the Cookies library
import { TermsOfUse } from '../Components/TermsOfUse/TermsOfUse.jsx';

export const withTermsOfUse = (WrappedComponent) => {
  return (props) => {
    const { pageConfig } = props;
    const toc = Cookies.get('toc');
    // Normalize to boolean (handles boolean or 'true'/'false' strings)
    const userHasAcceptedTermsOfUse =
      typeof toc === 'boolean'
        ? toc
        : (typeof toc === 'string' ? toc.trim().toLowerCase() === 'true' : false);


    return (
      <>
        {(!userHasAcceptedTermsOfUse && pageConfig.termsOfUse) && (
          <TermsOfUse htmlText={pageConfig.termsOfUse}/>
        )}
        <WrappedComponent {...props} />
      </>
    );
  };
};