import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';
import './Layout.css';

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', path: '/', icon: 'bi-speedometer2' },
    { text: 'Categories', path: '/categories', icon: 'bi-tags' },
    { text: 'Add Transaction', path: '/transactions/new', icon: 'bi-plus-circle' },
  ];

  return (
    <div className="app-container d-flex">
      {/* Sidebar */}
      <nav className={`sidebar-container d-flex flex-column flex-shrink-0 p-3 bg-light ${sidebarOpen ? 'show' : ''}`} style={{ width: 240, minHeight: '100vh', position: 'fixed', zIndex: 1040 }}>
        <div className="drawer-header mb-3 d-flex align-items-center justify-content-between">
          <span className="fs-5 fw-bold">Finance Tracker</span>
          <button className="btn btn-link d-md-none" onClick={() => setSidebarOpen(false)}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        <ul className="nav nav-pills flex-column mb-auto">
          {menuItems.map((item) => (
            <li className="nav-item" key={item.text}>
              <button
                className={`nav-link text-start w-100 d-flex align-items-center ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
              >
                <i className={`bi ${item.icon} me-2`}></i>
                {item.text}
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-auto">
          {isAuthenticated && (
            <button className="btn btn-logout w-100 d-flex align-items-center justify-content-center mt-3" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-2"></i> Logout
            </button>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-grow-1" style={{ marginLeft: 240 }}>
        <div className="main-content" style={{ padding: 24 }}>
          <Outlet />
        </div>
      </div>
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-25 d-md-none" style={{ zIndex: 1030 }} onClick={() => setSidebarOpen(false)}></div>}
    </div>
  );
}

export default Layout; 