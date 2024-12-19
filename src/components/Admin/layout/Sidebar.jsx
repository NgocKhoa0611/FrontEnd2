import React from 'react';
import { Link } from 'react-router-dom'; // Import Link từ React Router
import { useAuth } from '../../../context/AuthContext'; // Import AuthContext
import logo from '../assets/images/logo1.png';
import './MainContent.css';

function Sidebar() {
  const { logout } = useAuth(); // Get the logout function from AuthContext

  const handleLogout = () => {
    logout(); // Call the logout method to clear user session and redirect
  };

  return (
    <div className="sidebar">
      <div className="user-info">
        <img src={logo} alt="User" className="main-logo" />
      </div>
      <nav>
        <ul>
          <li><Link to={`/admin`}>Dashboards</Link></li>
          <li><Link to={`/admin/categorieslist`}>Quản lí danh mục</Link></li>
          <li><Link to={`/admin/productlist`}>Quản lí sản phẩm</Link></li>
          <li><Link to={`/admin/orderslist`}>Quản lí đơn hàng</Link></li>
          <li><Link to={`/admin/userslist`}>Quản lí người dùng</Link></li>
        </ul>
      </nav>
      <button className="logout-btn" onClick={handleLogout}>Đăng xuất</button>
    </div>
  );
}

export default Sidebar;
