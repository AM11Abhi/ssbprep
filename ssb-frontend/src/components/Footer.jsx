import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <Link to="/about" className="footer-link">About</Link>
        <a href="mailto:abhinav7268@gmail.com" className="footer-link">Contact</a>
        <a href="https://github.com/AM11Abhi" target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
        <span className="footer-copyright">© SSB Prep</span>
      </div>
    </footer>
  );
}

export default Footer;
