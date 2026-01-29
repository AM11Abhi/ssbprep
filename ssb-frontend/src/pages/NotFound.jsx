import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

function NotFound() {
  return (
    <>
      <Navbar />
      <div className="page-container centered">
        <h1 className="heading-lg">page not found</h1>
        <p className="text-description">
          The page you're looking for doesn't exist.
        </p>
        <div style={{ marginTop: '32px' }}>
          <Link to="/" className="btn btn-primary">
            Return Home
          </Link>
        </div>
      </div>
    </>
  );
}

export default NotFound;
