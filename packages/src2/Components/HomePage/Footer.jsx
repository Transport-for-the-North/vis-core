import { Link } from "react-router-dom";
import "./Footer.styles.css";

export function Footer({ creditsText, privacyPolicyLink, cookiesLink, contactUsLink }) {
  return (
    <footer className="footer">
      <div className="footer-container">
        <nav className="footer-nav">
          <Link to={privacyPolicyLink} className="footer-link">Privacy Policy</Link>
          <Link to={cookiesLink} className="footer-link">Cookies</Link>
          <Link to={contactUsLink} className="footer-link">Contact Us</Link>
        </nav>
        <p className="footer-credits">{creditsText}</p>
      </div>
    </footer>
  );
}