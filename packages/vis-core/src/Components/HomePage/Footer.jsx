import { Link } from "react-router-dom";
import { formatVisCoreBuildInfoForFooter, getVisCoreSourceUrl } from "utils/buildInfo";
import "./Footer.styles.css";

export function Footer({ creditsText, privacyPolicyLink, cookiesLink, contactUsLink }) {
  const buildInfo = formatVisCoreBuildInfoForFooter();
  const visCoreSourceUrl = getVisCoreSourceUrl();

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
        <p className="footer-build-info">
          <a
            className="footer-build-info-link"
            href={visCoreSourceUrl}
            target="_blank"
            rel="noreferrer"
          >
            {buildInfo}
          </a>
        </p>
      </div>
    </footer>
  );
}