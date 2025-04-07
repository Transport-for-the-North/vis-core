import React, { useState } from "react";
import styled from "styled-components";
import Cookies from 'js-cookie';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black */
  z-index: 999999; /* Very high z-index */
  pointer-events: auto; /* Allow interaction */
`;

const StyledBox = styled.div`
  position: fixed;
  top: 27%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #f0f0f0; /* Light grey color */
  color: rgb(13, 15, 61);
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000000; /* Very high z-index */
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  pointer-events: auto; /* Ensure this component captures pointer events */

  .tou-header {
    font-size: 24px; /* Larger font size for the header */
    font-weight: bold;
    margin-bottom: 20px;
  }

  .divider {
    width: 100%;
    height: 1px;
    background-color: #ccc;
    margin: 20px 0;
  }

  .tou-content {
    width: 100%;
    text-align: left; /* Align text to the left */
    margin-bottom: 20px;
  }

  .accept-button {
    background-color: #7317de; /* Button background color */
    border: none;
    color: white; /* Button text color */
    padding: 10px 20px; /* Button padding */
    font-size: 16px;
    cursor: pointer;
    border-radius: 5px; /* Rounded corners */
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #5a0fb0; /* Darker shade on hover */
    }
  }
`;

export const TermsOfUse = ({ htmlText }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleAccept = () => {
    Cookies.set('toc', true, { expires: 3, secure: true, sameSite: 'Lax' }); // Set the cookie to true when accepted
    setIsVisible(false);
  };

  return (
    <>
      {isVisible && (
        <>
          <Overlay />
          <StyledBox>
            <div className="tou-header">Terms of Use</div>
            <div className="divider"></div>
            <div className="tou-content" dangerouslySetInnerHTML={{ __html: htmlText }} />
            <button className="accept-button" onClick={handleAccept}>
              Accept
            </button>
          </StyledBox>
        </>
      )}
    </>
  );
}