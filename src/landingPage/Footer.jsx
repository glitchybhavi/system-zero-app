import './styles/Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top-section">
        <div className="footer-project-container">
          <h2 className="footer-project-statement">Execute the theory.</h2>
          <p className="footer-project-desc">
            Bridging the intuition gap in computer science education. Watch the machine think.
          </p>
        </div>

        <div className="footer-nav-grid">
          <div className="footer-nav-col">
            <h5>Platform</h5>
            <a href="#">Hardware Sandbox</a>
            <a href="#">OS Visualizer</a>
            <a href="#">Documentation</a>
          </div>
          <div className="footer-nav-col">
            <h5>Company</h5>
            <a href="#">About Us</a>
            <a href="https://github.com/glitchybhavi/system-zero-app.git" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </div>
      </div>

      {/* Middle Section (Overlapping Watermark Typography) */}
      <div className="footer-middle-section">
        <h1>System Zero</h1>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom-section">
        <div className="footer-logo">
          © 2026 System Zero
        </div>
        <div className="footer-bottom-links">
          <a href="#">About System Zero</a>
          <a href="#">Products</a>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </div>
      </div>
    </footer>
  );
}
