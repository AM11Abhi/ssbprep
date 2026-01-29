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
          home
        </NavLink>
        <NavLink 
          to="/practice" 
          className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
        >
          practice
        </NavLink>
        <NavLink 
          to="/about" 
          className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
        >
          about
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
