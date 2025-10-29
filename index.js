import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';
import { Auth0ProviderWithHistory } from 'contexts';
import reportWebVitals from './reportWebVitals';

/**
 * Renders the root React component.
 * Creates a root element using ReactDOM.createRoot and renders the <App /> component wrapped in a <Router /> for routing and enclosed in a <React.StrictMode /> for development checks.
 * @constant root
 */
const root = ReactDOM.createRoot(document.getElementById('root'));

const isDev = process.env.REACT_APP_NAME === 'dev';

console.log("[Clarity] REACT_APP_CLARITY_ID =", process.env.REACT_APP_CLARITY_ID);

(function loadClarity() {
  const id = process.env.REACT_APP_CLARITY_ID;
  if (!id) { console.warn("Missing REACT_APP_CLARITY_ID"); return; }

  // define queue immediately
  window.clarity = window.clarity || function(){ (window.clarity.q = window.clarity.q || []).push(arguments); };

  // default deny
  window.clarity("consentv2", { ad_Storage:"denied", analytics_Storage:"denied" });

  // grant if returning user
  const consentGiven = document.cookie.split("; ").find(s => s.startsWith("toc="))?.split("=")[1] === "true";
  if (consentGiven) window.clarity("consentv2", { ad_Storage:"granted", analytics_Storage:"granted" });

  // inject clarity.js
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://www.clarity.ms/tag/" + id;
  (document.head || document.documentElement).appendChild(s);
})();

root.render(
  <Router>
    {isDev ? (
      <React.StrictMode>
        <App />
      </React.StrictMode>
    ) : (
      <Auth0ProviderWithHistory>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </Auth0ProviderWithHistory>
    )}
  </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();