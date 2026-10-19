import { Link } from "react-router-dom";
import "./Footer.styles.css";

export function Footer({ creditsText, privacyPolicyLink, cookiesLink, contactUsLink }) {
  const handleManageCookies = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("vis:open-cookie-preferences"));
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <nav className="footer-nav">
          <Link to={privacyPolicyLink} className="footer-link">Privacy Policy</Link>
          <Link to={cookiesLink} className="footer-link">Cookies</Link>
          <Link to={contactUsLink} className="footer-link">Contact Us</Link>
          <button type="button" className="footer-link footer-button" onClick={handleManageCookies}>
            Manage Cookies
          </button>
        </nav>
        <p className="footer-credits">{creditsText}</p>
      </div>
    </footer>
  );
}