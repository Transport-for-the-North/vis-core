import { Link } from "react-router-dom";
import './Footer.styles.css'

export function Footer() {
  return (
    <footer className="footer">
      <div className="bottom-footer">
        <p className="credits-footer">
          © Transport for the North 2024. All rights reserved.
        </p>
        <div className="empty"></div>
        <Link to={"https://transportforthenorth.com/privacy-policy/"} className="footer-links">Privacy Policy</Link>
        <Link to={"https://transportforthenorth.com/cookies/"} className="footer-links">Cookies</Link>
        <Link to={"https://transportforthenorth.com/about-transport-for-the-north/contact-us/"} className="footer-links">Contact Us</Link>
      </div>
    </footer>
  );
}
