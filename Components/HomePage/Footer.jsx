import { Link } from "react-router-dom";
import './Footer.styles.css';

export function Footer({ creditsText, privacyPolicyLink, cookiesLink, contactUsLink }) {
  return (
    <footer className="footer">
      <div className="bottom-footer">
        <p className="credits-footer">
          {creditsText}
        </p>
        <div className="empty"></div>
        <Link to={privacyPolicyLink} className="footer-links">Privacy Policy</Link>
        <Link to={cookiesLink} className="footer-links">Cookies</Link>
        <Link to={contactUsLink} className="footer-links">Contact Us</Link>
      </div>
    </footer>
  );
}

