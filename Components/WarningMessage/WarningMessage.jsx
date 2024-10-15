import styled from 'styled-components';

export const WarningMessage = styled.div`
  position: fixed;
  top: 85px;
  right: 10px;
  max-width: 20vw;
  min-width: 200px;
  background-color: rgba(0, 222, 198, 0.9);
  color: rgb(13, 15, 61);
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 10000; 
  transition: right 0.3s ease-in-out;
  display: flex;
  flex-direction: row; /* Change to row to align items in columns */
  align-items: flex-start;
  text-align: left;

  .close-button {
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
    color: #333;
    position: absolute;
    top: 5px;
    right: 5px;
  }

  .warning-header {
    width: 100%;
    margin-bottom: 10px;
  }

  .warning-icon {
    width: 24px; /* Adjust the width as needed */
    height: 24px; /* Adjust the height as needed */
  }

  .warning-title {
    font-weight: bold;
    margin-bottom: 10px;
  }

  .warning-content {
    display: flex;
    align-items: flex-start;
    width: 100%;
  }

  .icon-container {
    display: flex;
    align-self: center;
    margin-right: 15px;
    justify-content: center;
  }

  .text-container {
    flex-grow: 1;
  }
`;