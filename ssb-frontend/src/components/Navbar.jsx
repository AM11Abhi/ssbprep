import { NavLink } from 'react-router-dom';

function Navbar({ hidden = false }) {
  if (hidden) return null;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink 
          to="/" 
          className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
        >
          Home
        </NavLink>
        <NavLink 
          to="/practice" 
          className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
        >
          Practice
        </NavLink>
        <NavLink 
          to="/about" 
          className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
        >
          About
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
