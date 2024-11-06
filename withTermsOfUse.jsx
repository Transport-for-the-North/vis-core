import React from "react";
import Cookies from 'js-cookie'; // Make sure to import the Cookies library
import { TermsOfUse } from '../Components/TermsOfUse/TermsOfUse.jsx';

export const withTermsOfUse = (WrappedComponent) => {
  return (props) => {
    const { pageConfig } = props;
    const userHasAcceptedTermsOfUse = Cookies.get('toc');
    console.log(userHasAcceptedTermsOfUse);

    return (
      <>
        {(!userHasAcceptedTermsOfUse || userHasAcceptedTermsOfUse === undefined) && (
          <TermsOfUse pageContext={pageConfig} />
        )}
        <WrappedComponent {...props} />
      </>
    );
  };
};