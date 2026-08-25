import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Navbar from '../landingPage/Navbar';
import Footer from '../landingPage/Footer';
import './NotFound.css';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="notfound-page">
      <Navbar />

      <main className="notfound-content">
        <div className="notfound-inner">
          <h1 className="notfound-code">404</h1>

          <h2 className="notfound-title">Page Not Found</h2>

          <p className="notfound-desc">
            The page you are looking for doesn't exist, has been removed, or the link may be broken.
            {/* The memory address you are trying to access does not exist or has been relocated. */}
            {/* We can't find the page you're looking for. It might have been moved, deleted, or the URL might be mistyped. */}
          </p>

          <div className="notfound-actions">
            <Link to="/" className="btn-primary">
              <Home size={18} />
              <span>Return to Core</span>
            </Link>

            <button onClick={() => navigate(-1)} className="btn-secondary" type="button">
              <ArrowLeft size={18} />
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
